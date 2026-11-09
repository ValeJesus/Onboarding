@echo off
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8000/index.html
  py -m http.server 8000
) else (
  where python >nul 2>nul
  if %errorlevel%==0 (
    start "" http://localhost:8000/index.html
    python -m http.server 8000
  ) else (
    echo Python nao foi encontrado para criar servidor local.
    echo Abrindo index.html diretamente no navegador...
    start "" "%~dp0index.html"
  )
)
