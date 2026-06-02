@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"
if not exist "node_modules\" (
  echo Installing dependencies...
  call npm install
)
call npm run dev
