@echo off
title Mario 2D
cd /d "%~dp0"
py server.py 8000 2>nul || python server.py 8000 2>nul || python3 server.py 8000
pause
