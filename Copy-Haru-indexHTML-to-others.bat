@echo off
cd /d %~dp0

copy /y "docs\haru\index.html" "docs\erwin\index.html"
copy /y "docs\haru\index.html" "docs\lily\index.html"
copy /y "docs\haru\index.html" "docs\stella\index.html"
copy /y "docs\haru\index.html" "docs\jin\index.html"
copy /y "docs\haru\index.html" "docs\iris\index.html"
copy /y "docs\haru\index.html" "docs\chii\index.html"

echo. "Finished"