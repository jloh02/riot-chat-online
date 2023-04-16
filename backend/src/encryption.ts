import { generateKeyPairSync, privateDecrypt } from "crypto";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const PRIVATE_PATH = resolve("private.pem");
const PUBLIC_PATH = resolve("../frontend/public.pem");

export function encryptMessage(msg: string): string {
  return privateDecrypt(
    readFileSync(PUBLIC_PATH, "utf-8"),
    Buffer.from(msg)
  ).toString("base64");
}

export function decryptMessage(msg: string): string {
  return privateDecrypt(
    {
      key: readFileSync(PRIVATE_PATH, "utf-8"),
      passphrase: process.env.PASSPHRASE ?? "",
    },
    Buffer.from(msg, "base64")
  ).toString("utf-8");
}

export function generateKey() {
  const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
      cipher: "aes-256-cbc",
      passphrase: process.env.PASSPHRASE ?? "",
    },
  });
  writeFileSync(PUBLIC_PATH, publicKey);
  writeFileSync(PRIVATE_PATH, privateKey);
}
