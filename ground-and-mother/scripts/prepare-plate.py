"""Prepares a scanned plate for the site without altering the artwork.

The scan's white paper is turned into transparency with the standard colour-to-alpha
method: over white the result is pixel-identical to the scan; over the site's ivory it
behaves like the ink printed on that paper (the same result as a multiply blend, but
without a costly blend mode on phones). Inks, lines and colours are not edited.

  python3 scripts/prepare-plate.py public/plates/koehler-135-taraxacum-original.jpg public/plates/koehler-135-taraxacum.webp
"""
import sys
import numpy as np
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
rgb = np.asarray(Image.open(src).convert("RGB")).astype(np.float32) / 255.0
# Treat near-white paper (scan noise) as pure paper before separating ink from paper.
rgb = np.where(rgb > 0.975, 1.0, rgb)
alpha = np.max(1.0 - rgb, axis=2)
safe = np.maximum(alpha, 1e-6)[..., None]
ink = np.clip((rgb - (1.0 - alpha[..., None])) / safe, 0, 1)
out = np.dstack([ink, alpha]) * 255.0
Image.fromarray(out.round().astype(np.uint8), "RGBA").save(dst, "WEBP", quality=88, method=6)
print("wrote", dst)
