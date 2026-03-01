/**
 * Hill Cipher — 2x2 matrix key
 * Key must be a 2x2 matrix with an inverse mod 26
 */

function det2(m) {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}

function modInverse(a, m) {
  a = ((a % m) + m) % m;
  for (let x = 1; x < m; x++) if ((a * x) % m === 1) return x;
  return null;
}

export function parseMatrix(str) {
  const nums = str
    .trim()
    .split(/[\s,;]+/)
    .map(Number);
  if (nums.length !== 4 || nums.some(isNaN))
    throw new Error("Enter exactly 4 numbers for a 2×2 matrix");
  return [
    [nums[0], nums[1]],
    [nums[2], nums[3]],
  ];
}

export function invertMatrix2x2(m) {
  const det = ((det2(m) % 26) + 26) % 26;
  const detInv = modInverse(det, 26);
  if (detInv === null)
    throw new Error("Matrix is not invertible mod 26 (det has no inverse)");
  return [
    [
      (((detInv * m[1][1]) % 26) + 26) % 26,
      (((-detInv * m[0][1]) % 26) + 26) % 26,
    ],
    [
      (((-detInv * m[1][0]) % 26) + 26) % 26,
      (((detInv * m[0][0]) % 26) + 26) % 26,
    ],
  ];
}

function hillTransform(text, matrix) {
  const nums = text.split("").map((c) => c.charCodeAt(0) - 65);
  // Pad to even length
  if (nums.length % 2 !== 0) nums.push(23); // pad with X
  let result = "";
  for (let i = 0; i < nums.length; i += 2) {
    const a = (matrix[0][0] * nums[i] + matrix[0][1] * nums[i + 1]) % 26;
    const b = (matrix[1][0] * nums[i] + matrix[1][1] * nums[i + 1]) % 26;
    result += String.fromCharCode(a + 65) + String.fromCharCode(b + 65);
  }
  return result;
}

export function hillEncrypt(plaintext, matrixStr) {
  const matrix = parseMatrix(matrixStr);
  invertMatrix2x2(matrix); // validate invertibility
  const text = plaintext.toUpperCase().replace(/[^A-Z]/g, "");
  return hillTransform(text, matrix);
}

export function hillDecrypt(ciphertext, matrixStr) {
  const matrix = parseMatrix(matrixStr);
  const inv = invertMatrix2x2(matrix);
  const text = ciphertext.toUpperCase().replace(/[^A-Z]/g, "");
  return hillTransform(text, inv);
}
