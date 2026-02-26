<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/composables/useToast'
import { encrypt, decrypt } from '@/composables/useCipher'

const { t } = useI18n()
const toast = useToast()

const plaintext = ref('')
const encryptPassword = ref('')
const encryptResult = ref('')
const encrypting = ref(false)

const ciphertextInput = ref('')
const decryptPassword = ref('')
const decryptResult = ref('')
const decryptError = ref(false)
const decrypting = ref(false)

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

function clearAll() {
  plaintext.value = ''
  encryptPassword.value = ''
  encryptResult.value = ''
  ciphertextInput.value = ''
  decryptPassword.value = ''
  decryptResult.value = ''
  decryptError.value = false
}
</script>

<template>
  <div class="page-content">
    <div class="tool-panel">
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
