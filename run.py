#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import json
import subprocess
import platform

# PyQt5のプラグインパスを設定（Windows環境用）
if platform.system() == 'Windows':
    import site
    try:
        # 仮想環境とグローバル環境のどちらでも動くように設定
        site_packages = site.getsitepackages()[0]
        qt_plugin_path = os.path.join(site_packages, 'PyQt5', 'Qt5', 'plugins')
        if os.path.exists(qt_plugin_path):
            os.environ['QT_PLUGIN_PATH'] = qt_plugin_path
            os.environ['QT_QPA_PLATFORM_PLUGIN_PATH'] = os.path.join(qt_plugin_path, 'platforms')
            print(f"Qt プラグインパスを設定しました: {qt_plugin_path}")
    except Exception as e:
        print(f"環境変数の設定中にエラーが発生しました: {e}")

def check_requirements():
    """必要なライブラリがインストールされているか確認"""
    try:
        import PyQt5
        import PIL
        import dateutil
        print("必要なライブラリが見つかりました。")
        return True
    except ImportError as e:
        print(f"必要なライブラリがインストールされていません: {e}")
        print("pip install PyQt5 pillow python-dateutil を実行してインストールしてください。")
        return False

def setup_resources():
    """リソースをセットアップ"""
    # 設定ファイルがなければ作成
    if not os.path.exists('config.json'):
        default_config = {
            "birth_date": "1990-01-01",
            "life_expectancy": 80,
            "clock_face": "default.png"
        }
        with open('config.json', 'w', encoding='utf-8') as f:
            json.dump(default_config, f, indent=4, ensure_ascii=False)
            print("デフォルト設定ファイルを作成しました。")
    
    # imagesディレクトリがなければ作成
    os.makedirs('images', exist_ok=True)
    
    # フォントディレクトリがなければ作成
    os.makedirs('fonts', exist_ok=True)
    
    # 時計文字盤の画像を作成
    if not os.path.exists(os.path.join('images', 'default.png')):
        print("時計文字盤の画像を生成中...")
        try:
            from create_clock_face import create_clock_face
            create_clock_face(os.path.join('images', 'default.png'))
            create_clock_face(os.path.join('images', 'retro_brown.png'), color="retro")
        except Exception as e:
            print(f"時計文字盤の生成中にエラーが発生しました: {e}")
    
    # フォントのダウンロード
    try:
        from download_font import download_font
        download_font()
    except Exception as e:
        print(f"フォントのダウンロード中にエラーが発生しました: {e}")

def run_application():
    """アプリケーションを実行"""
    # 人生時計アプリを起動
    from life_clock import LifeClockApp, QApplication
    
    print("人生時計アプリを起動中...")
    app = QApplication(sys.argv)
    clock = LifeClockApp()
    clock.show()
    sys.exit(app.exec_())

def main():
    """メイン関数"""
    print("人生時計アプリセットアップ")
    print("-------------------------")
    
    # 必要な依存関係を確認
    if not check_requirements():
        return
    
    # リソースをセットアップ
    setup_resources()
    
    # アプリケーションを実行
    run_application()

if __name__ == "__main__":
    main()
