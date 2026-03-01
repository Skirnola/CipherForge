/**
 * Playfair Cipher — 5x5 matrix, I/J combined
 */

export function buildPlayfairMatrix(key) {
  const seen = new Set();
  const chars = [];
  const clean = (key + "ABCDEFGHIKLMNOPQRSTUVWXYZ")
    .toUpperCase()
    .replace(/J/g, "I")
    .replace(/[^A-Z]/g, "");
  for (const c of clean) {
    if (!seen.has(c)) {
      seen.add(c);
      chars.push(c);
    }
  }
  const matrix = [];
  for (let i = 0; i < 5; i++) matrix.push(chars.slice(i * 5, i * 5 + 5));
  return matrix;
}

function findPos(matrix, ch) {
  for (let r = 0; r < 5; r++)
    for (let c = 0; c < 5; c++) if (matrix[r][c] === ch) return [r, c];
  return null;
}

function prepareText(text) {
  const clean = text
    .toUpperCase()
    .replace(/J/g, "I")
    .replace(/[^A-Z]/g, "");
  const digraphs = [];
  let i = 0;
  while (i < clean.length) {
    const a = clean[i];
    let b = clean[i + 1] || "X";
    if (a === b) {
      b = "X";
      i++;
    } else {
      i += 2;
    }
    digraphs.push([a, b]);
  }
  return digraphs;
}

export function playfairEncrypt(plaintext, key) {
  if (!key) throw new Error("Key cannot be empty");
  const matrix = buildPlayfairMatrix(key);
  const digraphs = prepareText(plaintext);
  return digraphs
    .map(([a, b]) => {
      const [ra, ca] = findPos(matrix, a);
      const [rb, cb] = findPos(matrix, b);
      if (ra === rb) return matrix[ra][(ca + 1) % 5] + matrix[rb][(cb + 1) % 5];
      if (ca === cb) return matrix[(ra + 1) % 5][ca] + matrix[(rb + 1) % 5][cb];
      return matrix[ra][cb] + matrix[rb][ca];
    })
    .join("");
}

export function playfairDecrypt(ciphertext, key) {
  if (!key) throw new Error("Key cannot be empty");
  const matrix = buildPlayfairMatrix(key);
  const clean = ciphertext
    .toUpperCase()
    .replace(/J/g, "I")
    .replace(/[^A-Z]/g, "");
  const digraphs = [];
  for (let i = 0; i < clean.length; i += 2)
    digraphs.push([clean[i], clean[i + 1] || "X"]);
  return digraphs
    .map(([a, b]) => {
      const [ra, ca] = findPos(matrix, a);
      const [rb, cb] = findPos(matrix, b);
      if (ra === rb) return matrix[ra][(ca + 4) % 5] + matrix[rb][(cb + 4) % 5];
      if (ca === cb) return matrix[(ra + 4) % 5][ca] + matrix[(rb + 4) % 5][cb];
      return matrix[ra][cb] + matrix[rb][ca];
    })
    .join("");
}
