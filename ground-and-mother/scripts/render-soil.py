"""Renders the seamless soil texture used behind the opening scene.

Procedural, not photographic: periodic noise (blurred in the Fourier domain so the tile
wraps without seams), shaded as a height field under a low raking light, with crumbs,
fine grit and a few pale mineral specks. Reproducible: same seed, same image.

  python3 scripts/render-soil.py   →   public/textures/soil.jpg
"""
import numpy as np
from PIL import Image

N = 1024
rng = np.random.default_rng(20261102)
fx = np.fft.fftfreq(N)[:, None]
fy = np.fft.fftfreq(N)[None, :]
f2 = fx * fx + fy * fy

def field(sigma):
    noise = rng.standard_normal((N, N))
    k = np.exp(-2 * (np.pi ** 2) * (sigma ** 2) * f2)
    out = np.real(np.fft.ifft2(np.fft.fft2(noise) * k))
    return (out - out.mean()) / (out.std() + 1e-9)

large, mid, fine, grit = field(48), field(9), field(2.6), field(0.8)

# Crumbs: rounded clods from thresholded mid/fine noise.
crumbs = np.clip((mid * 0.7 + fine * 0.5 - 0.35) * 1.6, 0, 1)
height = large * 0.35 + mid * 0.55 + fine * 0.35 + crumbs * 1.2 + grit * 0.08

# Shade the height field with a raking light from the upper left.
gy, gx = np.gradient(height)
nx, ny, nz = -gx * 2.2, -gy * 2.2, np.ones_like(height)
norm = np.sqrt(nx ** 2 + ny ** 2 + nz ** 2)
lx, ly, lz = -0.55, -0.55, 0.63
shade = np.clip((nx * lx + ny * ly + nz * lz) / norm, 0, 1)

# Moisture variation: darker, wetter patches.
wet = np.clip(0.5 + large * 0.22 + mid * 0.08, 0, 1)

dark = np.array([24, 16, 10], float)
light = np.array([96, 70, 48], float)
t = np.clip(shade ** 1.6 * 0.9 + crumbs * 0.12 - wet * 0.22 + 0.12, 0, 1)
img = dark[None, None, :] * (1 - t[..., None]) + light[None, None, :] * t[..., None]

# Pale mineral specks and dark organic flecks.
specks = (rng.random((N, N)) > 0.9985).astype(float)
specks = np.real(np.fft.ifft2(np.fft.fft2(specks) * np.exp(-2 * np.pi ** 2 * 0.9 ** 2 * f2)))
specks = np.clip(specks * 3.5, 0, 1)
img = img * (1 - specks[..., None] * 0.7) + np.array([170, 150, 122])[None, None, :] * specks[..., None] * 0.7
flecks = np.clip((fine - 2.4) * 0.8, 0, 1)
img = img * (1 - flecks[..., None] * 0.5)

# Film-like grain.
img += rng.normal(0, 3.2, img.shape)
Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save("public/textures/soil.jpg", quality=82, optimize=True, progressive=True)
print("wrote public/textures/soil.jpg")
