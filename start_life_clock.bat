@echo off
rem 人生時計アプリ起動バッチファイル（仮想環境使用）
cd "%~dp0"

rem 仮想環境が存在しない場合は作成
if not exist venv\ (
  echo 仮想環境を作成しています...
  python -m venv venv
  call venv\Scripts\activate.bat
  pip install -r requirements.txt
) else (
  call venv\Scripts\activate.bat
)

rem アプリケーションを実行
python run.py
pause
