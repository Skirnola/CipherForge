<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <!-- Info Card -->
    <div class="bg-primary-50 border border-primary-100 rounded-2xl p-5">
      <h3 class="font-display font-600 text-primary-900 text-sm mb-1">
        Cara Kerja
      </h3>
      <p class="text-xs text-primary-700 font-display leading-relaxed">
        Hill cipher menggunakan perkalian matriks untuk mengenkripsi pasangan
        huruf. Kunci berupa matriks 2×2 yang invertibel mod 26. Enkripsi:
        <code class="bg-primary-100 px-1.5 py-0.5 rounded font-mono text-xs"
          >C = K·P mod 26</code
        >
        — Decrypt:
        <code class="bg-primary-100 px-1.5 py-0.5 rounded font-mono text-xs"
          >P = K⁻¹·C mod 26</code
        >
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
            rows="4"
            placeholder="Masukkan teks..."
          ></textarea>
        </div>

        <div>
          <label class="label-text">Matriks Kunci (2×2)</label>
          <p class="text-[10px] text-slate-400 font-display mb-1.5">
            Masukkan 4 angka dipisah spasi atau koma
          </p>
          <input
            v-model="matrixInput"
            type="text"
            class="cipher-input"
            placeholder="e.g. 3 3 2 5"
          />
        </div>

        <!-- Matrix display -->
        <div v-if="parsedMatrix" class="flex items-center gap-3">
          <div class="text-slate-400 font-mono text-lg">K =</div>
          <div class="flex flex-col gap-1">
            <div class="flex gap-2">
              <span
                v-for="v in parsedMatrix[0]"
                class="w-8 h-8 bg-primary-50 border border-primary-200 rounded-lg flex items-center justify-center font-mono text-sm text-primary-800 font-600"
                >{{ v }}</span
              >
            </div>
            <div class="flex gap-2">
              <span
                v-for="v in parsedMatrix[1]"
                class="w-8 h-8 bg-primary-50 border border-primary-200 rounded-lg flex items-center justify-center font-mono text-sm text-primary-800 font-600"
                >{{ v }}</span
              >
            </div>
          </div>
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

        <!-- Inverse matrix info -->
        <div
          v-if="inverseMatrix"
          class="flex items-center gap-3 bg-slate-50 rounded-xl p-3"
        >
          <div class="text-slate-400 font-mono text-sm">K⁻¹ =</div>
          <div class="flex flex-col gap-1">
            <div class="flex gap-1.5">
              <span
                v-for="v in inverseMatrix[0]"
                class="w-7 h-7 bg-white border border-slate-200 rounded-md flex items-center justify-center font-mono text-xs text-slate-700"
                >{{ v }}</span
              >
            </div>
            <div class="flex gap-1.5">
              <span
                v-for="v in inverseMatrix[1]"
                class="w-7 h-7 bg-white border border-slate-200 rounded-md flex items-center justify-center font-mono text-xs text-slate-700"
                >{{ v }}</span
              >
            </div>
          </div>
          <span class="text-[10px] text-slate-400 font-display"
            >(invers mod 26)</span
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

    <!-- Preset Examples -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <h3 class="font-display font-600 text-slate-700 text-sm mb-3">
        Preset Cepat
      </h3>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="preset in presets"
          :key="preset.label"
          @click="matrixInput = preset.value"
          class="px-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition-colors text-slate-700"
        >
          {{ preset.label }}: {{ preset.value }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  hillEncrypt,
  hillDecrypt,
  parseMatrix,
  invertMatrix2x2,
} from "../../utils/hill";

const inputText = ref("");
const matrixInput = ref("3 3 2 5");
const outputText = ref("");
const error = ref("");
const mode = ref("");
const copied = ref(false);

const presets = [
  { label: "Classic", value: "3 3 2 5" },
  { label: "Alt 1", value: "6 24 1 13" },
  { label: "Alt 2", value: "17 17 5 21" },
];

function encrypt() {
  error.value = "";
  try {
    outputText.value = hillEncrypt(inputText.value, matrixInput.value);
    mode.value = "encrypt";
  } catch (e) {
    error.value = e.message;
  }
}

function decrypt() {
  error.value = "";
  try {
    outputText.value = hillDecrypt(inputText.value, matrixInput.value);
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

const parsedMatrix = computed(() => {
  try {
    return parseMatrix(matrixInput.value);
  } catch {
    return null;
  }
});

const inverseMatrix = computed(() => {
  try {
    const m = parseMatrix(matrixInput.value);
    return invertMatrix2x2(m);
  } catch {
    return null;
  }
});
</script>
