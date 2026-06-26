import crypto from "crypto";

/**
 * Signs a token payload using native Node.js crypto HMAC-SHA256.
 * @param payload - Key-value parameters to sign.
 * @param secret - Signature passphrase secret.
 */
export function signToken(payload: Record<string, unknown>, secret: string): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${data}`)
    .digest("base64url");
    
  return `${header}.${data}.${signature}`;
}

/**
 * Verifies a token signature and decodes its payload parameters.
 * @param token - Token string to verify.
 * @param secret - Signature passphrase secret.
 */
export function verifyToken(token: string, secret: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  
  const [header, data, signature] = parts;
  
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${data}`)
    .digest("base64url");
    
  if (signature !== expectedSignature) return null;
  
  try {
    return JSON.parse(Buffer.from(data, "base64url").toString());
  } catch {
    return null;
  }
}
