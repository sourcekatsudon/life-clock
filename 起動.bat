@echo off
chcp 65001 > nul
rem 人生時計アプリ簡易ランチャー
echo ================================================
echo        人生時計アプリ簡易ランチャー
echo ================================================

cd /d "%~dp0"

rem 環境のチェックと設定
if not exist venv\ (
  echo [情報] 初回起動のため環境を準備します...
  echo [情報] この処理は少し時間がかかることがあります。
  python -m venv venv
  call venv\Scripts\activate.bat
  pip install -r requirements.txt
) else (
  echo [情報] 環境をアクティベートしています...
  call venv\Scripts\activate.bat
)

rem PyQt5のプラグインパスを設定
for /f "delims=" %%i in ('python -c "import sys; print(sys.prefix)"') do set PYTHONPREFIX=%%i
set QT_PLUGIN_PATH=%PYTHONPREFIX%\Lib\site-packages\PyQt5\Qt5\plugins
set QT_QPA_PLATFORM_PLUGIN_PATH=%PYTHONPREFIX%\Lib\site-packages\PyQt5\Qt5\plugins\platforms
set PATH=%PYTHONPREFIX%\Lib\site-packages\PyQt5\Qt5\bin;%PATH%

echo [情報] Qt プラグインパス: %QT_PLUGIN_PATH%
echo [情報] Qt プラットフォームパス: %QT_QPA_PLATFORM_PLUGIN_PATH%

rem オプション1: 環境変数をファイルに書き出して実行時に読み込む
echo @echo off > qt_env.bat
echo set QT_PLUGIN_PATH=%QT_PLUGIN_PATH% >> qt_env.bat
echo set QT_QPA_PLATFORM_PLUGIN_PATH=%QT_QPA_PLATFORM_PLUGIN_PATH% >> qt_env.bat
echo set PATH=%PYTHONPREFIX%\Lib\site-packages\PyQt5\Qt5\bin;%%PATH%% >> qt_env.bat

echo.
echo [情報] 人生時計アプリを起動しています...
echo.

rem アプリを起動し、エラーチェックを行う
call qt_env.bat && python run.py
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo [警告] アプリの起動に失敗しました。PyQt5を再インストールします...
  pip uninstall -y PyQt5 PyQt5-Qt5 PyQt5-sip
  pip install PyQt5
  echo.
  echo [情報] 再度アプリを起動しています...
  python run.py
)

echo.
echo [情報] アプリを終了しました。
echo [情報] 何かキーを押すと終了します...
pause
