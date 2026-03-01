/**
 * Affine Cipher
 * E(x) = (a*x + b) mod 26
 * D(x) = a_inv * (x - b) mod 26
 *
 * Valid keys for 'a': 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25 (coprime with 26)
 */

const VALID_A = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];

function modInverse(a, m) {
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) return x;
  }
  return null;
}

export function isValidA(a) {
  return VALID_A.includes(Number(a));
}

export function getValidAValues() {
  return VALID_A;
}

export function affineEncrypt(plaintext, a, b) {
  a = Number(a);
  b = Number(b);
  if (!isValidA(a))
    throw new Error(
      `'a' must be coprime with 26. Valid values: ${VALID_A.join(", ")}`,
    );
  const text = plaintext.toUpperCase().replace(/[^A-Z]/g, "");
  return text
    .split("")
    .map((ch) => {
      const x = ch.charCodeAt(0) - 65;
      return String.fromCharCode(((a * x + b) % 26) + 65);
    })
    .join("");
}

export function affineDecrypt(ciphertext, a, b) {
  a = Number(a);
  b = Number(b);
  if (!isValidA(a))
    throw new Error(
      `'a' must be coprime with 26. Valid values: ${VALID_A.join(", ")}`,
    );
  const aInv = modInverse(a, 26);
  const text = ciphertext.toUpperCase().replace(/[^A-Z]/g, "");
  return text
    .split("")
    .map((ch) => {
      const y = ch.charCodeAt(0) - 65;
      return String.fromCharCode(((aInv * (y - b + 260)) % 26) + 65);
    })
    .join("");
}
