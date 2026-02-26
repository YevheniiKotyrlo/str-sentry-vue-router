@echo off
echo Starting all 4 STR servers...
start "01-bug-vr5" /D "C:\work\str-sentry-vue-router\01-bug-vr5" cmd /c "npx vite --port 5180 --strictPort"
start "02-fix-vr5" /D "C:\work\str-sentry-vue-router\02-fix-vr5" cmd /c "npx vite --port 5181 --strictPort"
start "03-vr4x" /D "C:\work\str-sentry-vue-router\03-vr4x" cmd /c "npx vite --port 5182 --strictPort"
start "04-vr3-legacy" /D "C:\work\str-sentry-vue-router\04-vr3-legacy" cmd /c "npx vite --port 5183 --strictPort"
echo All servers starting. Wait a few seconds, then run tests.
