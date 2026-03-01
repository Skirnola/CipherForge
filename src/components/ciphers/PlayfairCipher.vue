<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <!-- Info Card -->
    <div class="bg-primary-50 border border-primary-100 rounded-2xl p-5">
      <h3 class="font-display font-600 text-primary-900 text-sm mb-1">
        Cara Kerja
      </h3>
      <p class="text-xs text-primary-700 font-display leading-relaxed">
        Playfair cipher mengenkripsi digraf (pasangan huruf) menggunakan matriks
        kunci 5×5. Aturan: baris sama → geser kanan; kolom sama → geser bawah;
        selainnya → tukar persegi panjang. Huruf I dan J berbagi sel yang sama.
      </p>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <!-- Input -->
      <div
        class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4"
      >
        <h3 class="font-display font-600 text-slate-700 text-sm">Input</h3>

        <div>
          <label class="label-text">Plainteks / Cipherteks</label>
          <textarea
            v-model="inputText"
            class="cipher-textarea"
            rows="5"
            placeholder="Masukkan teks..."
          ></textarea>
        </div>

        <div>
          <label class="label-text">Key</label>
          <input
            v-model="key"
            type="text"
            class="cipher-input"
            placeholder="e.g. MONARCHY"
          />
        </div>

        <div class="flex gap-2">
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
          <h3 class="font-display font-600 text-slate-700 text-sm">Output</h3>
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
            {{ mode === "encrypt" ? "🔒 Terenkripsi" : "🔓 Terdekripsi" }}
          </span>
        </div>
        <div
          v-if="error"
          class="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-600 font-display"
        >
          ⚠ {{ error }}
        </div>
      </div>
    </div>

    <!-- 5x5 Matrix Visualization -->
    <div
      v-if="key"
      class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
    >
      <h3 class="font-display font-600 text-slate-700 text-sm mb-4">
        Matriks Kunci (5×5)
      </h3>
      <div class="flex justify-center">
        <div class="grid grid-cols-5 gap-2">
          <template v-for="(row, ri) in matrix" :key="ri">
            <div
              v-for="(cell, ci) in row"
              :key="`${ri}-${ci}`"
              class="w-10 h-10 bg-primary-50 border-2 border-primary-200 rounded-lg flex items-center justify-center font-mono font-600 text-primary-800 text-sm hover:bg-primary-200 transition-colors cursor-default"
            >
              {{ cell }}
            </div>
          </template>
        </div>
      </div>
      <p class="text-center text-xs text-slate-400 mt-3 font-display">
        Key: <span class="font-mono">{{ key.toUpperCase() }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  playfairEncrypt,
  playfairDecrypt,
  buildPlayfairMatrix,
} from "../../utils/playfair";

const inputText = ref("");
const key = ref("");
const outputText = ref("");
const error = ref("");
const mode = ref("");
const copied = ref(false);

function encrypt() {
  error.value = "";
  try {
    outputText.value = playfairEncrypt(inputText.value, key.value);
    mode.value = "encrypt";
  } catch (e) {
    error.value = e.message;
  }
}

function decrypt() {
  error.value = "";
  try {
    outputText.value = playfairDecrypt(inputText.value, key.value);
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

const matrix = computed(() => {
  if (!key.value) return [];
  try {
    return buildPlayfairMatrix(key.value);
  } catch {
    return [];
  }
});
</script>
