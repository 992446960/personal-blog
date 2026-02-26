/**
 * 口令加密/解密：PBKDF2 + AES-256-GCM，仅用 Web Crypto API。
 * 密文格式：base64(salt) + "." + base64(nonce) + "." + base64(ciphertext)
 */

const PBKDF2_ITERATIONS = 100_000
const SALT_LENGTH = 16
const NONCE_LENGTH = 12
const AES_KEY_LENGTH = 256

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i] as number)
  }
  return btoa(binary)
}

function base64ToBytes(base64: string): Uint8Array {
  const bin = atob(base64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) {
    out[i] = bin.charCodeAt(i)
  }
  return out
}

/**
 * 从口令派生 AES-GCM 密钥
 */
async function deriveKey(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: AES_KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  )
}

/**
 * 使用口令加密明文，返回自建格式的 Base64 密文字符串。
 */
export async function encrypt(plaintext: string, password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH))
  const nonce = crypto.getRandomValues(new Uint8Array(NONCE_LENGTH))
  const key = await deriveKey(password, salt)
  const enc = new TextEncoder()
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: nonce, tagLength: 128 },
    key,
    enc.encode(plaintext)
  )
  return [
    bytesToBase64(salt),
    bytesToBase64(nonce),
    bytesToBase64(new Uint8Array(ciphertext)),
  ].join('.')
}

/**
 * 使用口令解密密文，返回明文。
 * 口令错误或密文被篡改时抛出（调用方应捕获后展示「解密失败」等通用文案）。
 */
export async function decrypt(ciphertext: string, password: string): Promise<string> {
  const parts = ciphertext.trim().split('.')
  if (parts.length !== 3) {
    throw new Error('INVALID_FORMAT')
  }
  const saltB64 = parts[0] ?? ''
  const nonceB64 = parts[1] ?? ''
  const ctB64 = parts[2] ?? ''
  const salt = base64ToBytes(saltB64)
  const nonce = base64ToBytes(nonceB64)
  const ct = base64ToBytes(ctB64)
  const key = await deriveKey(password, salt)
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: nonce as BufferSource, tagLength: 128 },
    key,
    ct as BufferSource
  )
  return new TextDecoder().decode(decrypted)
}
