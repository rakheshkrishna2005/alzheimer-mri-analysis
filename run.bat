@echo off
REM Start frontend in new terminal
start cmd /k "npm run dev"

REM Start backend in new terminal with venv activated
start cmd /k "cd backend && call venv\Scripts\activate.bat && python run.py"

REM Open browser
start http://localhost:3000
