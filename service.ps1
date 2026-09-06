param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('start', 'stop')]
    [string]$Action
)
$ErrorActionPreference = 'Stop'
$logDirectory = Join-Path $PSScriptRoot '.service'
$webScript = Join-Path $PSScriptRoot 'server.mjs'
$audioScript = Join-Path $PSScriptRoot 'audio_service.py'
$renderScript = Join-Path $PSScriptRoot 'prerender-audio.mjs'
$python = Join-Path $PSScriptRoot '.venv\Scripts\python.exe'
$webPattern = '^\s*(?:"[^"]*\\node\.exe"|[^\s"]*node\.exe)\s+"' + [regex]::Escape($webScript) + '"\s*$'
$audioPattern = '^\s*(?:"[^"]*\\python\.exe"|[^\s"]*python\.exe)\s+-u\s+"' + [regex]::Escape($audioScript) + '"\s*$'
$renderPattern = '^\s*(?:"[^"]*\\node\.exe"|[^\s"]*node\.exe)\s+"' + [regex]::Escape($renderScript) + '"\s*$'
$started = @()
$lock = $null
$sha = [System.Security.Cryptography.SHA256]::Create()
try { $appId = -join ($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes($PSScriptRoot.ToLowerInvariant())) | ForEach-Object { $_.ToString('x2') }) }
finally { $sha.Dispose() }
$appId = $appId.Substring(0, 16)

function Find-Servers($name, $pattern) {
    @(Get-CimInstance Win32_Process -Filter "Name = '$name'" | Where-Object { $_.CommandLine -match $pattern })
}
function Stop-Owned($server, $pattern) {
    $current = Get-CimInstance Win32_Process -Filter "ProcessId = $($server.ProcessId)"
    if ($current -and $current.CreationDate -eq $server.CreationDate -and $current.CommandLine -match $pattern) {
        Stop-Process -Id $server.ProcessId -ErrorAction Stop
        Wait-Process -Id $server.ProcessId -Timeout 10 -ErrorAction SilentlyContinue
    }
}
function Assert-FreePort($port) {
    $probe = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, $port)
    try { $probe.Start() }
    catch { throw "Port $port is already in use by another process. Stop that process in its own terminal first." }
    finally { $probe.Stop() }
}
function Wait-Ready($port, $service, $seconds) {
    $deadline = [DateTime]::UtcNow.AddSeconds($seconds)
    $nextUpdate = [DateTime]::UtcNow
    while ([DateTime]::UtcNow -lt $deadline) {
        $health = $null
        try { $health = Invoke-RestMethod -Uri "http://127.0.0.1:$port/health" -TimeoutSec 2 }
        catch { }
        if ($health) {
            if ($health.service -ne $service -or $health.appId -ne $appId) { throw "Port $port belongs to a different service." }
            if ($health.status -eq 'error') { throw "Audio model failed to load: $($health.error)" }
            if ($service -eq 'llm101-web' -or $health.status -eq 'ready') { return }
        }
        $running = if ($service -eq 'llm101-web') { @(Find-Servers 'node.exe' $webPattern) } else { @(Find-Servers 'python.exe' $audioPattern) }
        if ($running.Count -eq 0) { throw "$service exited. See logs in $logDirectory" }
        if ([DateTime]::UtcNow -ge $nextUpdate) {
            Write-Host "Waiting for $service to become ready..."
            $nextUpdate = [DateTime]::UtcNow.AddSeconds(15)
        }
        Start-Sleep -Milliseconds 500
    }
    throw "$service did not become ready within $seconds seconds. See logs in $logDirectory"
}

try {
    New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null
    # Serialize double clicks so they cannot launch duplicate models or race stop/start.
    try { $lock = [IO.File]::Open((Join-Path $logDirectory 'launcher.lock'), 'OpenOrCreate', 'ReadWrite', 'None') }
    catch { throw 'Another start or stop is in progress. Please wait for it to finish.' }
    if ($Action -eq 'stop') {
        foreach ($server in @(Find-Servers 'node.exe' $renderPattern)) { Stop-Owned $server $renderPattern }
        foreach ($server in @(Find-Servers 'node.exe' $webPattern)) { Stop-Owned $server $webPattern }
        # A venv Python may have both a launcher and a child; match and stop both.
        foreach ($server in @(Find-Servers 'python.exe' $audioPattern)) { Stop-Owned $server $audioPattern }
        Write-Host 'LLM 101 web service and audio model stopped. GPU memory is released.'
        exit 0
    }

    $node = (Get-Command node.exe -ErrorAction Stop).Source
    $webServers = @(Find-Servers 'node.exe' $webPattern)
    $audioServers = @(Find-Servers 'python.exe' $audioPattern)
    if ($webServers.Count -eq 0) { Assert-FreePort 4173 }
    if ($audioServers.Count -eq 0) { Assert-FreePort 4174 }
    $signature = (Get-FileHash (Join-Path $PSScriptRoot 'requirements-audio.txt')).Hash + (Get-FileHash (Join-Path $PSScriptRoot 'voices.json')).Hash + (Get-FileHash (Join-Path $PSScriptRoot 'alignment.py')).Hash
    $marker = Join-Path $logDirectory 'audio-setup.txt'
    $prepared = (Test-Path -LiteralPath $python) -and (Test-Path -LiteralPath $marker)
    if ($prepared) { $prepared = ((Get-Content -LiteralPath $marker -Raw).Trim() -eq $signature) }
    if (-not $prepared) {
        if ($audioServers.Count -gt 0) { throw 'Audio setup changed. Run stop.bat, then start.bat again.' }
        & powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'setup-audio.ps1')
        if ($LASTEXITCODE -ne 0) { throw 'Audio setup failed. See the error above; rerun start.bat to retry.' }
    }
    if ($audioServers.Count -eq 0) {
        $process = Start-Process -FilePath $python -ArgumentList ('-u "{0}"' -f $audioScript) -WorkingDirectory $PSScriptRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $logDirectory 'audio-stdout.log') -RedirectStandardError (Join-Path $logDirectory 'audio-stderr.log')
        $started += 'audio'
    }
    Wait-Ready 4174 'llm101-audio' 180
    if ($webServers.Count -eq 0) {
        $process = Start-Process -FilePath $node -ArgumentList ('"{0}"' -f $webScript) -WorkingDirectory $PSScriptRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $logDirectory 'stdout.log') -RedirectStandardError (Join-Path $logDirectory 'stderr.log')
        $started += 'web'
    }
    Wait-Ready 4173 'llm101-web' 15
    if (@(Find-Servers 'node.exe' $renderPattern).Count -eq 0) {
        $process = Start-Process -FilePath $node -ArgumentList ('"{0}"' -f $renderScript) -WorkingDirectory $PSScriptRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $logDirectory 'prerender-stdout.log') -RedirectStandardError (Join-Path $logDirectory 'prerender-stderr.log')
    }
    Write-Host 'Course and local AI narrator ready at http://127.0.0.1:4173'
    Write-Host 'Missing Claire narration is prepared in the background; saved recordings play immediately.'
    Write-Host 'Run stop.bat to stop both services and unload the audio model.'
} catch {
    # Roll back only services this start launched; leave pre-existing processes alone.
    if ($started -contains 'web') { foreach ($server in @(Find-Servers 'node.exe' $webPattern)) { Stop-Owned $server $webPattern } }
    if ($started -contains 'audio') { foreach ($server in @(Find-Servers 'python.exe' $audioPattern)) { Stop-Owned $server $audioPattern } }
    Write-Host "Unable to ${Action}: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    if ($lock) { $lock.Dispose() }
}
