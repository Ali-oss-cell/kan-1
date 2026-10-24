import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const width = 1200;
const height = 630;
const ink = [0x0f, 0x0f, 0x0f];
const paper = [0xf0, 0xf0, 0xf0];
const periwinkle = [0x92, 0xa4, 0xff];

const glyphs = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01111", "10000", "10000", "10111", "10001", "10001", "01111"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "10101", "01010"],
};

function crc32(buf) {
  let c = ~0;
  for (const byte of buf) {
    c ^= byte;
    for (let k = 0; k < 8; k += 1) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const name = Buffer.from(type);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, crc]);
}

const pixels = Buffer.alloc(width * height * 3);

function setPixel(x, y, color) {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const i = (y * width + x) * 3;
  pixels[i] = color[0];
  pixels[i + 1] = color[1];
  pixels[i + 2] = color[2];
}

function fill(x, y, w, h, color) {
  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) setPixel(xx, yy, color);
  }
}

function drawText(text, x, y, scale, color) {
  let cursor = x;
  for (const char of text) {
    if (char === " ") {
      cursor += scale * 4;
      continue;
    }
    const glyph = glyphs[char];
    if (!glyph) continue;
    glyph.forEach((row, rowIndex) => {
      [...row].forEach((bit, colIndex) => {
        if (bit === "1") fill(cursor + colIndex * scale, y + rowIndex * scale, scale, scale, color);
      });
    });
    cursor += (glyph[0].length + 1) * scale;
  }
}

fill(0, 0, width, height, ink);
fill(0, 0, 36, height, periwinkle);
fill(0, height - 36, width, 36, periwinkle);
drawText("KAN", 96, 170, 28, paper);
drawText("SOFTWARE", 100, 390, 8, periwinkle);
drawText("MARKETING", 100, 460, 8, periwinkle);
drawText("BRAND", 100, 530, 8, paper);

const raw = Buffer.alloc((width * 3 + 1) * height);
for (let y = 0; y < height; y += 1) {
  const row = y * (width * 3 + 1);
  raw[row] = 0;
  pixels.copy(raw, row + 1, y * width * 3, (y + 1) * width * 3);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8;
ihdr[9] = 2;
const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk("IHDR", ihdr),
  chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

const out = path.join(process.cwd(), "public", "brand", "og.png");
fs.writeFileSync(out, png);
console.log(`Wrote ${out} (${png.length} bytes)`);
