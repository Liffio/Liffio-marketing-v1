@echo off
setlocal enabledelayedexpansion

:: FPS = screenshots per second
set FPS=2

for %%F in (*.mp4) do (
    set "NAME=%%~nF"

    echo Processing %%F...

    if not exist "!NAME!" (
        mkdir "!NAME!"
    )

    ffmpeg -i "%%F" -vf fps=%FPS% "!NAME!\frame_%%04d.png"

    echo Done: %%F
)

echo.
echo All videos processed.
pause