@echo off
set s_result=
FOR /F "delims=" %%i IN ('git status') DO set s_result=%%i
set s_result=%s_result:"=%

set s_str=nothing to commit, working tree clean
set s_str=%s_str:"=%
if "%s_result%"=="%s_str%"  goto nothing 
git add .
git status
set msg='autocommit'
git commit -m %msg%
git push
goto commited
:nothing
echo nothing to commit --finished
goto end
:commited
echo commit successful --finished
goto end
:end
pause