# Run the dev server (works when npm is not on PATH yet)
$nodeDir = "C:\Program Files\nodejs"
if (-not (Test-Path "$nodeDir\npm.cmd")) {
  Write-Error "Node.js not found. Install from https://nodejs.org or run: winget install OpenJS.NodeJS.LTS"
  exit 1
}
$env:Path = "$nodeDir;" + $env:Path
Set-Location $PSScriptRoot
if (-not (Test-Path "node_modules")) {
  Write-Host "Installing dependencies..."
  npm install
}
npm run dev
