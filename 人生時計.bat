@echo off
rem 人生時計アプリランチャー
echo ==============================================
echo 人生時計アプリを起動します
echo ==============================================

cd /d "%~dp0"

rem 環境変数の設定
set PYTHONPATH=%cd%
echo 作業ディレクトリ: %cd%

rem 文字コードをUTF-8に設定
chcp 65001 > nul

rem 仮想環境のアクティベート
if exist venv\Scripts\activate.bat (
  echo 仮想環境をアクティベートしています...
  call venv\Scripts\activate.bat
) else (
  echo 仮想環境が見つかりません。新しく作成します...
  python -m venv venv
  call venv\Scripts\activate.bat
  pip install -r requirements.txt
)

rem PyQt5のプラグインパス設定
for /f "delims=" %%i in ('python -c "import sys; print(sys.prefix)"') do set PYTHONPREFIX=%%i
set QT_PLUGIN_PATH=%PYTHONPREFIX%\Lib\site-packages\PyQt5\Qt5\plugins
set QT_QPA_PLATFORM_PLUGIN_PATH=%PYTHONPREFIX%\Lib\site-packages\PyQt5\Qt5\plugins\platforms
set PATH=%PYTHONPREFIX%\Lib\site-packages\PyQt5\Qt5\bin;%PATH%

echo Qt プラグインパス: %QT_PLUGIN_PATH%
echo Qt プラットフォームパス: %QT_QPA_PLATFORM_PLUGIN_PATH%

rem オプション1: 環境変数をファイルに書き出して実行時に読み込む
echo @echo off > qt_env.bat
echo set QT_PLUGIN_PATH=%QT_PLUGIN_PATH% >> qt_env.bat
echo set QT_QPA_PLATFORM_PLUGIN_PATH=%QT_QPA_PLATFORM_PLUGIN_PATH% >> qt_env.bat
echo set PATH=%PYTHONPREFIX%\Lib\site-packages\PyQt5\Qt5\bin;%%PATH%% >> qt_env.bat

rem アプリの起動
echo アプリを起動しています...
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

rem 終了処理
echo アプリが終了しました
pause
