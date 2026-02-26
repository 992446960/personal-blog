/**
 * 映射编码：与 encode.tianai.cloud 对齐。
 * 原文 encodeURIComponent 后逐字符取 charCode，转为 base-n（n=映射表长度），每位映射为映射表字符。
 * 每位数量 width 满足 n^width >= 65536，以支持完整 charCode 范围（含 n=2 时「就我」等短映射表）。
 * 映射表：长度 ≥2、无重复字符，中英文等均可。
 */

export const MapEncodeErrorCode = {
  INVALID_ALPHABET: 'INVALID_ALPHABET',
  INVALID_LENGTH: 'INVALID_LENGTH',
  INVALID_CHAR: 'INVALID_CHAR',
} as const

export type MapEncodeErrorCodeType =
  (typeof MapEncodeErrorCode)[keyof typeof MapEncodeErrorCode]

export class MapEncodeError extends Error {
  readonly code: MapEncodeErrorCodeType
  constructor(message: string, code: MapEncodeErrorCodeType) {
    super(message)
    this.name = 'MapEncodeError'
    this.code = code
  }
}

/** charCode 范围 0..65535，需 n^width >= 65536 */
const CHARCODE_MAX = 65536

/** 使 n^width >= CHARCODE_MAX 的最小 width */
function digitsPerChar(n: number): number {
  if (n <= 1) return 16
  const width = Math.ceil(Math.log(CHARCODE_MAX) / Math.log(n))
  return Math.max(4, width)
}

function parseAlphabet(alphabet: string): { chars: string[]; n: number } {
  const chars = Array.from(alphabet)
  const n = chars.length
  if (n < 2) {
    throw new MapEncodeError(
      'Alphabet must have at least 2 characters',
      MapEncodeErrorCode.INVALID_ALPHABET
    )
  }
  const set = new Set(chars)
  if (set.size !== n) {
    throw new MapEncodeError(
      'Alphabet must not contain duplicate characters',
      MapEncodeErrorCode.INVALID_ALPHABET
    )
  }
  return { chars, n }
}

/** 将 num 转为 n 进制，得到 width 位数字（高位在前），每位 0..n-1 */
function toBaseN(num: number, n: number, width: number): number[] {
  const digits: number[] = []
  let x = num
  do {
    digits.push(x % n)
    x = Math.floor(x / n)
  } while (x > 0)
  while (digits.length < width) {
    digits.push(0)
  }
  return digits.reverse().slice(-width)
}

/** 将 4 个 base-n 数字（高位在前）还原为 charCode */
function fromBaseN(digits: number[], n: number): number {
  let val = 0
  for (let i = 0; i < digits.length; i++) {
    val = val * n + (digits[i] as number)
  }
  return val
}

/**
 * 编码：encodeURIComponent → 逐字符 charCode → base-n（width 位）→ 映射表字符拼接。
 */
export function mapEncode(plaintext: string, alphabet: string): string {
  const { chars, n } = parseAlphabet(alphabet)
  const width = digitsPerChar(n)
  const s = encodeURIComponent(plaintext)
  const out: string[] = []
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i)
    const digits = toBaseN(code, n, width)
    for (let j = 0; j < width; j++) {
      out.push(chars[digits[j] as number] as string)
    }
  }
  return out.join('')
}

/**
 * 解码：密文 trim 后每 width 字符一组 → 查下标得 base-n → charCode → String.fromCharCode → decodeURIComponent。
 */
export function mapDecode(encoded: string, alphabet: string): string {
  const trimmed = encoded.trim()
  const { chars, n } = parseAlphabet(alphabet)
  const width = digitsPerChar(n)
  if (trimmed.length % width !== 0) {
    throw new MapEncodeError(
      `Encoded length must be a multiple of ${width} (got ${trimmed.length})`,
      MapEncodeErrorCode.INVALID_LENGTH
    )
  }
  const charToIndex = new Map<string, number>()
  for (let i = 0; i < chars.length; i++) {
    charToIndex.set(chars[i] as string, i)
  }
  const codePoints = Array.from(trimmed)
  const decoded: string[] = []
  for (let i = 0; i < codePoints.length; i += width) {
    const digits: number[] = []
    for (let j = 0; j < width; j++) {
      const ch = codePoints[i + j]
      const idx = charToIndex.get(ch ?? '')
      if (idx === undefined) {
        throw new MapEncodeError(
          `Character not in alphabet: ${JSON.stringify(ch)}`,
          MapEncodeErrorCode.INVALID_CHAR
        )
      }
      digits.push(idx)
    }
    const charCode = fromBaseN(digits, n)
    decoded.push(String.fromCharCode(charCode))
  }
  return decodeURIComponent(decoded.join(''))
}
