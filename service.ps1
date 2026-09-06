param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('start', 'stop')]
    [string]$Action
)

$ErrorActionPreference = 'Stop'
$serverPath = Join-Path $PSScriptRoot 'server.mjs'
$url = 'http://127.0.0.1:4173'
# Match only Node running this directory's absolute, quoted server path.
$commandPattern = '^\s*(?:"[^"]*\\node\.exe"|[^\s"]*node\.exe)\s+"' + [regex]::Escape($serverPath) + '"\s*$'

try {
    $servers = @(Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" |
        Where-Object { $_.CommandLine -match $commandPattern })

    if ($Action -eq 'stop') {
        if ($servers.Count -eq 0) {
            Write-Host 'No launcher-managed server is running for this directory.'
        } else {
            foreach ($server in $servers) {
                # Recheck identity immediately before stopping to avoid stale process IDs.
                $current = Get-CimInstance Win32_Process -Filter "ProcessId = $($server.ProcessId)"
                if ($current -and $current.CreationDate -eq $server.CreationDate -and
                    $current.CommandLine -match $commandPattern) {
                    Stop-Process -Id $server.ProcessId -ErrorAction Stop
                }
            }
            Write-Host 'LLM 101 web service stopped.'
        }
        exit 0
    }

    if ($servers.Count -gt 0) {
        Write-Host "LLM 101 is already running at $url"
        exit 0
    }

    $node = (Get-Command node.exe -ErrorAction Stop).Source
    # Do not take over a port occupied by npm start or another application.
    $probe = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 4173)
    try { $probe.Start() }
    catch { throw 'Port 4173 is already in use. Stop the existing server before using start.bat.' }
    finally { $probe.Stop() }

    $logDirectory = Join-Path $PSScriptRoot '.service'
    New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null
    $errorLog = Join-Path $logDirectory 'stderr.log'
    $process = Start-Process -FilePath $node -ArgumentList ('"{0}"' -f $serverPath) `
        -WorkingDirectory $PSScriptRoot -WindowStyle Hidden -PassThru `
        -RedirectStandardOutput (Join-Path $logDirectory 'stdout.log') -RedirectStandardError $errorLog

    for ($attempt = 0; $attempt -lt 20; $attempt++) {
        Start-Sleep -Milliseconds 250
        $process.Refresh()
        if ($process.HasExited) { throw "Server failed to start. See $errorLog" }
        try {
            $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 1
            if ($response.StatusCode -eq 200) {
                Write-Host "LLM 101 started at $url"
                Write-Host 'Run stop.bat to stop the background web service.'
                exit 0
            }
        } catch { }
    }
    if (-not $process.HasExited) { $process.Kill() }
    throw "Server did not become ready. See $errorLog"
} catch {
    Write-Host "Unable to $Action the web service: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
