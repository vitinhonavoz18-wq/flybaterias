"""Gera as versões com fundo transparente da logomarca (clara e escura).
Uso: python3 scripts/process-logo.py  (requer pillow, numpy, scipy)"""
from PIL import Image, ImageDraw
import numpy as np
from scipy import ndimage

im = Image.open('scripts/logo-source.webp').convert('RGB')
crop = im.crop((55, 320, 1225, 960))
a = np.asarray(crop).astype(float)
bg = np.array([245, 247, 251.])
dist = np.sqrt(((a - bg) ** 2).sum(-1))
near = (dist < 60)
lab, n = ndimage.label(near)
border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
outside = np.isin(lab, list(border))
soft = np.clip((dist - 8) / 52, 0, 1) * 255
alpha = np.where(outside, soft, 255.0)
sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
for i, s in enumerate(sizes, 1):
    comp = lab == i
    if outside[comp].any():
        continue
    if s < 4000:  # miolos das letras
        alpha[comp] = soft[comp]
al = alpha[..., None] / 255
fg = np.where(al > 0.02, (a - bg * (1 - al)) / np.maximum(al, 1e-3), a)
fg = np.clip(fg, 0, 255)
img = Image.fromarray(np.dstack([fg, alpha]).astype(np.uint8), 'RGBA')
img = img.crop(Image.fromarray(((alpha > 30) * 255).astype(np.uint8)).getbbox())
img.save('public/brand/flybaterias-logo.png')
print('light', img.size)
o = np.asarray(img).astype(float)
r, g, b = o[..., 0], o[..., 1], o[..., 2]
mx = np.maximum(np.maximum(r, g), b); mn = np.minimum(np.minimum(r, g), b)
lum = 0.299 * r + 0.587 * g + 0.114 * b
dark = (mx - mn < 40) & (lum < 110)
o2 = o.copy()
for c in range(3):
    o2[..., c] = np.where(dark, 255 - lum * 0.15, o[..., c])
Image.fromarray(o2.astype(np.uint8), 'RGBA').save('public/brand/flybaterias-logo-dark.png')
# ícone (somente a bateria) para favicon
icon = img.crop((470, 0, 1080, 360))
side = max(icon.size)
sq = Image.new('RGBA', (side, side), (0, 0, 0, 0)); sq.paste(icon, ((side - icon.size[0]) // 2, (side - icon.size[1]) // 2))
sq.resize((512, 512), Image.LANCZOS).save('public/brand/flybaterias-icon.png')
print('done')

# Versão negativa (fundo escuro): clareia os azuis muito escuros para manter a leitura
o3 = np.asarray(Image.open('public/brand/flybaterias-logo-dark.png')).astype(float)
r, g, b, a_ = o3[..., 0], o3[..., 1], o3[..., 2], o3[..., 3]
lum = 0.299 * r + 0.587 * g + 0.114 * b
deep_blue = (b > r + 40) & (b > g + 25) & (lum < 120)
k = np.where(deep_blue, np.clip(1.0 + (120 - lum) / 120 * 0.9, 1, 1.9), 1.0)
for c in range(3):
    o3[..., c] = np.clip(o3[..., c] * k + np.where(deep_blue, 18, 0), 0, 255)
neg = Image.fromarray(o3.astype(np.uint8), 'RGBA')
neg.save('public/brand/flybaterias-logo-dark.png')
for w, name in [(640, 'flybaterias-logo-dark.webp'), (320, 'flybaterias-logo-dark-320.webp')]:
    t = neg.copy(); t.thumbnail((w, w)); t.save('public/brand/' + name, quality=90, method=6)
t = img.copy(); t.thumbnail((640, 640)); t.save('public/brand/flybaterias-logo.webp', quality=90, method=6)
print('negative ok')
