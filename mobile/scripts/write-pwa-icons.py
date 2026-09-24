#!/usr/bin/env python3
"""Tiny indigo/amber PNG icons for Android Chrome Add to Home screen."""
from pathlib import Path
import struct
import zlib

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "icons"
OUT.mkdir(parents=True, exist_ok=True)


def chunk(tag: bytes, data: bytes) -> bytes:
    return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)


def png(size: int) -> bytes:
    ink = (11, 14, 36)
    amber = (242, 178, 92)
    violet = (143, 125, 255)
    cx = cy = size / 2
    r_outer = size * 0.28
    r_inner = size * 0.05
    rows = []
    for y in range(size):
        row = bytearray([0])
        for x in range(size):
            dx, dy = x - cx + 0.5, y - cy + 0.5
            d = (dx * dx + dy * dy) ** 0.5
            if abs(d - r_outer) < size * 0.035:
                row += bytes(amber)
            elif d < r_inner:
                row += bytes(violet)
            else:
                row += bytes(ink)
        rows.append(bytes(row))
    raw = b"".join(rows)
    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(raw, 9))
        + chunk(b"IEND", b"")
    )


for n in (192, 512):
    (OUT / f"icon-{n}.png").write_bytes(png(n))
print("wrote", OUT)
