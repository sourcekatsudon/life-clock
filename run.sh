#!/bin/bash
# 人生時計アプリを仮想環境で実行するスクリプト

# スクリプトのあるディレクトリに移動
cd "$(dirname "$0")"

# 仮想環境がなければ作成
if [ ! -d "venv" ]; then
  echo "仮想環境を作成します..."
  python -m venv venv
  source venv/Scripts/activate
  pip install -r requirements.txt
else
  source venv/Scripts/activate
fi

# アプリケーションを実行
python run.py

# 終了時に何かキーを押すまで待機
read -p "終了するには何かキーを押してください..."
