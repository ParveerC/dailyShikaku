# Install dependencies (works when npm is not on PATH yet)
$nodeDir = "C:\Program Files\nodejs"
$env:Path = "$nodeDir;" + $env:Path
Set-Location $PSScriptRoot
npm install
