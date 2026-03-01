/**
 * Vigenere Cipher — Standard 26 alphabet
 */

export function vigenereEncrypt(plaintext, key) {
  const text = plaintext.toUpperCase().replace(/[^A-Z]/g, "");
  const k = key.toUpperCase().replace(/[^A-Z]/g, "");
  if (!k) throw new Error("Key cannot be empty");
  let result = "";
  let ki = 0;
  for (let i = 0; i < text.length; i++) {
    const p = text.charCodeAt(i) - 65;
    const kc = k.charCodeAt(ki % k.length) - 65;
    result += String.fromCharCode(((p + kc) % 26) + 65);
    ki++;
  }
  return result;
}

export function vigenereDecrypt(ciphertext, key) {
  const text = ciphertext.toUpperCase().replace(/[^A-Z]/g, "");
  const k = key.toUpperCase().replace(/[^A-Z]/g, "");
  if (!k) throw new Error("Key cannot be empty");
  let result = "";
  let ki = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i) - 65;
    const kc = k.charCodeAt(ki % k.length) - 65;
    result += String.fromCharCode(((c - kc + 26) % 26) + 65);
    ki++;
  }
  return result;
}
