from PIL import Image, ImageDraw
import os

# ✅ Caminhos dos arquivos
img_path = r"F:\VCode\Projetos VsCode\Spring-boot\projeto_spring\gatinho1.png"
gif_path = r"F:\VCode\Projetos VsCode\Spring-boot\gatinho_brilhante.gif"

# ✅ Verifica se o arquivo existe
if not os.path.exists(img_path):
    print(f"❌ ERRO: O arquivo '{img_path}' não foi encontrado. Verifique o caminho!")
    exit()

# ✅ Abre a imagem
img_base = Image.open(img_path).convert("RGBA")

# ✅ Cria a lista de frames
frames = []
num_frames = 10

# ✅ Posição dos olhos e do sorriso (ajuste fino se necessário)
eye_left = (520, 230, 600, 310)
eye_right = (680, 230, 760, 310)
smile = [(590, 350), (620, 370), (680, 370), (710, 350), (620, 390)]

# ✅ Gera os quadros da animação
for i in range(num_frames):
    frame = img_base.copy()
    draw = ImageDraw.Draw(frame)

    # Alterna entre branco e um brilho azul claro
    brightness = 255 if i % 2 == 0 else 180  # Alterna entre claro e escuro
    eye_color = (brightness, brightness, brightness)  # Branco brilhante
    smile_color = (brightness, brightness, 255)  # Azul claro brilhante

    # Desenha os olhos e sorriso com brilho alternando
    draw.ellipse(eye_left, fill=eye_color)
    draw.ellipse(eye_right, fill=eye_color)
    draw.polygon(smile, fill=smile_color)

    frames.append(frame)

# ✅ Salva o GIF animado
frames[0].save(
    gif_path, save_all=True, append_images=frames[1:], duration=100, loop=0
)

print(f"✅ GIF salvo com sucesso em: {gif_path}")
