from PIL import Image, ImageDraw, ImageFont

image_size = 2048
circle_color = "white"
text_color = "black"
background_color = (255, 255, 255, 0)

img = Image.new("RGBA", (image_size, image_size), background_color)
draw = ImageDraw.Draw(img)

circle_radius = image_size // 2 - 64
circle_center = (image_size // 2, image_size // 2)
draw.ellipse(
  [circle_center[0] - circle_radius, circle_center[1] - circle_radius,
    circle_center[0] + circle_radius, circle_center[1] + circle_radius],
  fill=circle_color
)

font_path = "/workspace/logo.ttf"
font_size = int(image_size)
font = ImageFont.truetype(font_path, font_size)

text = "♪"
draw.text(
  (image_size // 2 + 36, image_size // 2 - 36),
  text,
  font=font,
  fill=text_color,
  anchor="mm"
)

img = img.resize((512, 512), Image.Resampling.LANCZOS)
img.save("/workspace/logo_512.png", "PNG")
img = img.resize((192, 192), Image.Resampling.LANCZOS)
img.save("/workspace/logo_192.png", "PNG")
img = img.resize((180, 180), Image.Resampling.LANCZOS)
img.save("/workspace/apple-touch-icon.png", "PNG")
img = img.resize((32, 32), Image.Resampling.LANCZOS)
img.save("/workspace/favicon.ico", "ICO")

print("Transparent background logo image saved as 'logo.png'")
