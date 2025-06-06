# 人生時計アプリ

このアプリケーションは通常の時計ではなく、人間の人生を時計の針に対応させた「人生時計」を表示するPython製GUIアプリです。レトロなデザインの時計で、あなたの人生の進み具合を視覚的に確認できます。

## 機能

- レトロなデザインの丸時計表示
- 長針：80年（設定可能な寿命）で2周する（現在の年齢を表示）
- 短針：日本標準時の月に対応
- 秒針：1日で1周
- AM/PM表示（人生の前半=AM、後半=PM）
- デジタル表示（中央下部）：
  - 年月日、現在時刻、曜日
  - 誕生日からの経過年月日
  - 残り寿命の年月日時間

## 必要な環境

- Python 3.6以上

## インストールと実行（仮想環境を使用）

このプロジェクトは仮想環境を使用してローカルフォルダ内で環境を完結させることができます。

### 自動インストールと実行

#### Windowsの場合
```
start_life_clock.bat
```
を実行するだけで、仮想環境の構築から実行まですべて自動で行われます。

#### Linux/MacOSの場合
```
chmod +x run.sh
./run.sh
```

### 手動でのセットアップ

1. 仮想環境の作成と有効化：
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/MacOS
source venv/bin/activate
```

2. 依存関係のインストール：
```bash
pip install -r requirements.txt
```

3. アプリケーションの実行：
```bash
python run.py
```

## インストール方法

1. このリポジトリをクローンまたはダウンロードします
2. 必要なライブラリをインストールします：

```bash
pip install PyQt5 pillow python-dateutil
```

## 使い方

1. `run.py`を実行するだけです：

```bash
python run.py
```

初回起動時に必要なリソース（時計の文字盤画像やフォント）が自動的にセットアップされます。

## カスタマイズ

設定ファイル`config.json`を編集することで以下の項目をカスタマイズできます：

```json
{
    "birth_date": "1990-01-01",  // あなたの生年月日（YYYY-MM-DD）
    "life_expectancy": 80,        // 想定寿命（年）
    "clock_face": "default.png"   // 使用する時計文字盤画像ファイル
}
```

- `birth_date`: あなたの生年月日をYYYY-MM-DD形式で設定
- `life_expectancy`: 想定寿命（年数）
- `clock_face`: `images`フォルダ内の時計文字盤画像ファイル名

## 時計文字盤のカスタマイズ

独自の時計文字盤画像を使用したい場合は、PNGファイルを`images`フォルダに配置し、`config.json`の`clock_face`パラメータを更新してください。
画像は正方形で、透過背景のPNG形式を推奨します。

デフォルトでは以下の時計文字盤が用意されています：
- `default.png`: 標準的な時計文字盤
- `retro_brown.png`: レトロなブラウンスタイルの文字盤

## カスタム時計文字盤の作成

`create_clock_face.py`スクリプトを使用して、新しい時計文字盤を生成することもできます：

```bash
python create_clock_face.py
```
