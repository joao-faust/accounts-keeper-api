import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

function getSecretKey() {
  return Buffer.from(process.env.ENCRYPTION_KEY, "hex");
}

export function encrypt(value) {
  const secretKey = getSecretKey();
  const iv = randomBytes(16);

  const cipher = createCipheriv(
    process.env.ENCRYPTION_ALGORITHM,
    secretKey,
    iv
  );
  let encrypted = cipher.update(value, "utf-8", "hex");
  encrypted += cipher.final("hex");

  return { encrypted, iv: iv.toString("hex") };
}

export function decrypt(encryptedData, ivHex) {
  const secretKey = getSecretKey();

  const decipher = createDecipheriv(
    process.env.ENCRYPTION_ALGORITHM,
    secretKey,
    Buffer.from(ivHex, "hex")
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf-8");
  decrypted += decipher.final("utf-8");

  return decrypted;
}
