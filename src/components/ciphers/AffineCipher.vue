<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <!-- Info Card -->
    <div class="bg-primary-50 border border-primary-100 rounded-2xl p-5">
      <h3 class="font-display font-600 text-primary-900 text-sm mb-1">
        Cara Kerja
      </h3>
      <p class="text-xs text-primary-700 font-display leading-relaxed">
        Affine cipher menggunakan dua kunci <em>a</em> dan <em>b</em>. Enkripsi:
        <code class="bg-primary-100 px-1.5 py-0.5 rounded font-mono text-xs"
          >E(x) = (a·x + b) mod 26</code
        >
        — Decrypt:
        <code class="bg-primary-100 px-1.5 py-0.5 rounded font-mono text-xs"
          >D(x) = a⁻¹·(x - b) mod 26</code
        >. Kunci <em>a</em> harus koprima dengan 26.
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
            placeholder="Masukkan teks di sini..."
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <!-- Custom Key A Dropdown -->
          <div>
            <label class="label-text"
              >Key a <span class="text-slate-300">(coprime w/ 26)</span></label
            >
            <div class="relative" ref="dropdownRef">
              <button
                @click="dropdownOpen = !dropdownOpen"
                type="button"
                class="w-full flex items-center justify-between gap-2 rounded-xl border border-primary-200 bg-white px-4 py-3 text-sm font-mono shadow-sm transition-all duration-200 hover:border-primary-400 focus:outline-none cursor-pointer"
                :class="
                  dropdownOpen
                    ? 'border-primary-400 ring-2 ring-primary-200'
                    : ''
                "
              >
                <span class="font-600 text-primary-700">{{ keyA }}</span>
                <svg
                  :class="[
                    'transition-transform duration-200',
                    dropdownOpen ? 'rotate-180' : '',
                  ]"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <Transition name="dropdown">
                <div
                  v-if="dropdownOpen"
                  class="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden"
                >
                  <div class="p-2 grid grid-cols-4 gap-1">
                    <button
                      v-for="v in validA"
                      :key="v"
                      @click="selectKeyA(v)"
                      type="button"
                      :class="[
                        'flex items-center justify-center rounded-lg py-2 text-sm font-mono font-600 transition-all duration-100 cursor-pointer',
                        keyA === v
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-primary-50 hover:text-primary-700',
                      ]"
                    >
                      {{ v }}
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>

          <!-- Key B Stepper -->
          <div>
            <label class="label-text"
              >Key b <span class="text-slate-300">(0–25)</span></label
            >
            <div
              class="rounded-xl border border-primary-200 bg-white shadow-sm overflow-hidden flex"
              style="height: 46px"
            >
              <button
                @click="decrementB"
                type="button"
                :disabled="keyB <= 0"
                class="w-11 flex items-center justify-center text-slate-400 hover:bg-primary-50 hover:text-primary-600 active:bg-primary-100 transition-all duration-100 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed border-r border-primary-100 text-xl select-none"
              >
                −
              </button>

              <div
                class="flex-1 flex items-center justify-center relative overflow-hidden"
              >
                <div
                  class="absolute bottom-0 left-0 h-0.5 bg-primary-400 transition-all duration-200"
                  :style="{ width: (keyB / 25) * 100 + '%' }"
                ></div>
                <Transition
                  :name="stepDirection === 'up' ? 'step-up' : 'step-down'"
                  mode="out-in"
                >
                  <span
                    :key="keyB"
                    class="font-mono font-600 text-base text-primary-700 leading-none"
                  >
                    {{ String(keyB).padStart(2, "0") }}
                  </span>
                </Transition>
              </div>

              <button
                @click="incrementB"
                type="button"
                :disabled="keyB >= 25"
                class="w-11 flex items-center justify-center text-slate-400 hover:bg-primary-50 hover:text-primary-600 active:bg-primary-100 transition-all duration-100 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed border-l border-primary-100 text-xl select-none"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div
          class="bg-slate-50 rounded-xl px-4 py-2 font-mono text-xs text-slate-500"
        >
          E(x) = ({{ keyA }}x + {{ keyB }}) mod 26
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
            class="text-xs text-primary-500 hover:text-primary-700 font-display cursor-pointer"
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
          <span class="text-slate-400">a={{ keyA }}, b={{ keyB }}</span>
        </div>

        <div class="bg-slate-50 rounded-xl p-3 space-y-1">
          <p class="text-xs font-display text-slate-500">Info Kunci</p>
          <p class="text-xs font-mono text-slate-700">
            a = {{ keyA }}, b = {{ keyB }}
          </p>
          <p class="text-xs font-mono text-slate-700">
            a⁻¹ mod 26 = {{ aInverse }}
          </p>
        </div>

        <div
          v-if="error"
          class="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-600 font-display"
        >
          ⚠ {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import {
  affineEncrypt,
  affineDecrypt,
  getValidAValues,
} from "../../utils/affine";

const inputText = ref("");
const keyA = ref(5);
const keyB = ref(8);
const outputText = ref("");
const error = ref("");
const mode = ref("");
const copied = ref(false);
const dropdownOpen = ref(false);
const dropdownRef = ref(null);
const stepDirection = ref("up");
const validA = getValidAValues();

function selectKeyA(v) {
  keyA.value = v;
  dropdownOpen.value = false;
}

function incrementB() {
  if (keyB.value < 25) {
    stepDirection.value = "up";
    keyB.value++;
  }
}

function decrementB() {
  if (keyB.value > 0) {
    stepDirection.value = "down";
    keyB.value--;
  }
}

function encrypt() {
  error.value = "";
  try {
    outputText.value = affineEncrypt(inputText.value, keyA.value, keyB.value);
    mode.value = "encrypt";
  } catch (e) {
    error.value = e.message;
  }
}

function decrypt() {
  error.value = "";
  try {
    outputText.value = affineDecrypt(inputText.value, keyA.value, keyB.value);
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

const aInverse = computed(() => {
  for (let x = 1; x < 26; x++) if ((keyA.value * x) % 26 === 1) return x;
  return "N/A";
});

function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownOpen.value = false;
  }
}
onMounted(() => document.addEventListener("mousedown", handleClickOutside));
onUnmounted(() =>
  document.removeEventListener("mousedown", handleClickOutside),
);
</script>

<style scoped>
.step-up-enter-active,
.step-down-enter-active {
  transition:
    opacity 0.12s ease,
    transform 0.12s ease;
}
.step-up-leave-active,
.step-down-leave-active {
  transition:
    opacity 0.08s ease,
    transform 0.08s ease;
}
.step-up-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.step-up-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.step-down-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
.step-down-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.dropdown-enter-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.dropdown-leave-active {
  transition:
    opacity 0.1s ease,
    transform 0.1s ease;
}
.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
