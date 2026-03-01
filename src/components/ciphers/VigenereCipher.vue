<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <!-- Info Card -->
    <div class="bg-primary-50 border border-primary-100 rounded-2xl p-5">
      <h3 class="font-display font-600 text-primary-900 text-sm mb-1">
        Cara Kerja
      </h3>
      <p class="text-xs text-primary-700 font-display leading-relaxed">
        Vigenère cipher menggunakan kata kunci untuk menggeser setiap huruf pada
        teks asli. Setiap huruf kunci menentukan pergeseran huruf plainteks yang
        bersesuaian:
        <code class="bg-primary-100 px-1.5 py-0.5 rounded font-mono text-xs"
          >E(x) = (x + key) mod 26</code
        >
      </p>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <!-- Input -->
      <div
        class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4"
      >
        <h3
          class="font-display font-600 text-slate-700 text-sm flex items-center gap-2"
        >
          <span
            class="w-5 h-5 bg-primary-100 rounded-md flex items-center justify-center text-primary-600 text-xs"
            >✎</span
          >
          Input
        </h3>

        <div>
          <label class="label-text">Plainteks / Cipherteks</label>
          <textarea
            v-model="inputText"
            class="cipher-textarea"
            rows="5"
            placeholder="Masukkan teks di sini..."
          ></textarea>
        </div>

        <div>
          <label class="label-text">Key</label>
          <input
            v-model="key"
            type="text"
            class="cipher-input"
            placeholder="e.g. SECRET"
          />
        </div>

        <div class="flex gap-2 pt-1">
          <button @click="encrypt" class="btn-primary flex-1">
            🔒 Encrypt
          </button>
          <button @click="decrypt" class="btn-secondary flex-1">
            🔓 Decrypt
          </button>
        </div>
      </div>

      <!-- Output -->
      <div
        class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4"
      >
        <div class="flex items-center justify-between">
          <h3
            class="font-display font-600 text-slate-700 text-sm flex items-center gap-2"
          >
            <span
              class="w-5 h-5 bg-green-100 rounded-md flex items-center justify-center text-green-600 text-xs"
              >✓</span
            >
            Output
          </h3>
          <button
            v-if="outputText"
            @click="copyOutput"
            class="text-xs text-primary-500 hover:text-primary-700 font-display"
          >
            {{ copied ? "✓ Copied!" : "Copy" }}
          </button>
        </div>

        <div>
          <label class="label-text">Result</label>
          <div class="result-box">
            {{ outputText || "Hasil akan muncul di sini..." }}
          </div>
        </div>

        <div v-if="mode" class="flex items-center gap-2 text-xs">
          <span
            :class="
              mode === 'encrypt'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-orange-100 text-orange-700'
            "
            class="px-2 py-1 rounded-full font-display font-500"
          >
            {{ mode === "encrypt" ? "🔒 Encrypted" : "🔓 Decrypted" }}
          </span>
          <span class="text-slate-400"
            >Key:
            <span class="font-mono text-slate-600">{{
              key.toUpperCase()
            }}</span></span
          >
        </div>

        <div
          v-if="error"
          class="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-600 font-display"
        >
          ⚠ {{ error }}
        </div>
      </div>
    </div>

    <!-- Key Visualization -->
    <div
      v-if="key && inputText"
      class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
    >
      <h3 class="font-display font-600 text-slate-700 text-sm mb-3">
        Pratinjau Aliran Kunci
      </h3>
      <div class="flex flex-wrap gap-1.5">
        <div
          v-for="(pair, i) in keyStream"
          :key="i"
          class="flex flex-col items-center bg-slate-50 rounded-lg px-2 py-1.5 text-center"
        >
          <span class="font-mono text-xs text-slate-500">{{ pair.plain }}</span>
          <span class="font-mono text-[10px] text-primary-500 leading-none">{{
            pair.key
          }}</span>
          <span class="font-mono text-xs text-primary-700 font-500 mt-0.5">{{
            pair.cipher
          }}</span>
        </div>
      </div>
      <p class="text-[10px] text-slate-400 mt-2 font-display">
        Atas: plainteks · Tengah: huruf kunci · Bawah: cipherteks
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { vigenereEncrypt, vigenereDecrypt } from "../../utils/vigenere";

const inputText = ref("");
const key = ref("");
const outputText = ref("");
const error = ref("");
const mode = ref("");
const copied = ref(false);

function encrypt() {
  error.value = "";
  try {
    outputText.value = vigenereEncrypt(inputText.value, key.value);
    mode.value = "encrypt";
  } catch (e) {
    error.value = e.message;
  }
}

function decrypt() {
  error.value = "";
  try {
    outputText.value = vigenereDecrypt(inputText.value, key.value);
    mode.value = "decrypt";
  } catch (e) {
    error.value = e.message;
  }
}

function copyOutput() {
  navigator.clipboard.writeText(outputText.value);
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
}

const keyStream = computed(() => {
  const text = inputText.value
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 20);
  const k = key.value.toUpperCase().replace(/[^A-Z]/g, "");
  if (!text || !k) return [];
  return text.split("").map((ch, i) => ({
    plain: ch,
    key: k[i % k.length],
    cipher: String.fromCharCode(
      ((ch.charCodeAt(0) - 65 + k.charCodeAt(i % k.length) - 65) % 26) + 65,
    ),
  }));
});
</script>
