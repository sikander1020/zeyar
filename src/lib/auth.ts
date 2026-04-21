import crypto from 'crypto';

const SECRET = process.env.JWT_SECRET || 'zaybaash-fallback-secure-key-001';

function toBase64Url(str: string): string {
  return Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export function signJWT(payload: object, expiresInDays = 30): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + (expiresInDays * 24 * 60 * 60);
  const data = { ...payload, exp };
  
  const b64Header = toBase64Url(JSON.stringify(header));
  const b64Payload = toBase64Url(JSON.stringify(data));
  const token = `${b64Header}.${b64Payload}`;
  
  const signature = crypto.createHmac('sha256', SECRET).update(token).digest('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `${token}.${signature}`;
}

export function verifyJWT(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [b64Header, b64Payload, signature] = parts;
    
    const expectedSig = crypto.createHmac('sha256', SECRET).update(`${b64Header}.${b64Payload}`).digest('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const valid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig));
    
    if (!valid) return null;
    
    const payload = JSON.parse(Buffer.from(b64Payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString());
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    
    return payload;
  } catch {
    return null;
  }
}

export function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ':' + derivedKey.toString('hex'));
    });
  });
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':');
    if (!salt || !key) return resolve(false);
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      
      const keyBuffer = Buffer.from(key, 'hex');
      const derivedKeyBuffer = derivedKey;
      
      if (keyBuffer.length !== derivedKeyBuffer.length) {
        return resolve(false);
      }
      
      resolve(crypto.timingSafeEqual(keyBuffer, derivedKeyBuffer));
    });
  });
}
