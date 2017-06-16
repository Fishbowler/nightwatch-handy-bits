@echo off
@setlocal enableextensions
@%~d0
@cd /d "%~dp0"

REM A script to install the pre-reqs and rewrite your nightwatch.json with the appropriate settings.


REM Admin permission check 
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Got admin rights.
) else (
    goto error_admin_rights_required
)

REM Install nightwatch globally
call npm install -g nightwatch
if %errorLevel% == 0 (
    echo Nightwatch installed / upgraded successfully.
) else (
    goto error_nightwatch_install_failed
)

REM Install any local dependencies
call npm install
if %errorLevel% == 0 (
    echo Dependencies installed / upgraded successfully.
) else (
    goto error_npm_install_failed
)

REM TODO: A failure check
call "node_modules\.bin\selenium-standalone.cmd" install 
echo Selenium binaries downloaded

REM TODO: A failure check
regedit.exe /s client_configs\IE11_config.reg
echo IE11 Selenium config applied

REM TODO: A failure check
node client_configs\dependency_configure.js
echo Nightwatch config file updated

echo SUCCESS! Configured!
pause
goto very_end

:error_admin_rights_required
echo ERROR! Admin rights required!
pause
goto very_end

:error_nightwatch_install_failed
echo ERROR! Nightwatch install failed!
pause
goto very_end

:error_npm_install_failed
echo ERROR! Dependencies install failed!
pause
goto very_end

:very_end