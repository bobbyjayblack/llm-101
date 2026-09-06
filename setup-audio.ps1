$ErrorActionPreference = 'Stop'
try {
    $uv = (Get-Command uv -ErrorAction Stop).Source
    $python = Join-Path $PSScriptRoot '.venv\Scripts\python.exe'
    if (-not (Test-Path -LiteralPath $python)) {
        & $uv venv --python 3.12 (Join-Path $PSScriptRoot '.venv')
        if ($LASTEXITCODE -ne 0) { throw 'Unable to create the Python environment.' }
    }
    Write-Host 'Installing local speech runtime. First setup downloads several GB; later runs reuse it.'
    & $uv pip install --python $python torch==2.10.0 torchaudio==2.10.0 --index-url https://download.pytorch.org/whl/cu128
    if ($LASTEXITCODE -ne 0) { throw 'CUDA PyTorch installation failed.' }
    & $uv pip install --python $python -r (Join-Path $PSScriptRoot 'requirements-audio.txt')
    if ($LASTEXITCODE -ne 0) { throw 'Speech dependency installation failed.' }
    & $python (Join-Path $PSScriptRoot 'audio_service.py') --prepare
    if ($LASTEXITCODE -ne 0) { throw 'Model download or voice preparation failed.' }
    $logDirectory = Join-Path $PSScriptRoot '.service'
    New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null
    $signature = (Get-FileHash (Join-Path $PSScriptRoot 'requirements-audio.txt')).Hash + (Get-FileHash (Join-Path $PSScriptRoot 'voices.json')).Hash + (Get-FileHash (Join-Path $PSScriptRoot 'alignment.py')).Hash
    Set-Content -LiteralPath (Join-Path $logDirectory 'audio-setup.txt') -Value $signature
    Write-Host 'Local audio setup complete.'
} catch {
    Write-Host "Audio setup failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host 'Requires Node.js, uv (https://docs.astral.sh/uv/), and an NVIDIA GPU with a current driver.'
    exit 1
}
