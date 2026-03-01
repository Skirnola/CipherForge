<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <!-- Info Card -->
    <div class="bg-primary-50 border border-primary-100 rounded-2xl p-5">
      <h3 class="font-display font-600 text-primary-900 text-sm mb-1">
        Cara Kerja
      </h3>
      <p class="text-xs text-primary-700 font-display leading-relaxed">
        Mesin Enigma adalah mesin sandi berbasis rotor yang digunakan pada
        Perang Dunia II. Simulasi ini mengimplementasikan 3 rotor dari Enigma
        Wehrmacht dengan reflektor UKW-B. Karena Enigma bersifat simetris,
        pengaturan yang sama untuk enkripsi juga dapat digunakan untuk dekripsi.
      </p>
    </div>

    <!-- Pengaturan Mesin -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <h3
        class="font-display font-600 text-slate-700 text-sm mb-4 flex items-center gap-2"
      >
        <span class="text-base">⚙️</span> Pengaturan Mesin
      </h3>
      <div class="grid grid-cols-3 gap-4">
        <div v-for="(n, i) in 3" :key="i" class="space-y-3">
          <!-- Rotor selector -->
          <div>
            <label class="label-text">Rotor {{ i + 1 }}</label>
            <div class="relative" :ref="(el) => (rotorDropdownRefs[i] = el)">
              <button
                @click="toggleRotorDropdown(i)"
                type="button"
                class="w-full flex items-center justify-between gap-2 rounded-xl border border-primary-200 bg-white px-4 py-3 text-sm font-mono text-primary-700 font-600 shadow-sm transition-all duration-200 hover:border-primary-400 focus:outline-none cursor-pointer"
                :class="
                  rotorDropdowns[i]
                    ? 'border-primary-400 ring-2 ring-primary-200'
                    : ''
                "
              >
                <span>Rotor {{ rotors[i] }}</span>
                <svg
                  :class="[
                    'transition-transform duration-200',
                    rotorDropdowns[i] ? 'rotate-180' : '',
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
                  v-if="rotorDropdowns[i]"
                  class="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden"
                >
                  <div class="p-2 grid grid-cols-5 gap-1">
                    <button
                      v-for="r in availableRotors"
                      :key="r"
                      @click="selectRotor(i, r)"
                      type="button"
                      :class="[
                        'flex items-center justify-center rounded-lg py-2 text-xs font-mono font-600 transition-all duration-100 cursor-pointer',
                        rotors[i] === r
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-primary-50 hover:text-primary-700',
                      ]"
                    >
                      {{ r }}
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>

          <!-- Posisi Awal selector -->
          <div>
            <label class="label-text">Posisi Awal</label>
            <div class="relative" :ref="(el) => (posDropdownRefs[i] = el)">
              <button
                @click="togglePosDropdown(i)"
                type="button"
                class="w-full flex items-center justify-between gap-2 rounded-xl border border-primary-200 bg-white px-4 py-3 text-sm font-mono text-primary-700 font-600 shadow-sm transition-all duration-200 hover:border-primary-400 focus:outline-none cursor-pointer"
                :class="
                  posDropdowns[i]
                    ? 'border-primary-400 ring-2 ring-primary-200'
                    : ''
                "
              >
                <span
                  >{{ alphabet[startPositions[i]] }}
                  <span class="text-slate-400 text-xs font-400"
                    >({{ startPositions[i] }})</span
                  ></span
                >
                <svg
                  :class="[
                    'transition-transform duration-200',
                    posDropdowns[i] ? 'rotate-180' : '',
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
                  v-if="posDropdowns[i]"
                  class="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden"
                >
                  <div
                    class="p-2 grid grid-cols-6 gap-1 max-h-44 overflow-y-auto"
                  >
                    <button
                      v-for="(l, idx) in alphabet"
                      :key="l"
                      @click="selectPos(i, idx)"
                      type="button"
                      :class="[
                        'flex items-center justify-center rounded-lg py-1.5 text-xs font-mono font-600 transition-all duration-100 cursor-pointer',
                        startPositions[i] === idx
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-primary-50 hover:text-primary-700',
                      ]"
                    >
                      {{ l }}
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>

          <!-- Pengaturan Ring stepper -->
          <div>
            <label class="label-text">Pengaturan Ring</label>
            <div
              class="rounded-xl border border-primary-200 bg-white shadow-sm overflow-hidden flex"
              style="height: 46px"
            >
              <button
                @click="decrementRing(i)"
                type="button"
                :disabled="ringSettings[i] <= 0"
                class="w-11 flex items-center justify-center text-slate-400 hover:bg-primary-50 hover:text-primary-600 active:bg-primary-100 transition-all duration-100 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed border-r border-primary-100 text-xl select-none"
              >
                −
              </button>
              <div
                class="flex-1 flex items-center justify-center relative overflow-hidden"
              >
                <div
                  class="absolute bottom-0 left-0 h-0.5 bg-primary-400 transition-all duration-200"
                  :style="{ width: (ringSettings[i] / 25) * 100 + '%' }"
                ></div>
                <Transition
                  :name="ringDirection[i] === 'up' ? 'step-up' : 'step-down'"
                  mode="out-in"
                >
                  <span
                    :key="ringSettings[i]"
                    class="font-mono font-600 text-base text-primary-700 leading-none"
                  >
                    {{ String(ringSettings[i]).padStart(2, "0") }}
                  </span>
                </Transition>
              </div>
              <button
                @click="incrementRing(i)"
                type="button"
                :disabled="ringSettings[i] >= 25"
                class="w-11 flex items-center justify-center text-slate-400 hover:bg-primary-50 hover:text-primary-600 active:bg-primary-100 transition-all duration-100 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed border-l border-primary-100 text-xl select-none"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Jendela Rotor Visualizer -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div class="flex items-center gap-2 mb-4">
        <h3 class="font-display font-600 text-slate-700 text-sm">
          Jendela Rotor
        </h3>
        <span class="text-xs text-slate-400 font-display"
          >(posisi awal saat ini)</span
        >
      </div>
      <div class="flex justify-center gap-4">
        <div
          v-for="(pos, i) in startPositions"
          :key="i"
          class="flex flex-col items-center gap-1"
        >
          <span class="text-[10px] font-display text-slate-400"
            >Rotor {{ i + 1 }}</span
          >
          <div
            class="w-12 h-14 bg-slate-900 rounded-lg border-2 border-slate-700 flex items-center justify-center shadow-inner"
          >
            <Transition name="rotor-tick" mode="out-in">
              <span
                :key="alphabet[pos]"
                class="font-mono font-600 text-2xl text-amber-300"
                >{{ alphabet[pos] }}</span
              >
            </Transition>
          </div>
          <span class="text-[10px] font-mono text-slate-400">{{
            rotors[i]
          }}</span>
        </div>
      </div>
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
            placeholder="Masukkan teks (hanya A-Z)..."
          ></textarea>
        </div>
        <div class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
          <p class="text-[10px] text-amber-700 font-display">
            💡 Enigma bersifat simetris — pengaturan yang sama untuk enkripsi
            dan dekripsi. Karakter non-alfabet akan dihapus.
          </p>
        </div>
        <button @click="process" class="btn-primary w-full cursor-pointer">
          ⚡ Proses (Enkripsi / Dekripsi)
        </button>
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
        <div
          v-if="outputText"
          class="bg-slate-900 rounded-xl p-3 text-[11px] font-mono text-slate-300 space-y-1"
        >
          <p class="text-slate-500">— Pengaturan Digunakan —</p>
          <p>
            Rotors: <span class="text-amber-300">{{ rotors.join(" · ") }}</span>
          </p>
          <p>
            Start:
            <span class="text-amber-300">{{
              startPositions.map((p) => alphabet[p]).join(" · ")
            }}</span>
          </p>
          <p>
            Rings:
            <span class="text-amber-300">{{ ringSettings.join(" · ") }}</span>
          </p>
          <p>Reflektor: <span class="text-amber-300">UKW-B</span></p>
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
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { enigmaProcess, AVAILABLE_ROTORS } from "../../utils/enigma";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const availableRotors = AVAILABLE_ROTORS;

const inputText = ref("");
const rotors = ref(["I", "II", "III"]);
const startPositions = ref([0, 0, 0]);
const ringSettings = ref([0, 0, 0]);
const ringDirection = ref(["up", "up", "up"]);
const outputText = ref("");
const error = ref("");
const copied = ref(false);

// Dropdown state
const rotorDropdowns = ref([false, false, false]);
const posDropdowns = ref([false, false, false]);
const rotorDropdownRefs = ref([null, null, null]);
const posDropdownRefs = ref([null, null, null]);

function toggleRotorDropdown(i) {
  rotorDropdowns.value = rotorDropdowns.value.map((v, idx) =>
    idx === i ? !v : false,
  );
  posDropdowns.value = [false, false, false];
}
function togglePosDropdown(i) {
  posDropdowns.value = posDropdowns.value.map((v, idx) =>
    idx === i ? !v : false,
  );
  rotorDropdowns.value = [false, false, false];
}
function selectRotor(i, r) {
  rotors.value[i] = r;
  rotorDropdowns.value[i] = false;
}
function selectPos(i, idx) {
  startPositions.value[i] = idx;
  posDropdowns.value[i] = false;
}
function incrementRing(i) {
  if (ringSettings.value[i] < 25) {
    ringDirection.value[i] = "up";
    ringSettings.value[i]++;
  }
}
function decrementRing(i) {
  if (ringSettings.value[i] > 0) {
    ringDirection.value[i] = "down";
    ringSettings.value[i]--;
  }
}

function process() {
  error.value = "";
  try {
    outputText.value = enigmaProcess(
      inputText.value,
      rotors.value[0],
      rotors.value[1],
      rotors.value[2],
      ringSettings.value,
      startPositions.value,
    );
  } catch (e) {
    error.value = e.message;
  }
}

function copyOutput() {
  navigator.clipboard.writeText(outputText.value);
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
}

function handleClickOutside(e) {
  rotorDropdownRefs.value.forEach((el, i) => {
    if (el && !el.contains(e.target)) rotorDropdowns.value[i] = false;
  });
  posDropdownRefs.value.forEach((el, i) => {
    if (el && !el.contains(e.target)) posDropdowns.value[i] = false;
  });
}
onMounted(() => document.addEventListener("mousedown", handleClickOutside));
onUnmounted(() =>
  document.removeEventListener("mousedown", handleClickOutside),
);
</script>

<style scoped>
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

.rotor-tick-enter-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.rotor-tick-leave-active {
  transition:
    opacity 0.1s ease,
    transform 0.1s ease;
}
.rotor-tick-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.rotor-tick-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
