#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import requests

def download_font():
    """デジタル時計用のフォントをダウンロードする"""
    # フォルダを作成
    os.makedirs("fonts", exist_ok=True)
    
    # フォントファイルの保存先
    font_path = os.path.join("fonts", "digital.ttf")
    
    # すでにフォントが存在する場合はスキップ
    if os.path.exists(font_path):
        print(f"フォントファイルはすでに存在します: {font_path}")
        return

    try:
        # Google Fontsからレトロ風デジタルフォントをダウンロード (Press Start 2P)
        font_url = "https://github.com/google/fonts/raw/main/ofl/pressstart2p/PressStart2P-Regular.ttf"
        
        print("フォントをダウンロード中...")
        response = requests.get(font_url)
        response.raise_for_status()  # エラーがあれば例外を発生
        
        # 直接ファイルとして保存
        with open(font_path, "wb") as f:
            f.write(response.content)
        print(f"フォントをダウンロードしました: {font_path}")
    
    except Exception as e:
        print(f"フォントのダウンロード中にエラーが発生しました: {e}")
        print("デフォルトフォントを使用します。")

if __name__ == "__main__":
    download_font()
