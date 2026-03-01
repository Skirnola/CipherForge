<template>
  <div class="flex h-screen overflow-hidden bg-slate-100">
    <!-- Sidebar -->
    <Sidebar :active-cipher="activeCipher" @select="handleSelect" />

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <!-- Top Bar -->
      <Transition name="topbar" mode="out-in">
        <div
          :key="currentCipher.id"
          class="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200 px-8 py-4 flex items-center justify-between"
        >
          <div>
            <h1 class="text-xl font-display font-700 text-slate-800">
              {{ currentCipher.label }}
            </h1>
            <p class="text-xs text-slate-400 font-display mt-0.5">
              {{ currentCipher.description }}
            </p>
          </div>
          <div
            class="flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-100 px-3 py-1.5 rounded-full"
          >
            <span
              class="w-2 h-2 rounded-full bg-green-400 animate-pulse"
            ></span>
            CipherForge v1.0
          </div>
        </div>
      </Transition>

      <!-- Cipher Panel -->
      <div class="p-8">
        <Transition name="page" mode="out-in">
          <component :is="currentCipher.component" :key="currentCipher.id" />
        </Transition>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Sidebar from "./components/Sidebar.vue";
import VigenereCipher from "./components/ciphers/VigenereCipher.vue";
import AffineCipher from "./components/ciphers/AffineCipher.vue";
import PlayfairCipher from "./components/ciphers/PlayfairCipher.vue";
import HillCipher from "./components/ciphers/HillCipher.vue";
import EnigmaCipher from "./components/ciphers/EnigmaCipher.vue";

const ciphers = [
  {
    id: "vigenere",
    label: "Vigenere Cipher",
    description: "Substitusi polialfabetik menggunakan kata kunci berulang",
    component: VigenereCipher,
  },
  {
    id: "affine",
    label: "Affine Cipher",
    description: "Transformasi linear E(x) = (ax + b) mod 26",
    component: AffineCipher,
  },
  {
    id: "playfair",
    label: "Playfair Cipher",
    description: "Substitusi digraf menggunakan matriks kunci 5×5",
    component: PlayfairCipher,
  },
  {
    id: "hill",
    label: "Hill Cipher",
    description: "Substitusi poligrafik menggunakan perkalian matriks",
    component: HillCipher,
  },
  {
    id: "enigma",
    label: "Enigma Cipher",
    description: "Simulasi mesin substitusi rotor elektromekanik",
    component: EnigmaCipher,
  },
];

const activeCipher = ref("vigenere");
const currentCipher = computed(
  () => ciphers.find((c) => c.id === activeCipher.value) || ciphers[0],
);

function handleSelect(id) {
  activeCipher.value = id;
}
</script>

<style>
/* Page transition — fade + slide up */
.page-enter-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.page-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Topbar transition — fade only */
.topbar-enter-active {
  transition: opacity 0.2s ease;
}
.topbar-leave-active {
  transition: opacity 0.1s ease;
}
.topbar-enter-from,
.topbar-leave-to {
  opacity: 0;
}

/* Initial page load — fade in whole app */
#app {
  animation: appLoad 0.4s ease both;
}
@keyframes appLoad {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
