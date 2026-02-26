<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/composables/useToast'
import { encrypt, decrypt } from '@/composables/useCipher'
import { mapEncode, mapDecode, MapEncodeError } from '@/utils/mapEncode'

const { t } = useI18n()
const toast = useToast()

type CipherMode = 'password' | 'mapping'
const mode = ref<CipherMode>('password')

const plaintext = ref('')
const encryptPassword = ref('')
const encryptResult = ref('')
const encrypting = ref(false)

const ciphertextInput = ref('')
const decryptPassword = ref('')
const decryptResult = ref('')
const decryptError = ref(false)
const decrypting = ref(false)

const mapPlaintext = ref('')
const mapAlphabetEncode = ref('')
const mapEncodedResult = ref('')
const mapEncodeError = ref(false)
const mapEncodedInput = ref('')
const mapAlphabetDecode = ref('')
const mapDecodedResult = ref('')
const mapDecodeError = ref(false)
const mapEncoding = ref(false)
const mapDecoding = ref(false)

async function doEncrypt() {
  if (!encryptPassword.value.trim()) {
    toast.show(t('cipher.needPassword'))
    return
  }
  encrypting.value = true
  encryptResult.value = ''
  try {
    const out = await encrypt(plaintext.value, encryptPassword.value)
    encryptResult.value = out
    decryptError.value = false
  } catch (e) {
    encryptResult.value = e instanceof Error ? e.message : String(e)
    decryptError.value = false
  } finally {
    encrypting.value = false
  }
}

async function doDecrypt() {
  if (!decryptPassword.value.trim()) {
    toast.show(t('cipher.needPassword'))
    return
  }
  if (!ciphertextInput.value.trim()) {
    toast.show(t('cipher.needCiphertext'))
    return
  }
  decrypting.value = true
  decryptResult.value = ''
  decryptError.value = false
  try {
    const out = await decrypt(ciphertextInput.value, decryptPassword.value)
    decryptResult.value = out
  } catch {
    decryptResult.value = t('cipher.decryptFailed')
    decryptError.value = true
  } finally {
    decrypting.value = false
  }
}

function copyEncryptResult() {
  if (encryptResult.value) {
    navigator.clipboard.writeText(encryptResult.value).then(() =>
      toast.show('✅ ' + t('common.copied'))
    )
  }
}

function copyDecryptResult() {
  if (decryptResult.value && !decryptError.value) {
    navigator.clipboard.writeText(decryptResult.value).then(() =>
      toast.show('✅ ' + t('common.copied'))
    )
  }
}

function doMapEncode() {
  const alphabet = mapAlphabetEncode.value.trim()
  if (!alphabet) {
    toast.show(t('cipher.needAlphabet'))
    return
  }
  mapEncoding.value = true
  mapEncodedResult.value = ''
  mapEncodeError.value = false
  try {
    mapEncodedResult.value = mapEncode(mapPlaintext.value, alphabet)
  } catch (e) {
    mapEncodedResult.value =
      e instanceof MapEncodeError ? t('cipher.invalidAlphabet') : (e instanceof Error ? e.message : String(e))
    mapEncodeError.value = true
  } finally {
    mapEncoding.value = false
  }
}

function doMapDecode() {
  const alphabet = mapAlphabetDecode.value.trim()
  if (!alphabet) {
    toast.show(t('cipher.needAlphabet'))
    return
  }
  if (!mapEncodedInput.value.trim()) {
    toast.show(t('cipher.needCiphertext'))
    return
  }
  mapDecoding.value = true
  mapDecodedResult.value = ''
  mapDecodeError.value = false
  try {
    mapDecodedResult.value = mapDecode(mapEncodedInput.value, alphabet)
  } catch {
    mapDecodedResult.value = t('cipher.mapDecodeFailed')
    mapDecodeError.value = true
  } finally {
    mapDecoding.value = false
  }
}

function copyMapEncodedResult() {
  if (mapEncodedResult.value && !mapEncodeError.value) {
    navigator.clipboard.writeText(mapEncodedResult.value).then(() =>
      toast.show('✅ ' + t('common.copied'))
    )
  }
}

function copyMapDecodedResult() {
  if (mapDecodedResult.value && !mapDecodeError.value) {
    navigator.clipboard.writeText(mapDecodedResult.value).then(() =>
      toast.show('✅ ' + t('common.copied'))
    )
  }
}

function clearAll() {
  plaintext.value = ''
  encryptPassword.value = ''
  encryptResult.value = ''
  ciphertextInput.value = ''
  decryptPassword.value = ''
  decryptResult.value = ''
  decryptError.value = false
  mapPlaintext.value = ''
  mapAlphabetEncode.value = ''
  mapEncodedResult.value = ''
  mapEncodedInput.value = ''
  mapAlphabetDecode.value = ''
  mapDecodedResult.value = ''
  mapDecodeError.value = false
  mapEncodeError.value = false
}
</script>

<template>
  <div class="page-content">
    <div class="tool-panel">
      <div class="mode-tabs">
        <button
          type="button"
          class="mode-tab"
          :class="{ active: mode === 'password' }"
          @click="mode = 'password'"
        >
          {{ t('cipher.modePassword') }}
        </button>
        <button
          type="button"
          class="mode-tab"
          :class="{ active: mode === 'mapping' }"
          @click="mode = 'mapping'"
        >
          {{ t('cipher.modeMapping') }}
        </button>
      </div>
      <template v-if="mode === 'password'">
        <div class="dgrid">
          <div class="darea">
            <div class="dlabel">
              {{ t('cipher.plaintext') }}
            <span class="dlabel-actions">
              <button
                type="button"
                class="cpbtn"
                :disabled="encrypting"
                @click="doEncrypt"
              >
                {{ encrypting ? t('cipher.encrypting') : t('cipher.encrypt') }}
              </button>
            </span>
          </div>
          <textarea
            v-model="plaintext"
            class="dta"
            rows="4"
            :placeholder="t('cipher.plaintextPlaceholder')"
          />
          <div class="dpass">
            <label class="dpass-label">{{ t('cipher.password') }}</label>
            <input
              v-model="encryptPassword"
              type="password"
              class="dpass-input"
              :placeholder="t('cipher.passwordPlaceholder')"
              autocomplete="off"
            />
          </div>
          <div class="dlabel dlabel-out">
            {{ t('cipher.ciphertextOut') }}
            <button
              type="button"
              class="cpbtn"
              :disabled="!encryptResult"
              @click="copyEncryptResult"
            >
              {{ t('common.copy') }}
            </button>
          </div>
          <div class="dres">{{ encryptResult }}</div>
        </div>
        <div class="darea">
          <div class="dlabel">
            {{ t('cipher.ciphertext') }}
            <span class="dlabel-actions">
              <button
                type="button"
                class="cpbtn"
                :disabled="decrypting"
                @click="doDecrypt"
              >
                {{ decrypting ? t('cipher.decrypting') : t('cipher.decrypt') }}
              </button>
            </span>
          </div>
          <textarea
            v-model="ciphertextInput"
            class="dta"
            rows="4"
            :placeholder="t('cipher.ciphertextPlaceholder')"
          />
          <div class="dpass">
            <label class="dpass-label">{{ t('cipher.password') }}</label>
            <input
              v-model="decryptPassword"
              type="password"
              class="dpass-input"
              :placeholder="t('cipher.passwordPlaceholder')"
              autocomplete="off"
            />
          </div>
          <div class="dlabel dlabel-out">
            {{ t('cipher.plaintextOut') }}
            <button
              type="button"
              class="cpbtn"
              :disabled="!decryptResult || decryptError"
              @click="copyDecryptResult"
            >
              {{ t('common.copy') }}
            </button>
          </div>
          <div class="dres" :class="{ err: decryptError }">{{ decryptResult }}</div>
        </div>
      </div>
      </template>
      <template v-else>
        <div class="dgrid">
          <div class="darea">
            <div class="dlabel">
              {{ t('cipher.plaintext') }}
              <span class="dlabel-actions">
                <button
                  type="button"
                  class="cpbtn"
                  :disabled="mapEncoding"
                  @click="doMapEncode"
                >
                  {{ mapEncoding ? t('cipher.encoding') : t('cipher.encode') }}
                </button>
              </span>
            </div>
            <textarea
              v-model="mapPlaintext"
              class="dta"
              rows="4"
              :placeholder="t('cipher.plaintextPlaceholder')"
            />
            <div class="dpass">
              <label class="dpass-label">{{ t('cipher.alphabet') }}</label>
              <input
                v-model="mapAlphabetEncode"
                type="text"
                class="dpass-input"
                :placeholder="t('cipher.alphabetPlaceholder')"
                autocomplete="off"
              />
            </div>
            <div class="dlabel dlabel-out">
              {{ t('cipher.encodedOutput') }}
              <button
                type="button"
                class="cpbtn"
                :disabled="!mapEncodedResult || mapEncodeError"
                @click="copyMapEncodedResult"
              >
                {{ t('common.copy') }}
              </button>
            </div>
            <div class="dres" :class="{ err: mapEncodeError }">{{ mapEncodedResult }}</div>
          </div>
          <div class="darea">
            <div class="dlabel">
              {{ t('cipher.encodedInput') }}
              <span class="dlabel-actions">
                <button
                  type="button"
                  class="cpbtn"
                  :disabled="mapDecoding"
                  @click="doMapDecode"
                >
                  {{ mapDecoding ? t('cipher.decoding') : t('cipher.decode') }}
                </button>
              </span>
            </div>
            <textarea
              v-model="mapEncodedInput"
              class="dta"
              rows="4"
              :placeholder="t('cipher.ciphertextPlaceholder')"
            />
            <div class="dpass">
              <label class="dpass-label">{{ t('cipher.alphabet') }}</label>
              <input
                v-model="mapAlphabetDecode"
                type="text"
                class="dpass-input"
                :placeholder="t('cipher.alphabetPlaceholder')"
                autocomplete="off"
              />
            </div>
            <div class="dlabel dlabel-out">
              {{ t('cipher.decodedOutput') }}
              <button
                type="button"
                class="cpbtn"
                :disabled="!mapDecodedResult || mapDecodeError"
                @click="copyMapDecodedResult"
              >
                {{ t('common.copy') }}
              </button>
            </div>
            <div class="dres" :class="{ err: mapDecodeError }">{{ mapDecodedResult }}</div>
          </div>
        </div>
      </template>
      <div class="dact">
        <button type="button" class="sbtn" @click="clearAll">
          {{ t('common.clear') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 22px;
}

.mode-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 18px;
  border-bottom: 1px solid var(--border);
}

.mode-tab {
  padding: 10px 18px;
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-display);
  color: var(--text2);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}

.mode-tab:hover {
  color: var(--text);
}

.mode-tab.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

.dgrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.darea {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 11px;
  padding: 14px;
}

.dlabel {
  font-size: 10px;
  font-weight: 700;
  color: var(--text3);
  margin-bottom: 9px;
  letter-spacing: 0.1em;
  font-family: var(--font-display);
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dlabel-actions {
  display: flex;
  gap: 5px;
}

.dlabel-out {
  margin-top: 12px;
  margin-bottom: 9px;
}

.dpass {
  margin-top: 10px;
}

.dpass-label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  color: var(--text3);
  margin-bottom: 5px;
  letter-spacing: 0.05em;
  font-family: var(--font-display);
}

.dpass-input {
  width: 100%;
  padding: 8px 10px;
  font-size: 13px;
  font-family: var(--font-mono);
  color: var(--text2);
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 7px;
  outline: none;
}

.dpass-input::placeholder {
  color: var(--text3);
}

.dta {
  width: 100%;
  background: transparent;
  border: none;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text2);
  outline: none;
  resize: vertical;
  min-height: 80px;
  line-height: 1.65;
}

.dres {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--a2);
  line-height: 1.65;
  word-break: break-all;
  white-space: pre-wrap;
  max-height: 200px;
  overflow-y: auto;
  min-height: 2em;
}

.dres.err {
  color: var(--a4);
}

.dact {
  display: flex;
  gap: 7px;
  margin-top: 13px;
  flex-wrap: wrap;
}

.cpbtn {
  font-size: 11px;
  font-weight: 600;
  padding: 5px 11px;
  border-radius: 7px;
  background: var(--surface2);
  color: var(--text2);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.15s;
  font-family: var(--font-display);
  letter-spacing: 0.04em;
}

.cpbtn:hover:not(:disabled) {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.cpbtn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .dgrid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .dta {
    min-height: 120px;
    font-size: 13px;
  }
  .dres {
    font-size: 13px;
  }
  .cpbtn {
    min-height: 44px;
    padding: 12px 14px;
  }
  .dact .sbtn {
    min-height: 44px;
    padding: 12px 14px;
  }
  .dpass-input {
    min-height: 44px;
  }
}
</style>
