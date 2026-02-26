@echo off
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5180 ^| findstr LISTEN') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5181 ^| findstr LISTEN') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5182 ^| findstr LISTEN') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5183 ^| findstr LISTEN') do taskkill /F /PID %%a 2>nul
