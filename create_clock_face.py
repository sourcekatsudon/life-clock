from PIL import Image, ImageDraw, ImageFont
import os
import math

def create_clock_face(output_path, size=500, color="retro"):
    """レトロなデザインの時計文字盤を作成する関数"""
    # 画像を作成
    image = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(image)
    
    center = size // 2
    radius = int(size * 0.45)  # 時計の半径
    
    # 色の設定
    if color == "retro":
        bg_color = (250, 240, 220, 255)  # ベージュ背景
        face_color = (240, 225, 190, 255)  # やや濃いめのベージュ
        tick_color = (60, 40, 20)  # 茶色の目盛り
        number_color = (40, 30, 10)  # 暗い茶色の数字
        outer_ring_color = (100, 70, 40)  # 濃い茶色の外輪
    elif color == "vintage":
        bg_color = (220, 210, 180, 255)  # アンティーク風ベージュ
        face_color = (200, 190, 160, 255)  # くすんだベージュ
        tick_color = (80, 60, 40)  # アンティーク茶色
        number_color = (60, 40, 20)  # 深い茶色
        outer_ring_color = (120, 100, 60)  # 古めかしい金色
    else:
        bg_color = (240, 240, 240, 255)
        face_color = (220, 220, 220, 255)
        tick_color = (0, 0, 0)
        number_color = (0, 0, 0)
        outer_ring_color = (60, 60, 60)
    
    # 背景の円を描画 - 古めかしい感じを出すために二重の縁取り
    draw.ellipse((center - radius - 15, center - radius - 15,
                center + radius + 15, center + radius + 15),
               fill=(50, 30, 10))  # 最外輪は暗め
    
    draw.ellipse((center - radius - 10, center - radius - 10,
                center + radius + 10, center + radius + 10),
               fill=outer_ring_color)
    
    # 内側の紙のテクスチャ風の背景
    draw.ellipse((center - radius, center - radius,
                center + radius, center + radius),
               fill=face_color)
    
    # 古い紙のテクスチャ風のノイズを追加
    for i in range(1000):
        x = center - radius + int(radius * 2 * (i / 500))
        y = center - radius + int(radius * 2 * ((i % 500) / 500))
        if (x - center)**2 + (y - center)**2 <= radius**2:
            noise = int(30 * ((x * y) % 10) / 10) - 15
            r = min(255, max(0, face_color[0] + noise))
            g = min(255, max(0, face_color[1] + noise))
            b = min(255, max(0, face_color[2] + noise))
            # 1x1の小さな点をランダムな色で描画
            draw.point((x, y), fill=(r, g, b))
    
    # レトロな装飾テクスチャ（かすかな放射線パターン）
    for i in range(0, 360, 6):  # 6度ごとに放射線
        angle = math.radians(i)
        x1 = center + int((radius - 20) * math.cos(angle))
        y1 = center + int((radius - 20) * math.sin(angle))
        x2 = center + int(radius * 0.85 * math.cos(angle))
        y2 = center + int(radius * 0.85 * math.sin(angle))
        draw.line((x1, y1, x2, y2), fill=(180, 170, 150, 50), width=1)
    
    # 時間マーカーを描画
    for i in range(60):
        angle = math.radians(i * 6)  # 6度ごとに目盛り
        length = 10 if i % 5 == 0 else 5  # 5分毎の目盛りを長く
        thickness = 3 if i % 5 == 0 else 1  # 5分毎の目盛りを太く
        
        x1 = center + int(radius * math.cos(angle))
        y1 = center + int(radius * math.sin(angle))
        x2 = center + int((radius - length) * math.cos(angle))
        y2 = center + int((radius - length) * math.sin(angle))
        
        draw.line((x1, y1, x2, y2), fill=tick_color, width=thickness)
    
    # 数字を描画
    try:
        # フォントがあれば読み込む（なければデフォルトフォント）
        font_path = os.path.join("fonts", "vintage.ttf")
        if os.path.exists(font_path):
            font = ImageFont.truetype(font_path, int(radius/10))
        else:
            font = ImageFont.load_default()
    except IOError:
        font = ImageFont.load_default()
    
    # 時間の数字を描画
    for i in range(1, 13):
        angle = math.radians(i * 30 - 90)  # 30度ごとに数字、12時が上にくるように-90度
        x = center + int(radius * 0.8 * math.cos(angle))
        y = center + int(radius * 0.8 * math.sin(angle))
          # 数字の幅を考慮して位置を調整
        # 新しいバージョンではtextbboxを使用
        try:
            # PIL 8.0.0以降
            left, top, right, bottom = draw.textbbox((0, 0), str(i), font=font)
            text_width = right - left
            text_height = bottom - top
        except AttributeError:
            # 古いバージョンのPIL
            try:
                text_width, text_height = draw.textsize(str(i), font=font)
            except:
                text_width, text_height = 10, 10  # フォールバック
        
        x -= text_width // 2
        y -= text_height // 2
        
        draw.text((x, y), str(i), fill=number_color, font=font)
    
    # 時計の中心に装飾的な円を描画
    draw.ellipse((center - 5, center - 5, center + 5, center + 5),
               fill=outer_ring_color, outline=tick_color)
    
    # 画像を保存
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    image.save(output_path)
    print(f"時計文字盤の画像が作成されました: {output_path}")

if __name__ == "__main__":
    # デフォルトの時計文字盤を作成
    output_path = os.path.join("images", "default.png")
    create_clock_face(output_path)
    
    # レトロスタイルの追加文字盤も作成
    output_path = os.path.join("images", "retro_brown.png")
    create_clock_face(output_path, color="retro")
    
    # ビンテージスタイルの文字盤も作成
    output_path = os.path.join("images", "vintage.png")
    create_clock_face(output_path, color="vintage")
