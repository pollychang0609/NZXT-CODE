import * as aesjs from "aes-js";

const key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
// The initialization vector (must be 16 bytes)
const iv = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];

// https://www.npmjs.com/package/aes-js
// CBC - Cipher-Block Chaining (recommended)
export function enc(txt: string) {
  try {
    // text must be a multiple of 16 bytes
    txt = txt + "";
    const diff = txt.length % 16;
    if (diff != 0) {
      txt = txt.padEnd(txt.length + (16 - diff), " ");
    }
    const textBytes = aesjs.utils.utf8.toBytes(txt);

    const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
    const encryptedBytes = aesCbc.encrypt(textBytes);

    // To print or store the binary data, you may convert it to hex
    const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    // console.log(encryptedHex);
    return encryptedHex;
  } catch (e) {
    return e;
  }
}

export function dec(encryptedHex) {
  try {
    // When ready to decrypt the hex string, convert it back to bytes
    const encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);

    // The cipher-block chaining mode of operation maintains internal
    // state, so to decrypt a new instance must be instantiated.
    const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
    const decryptedBytes = aesCbc.decrypt(encryptedBytes);

    // Convert our bytes back into text
    const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes).trim();

    return decryptedText;
  } catch (e) {
    return e;
  }
}
