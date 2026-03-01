<template>
  <aside
    :class="[
      'relative flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm transition-all duration-300 ease-in-out',
      isOpen ? 'w-64' : 'w-16',
    ]"
  >
    <!-- Toggle Button -->
    <button
      @click="isOpen = !isOpen"
      class="absolute -right-3 top-7 z-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-primary-50 hover:border-primary-300 transition-all duration-150"
    >
      <svg
        :class="[
          'transition-transform duration-300',
          isOpen ? 'rotate-0' : 'rotate-180',
        ]"
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#64748b"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>

    <!-- Logo -->
    <div
      :class="[
        'border-b border-slate-100 transition-all duration-300',
        isOpen ? 'px-6 py-6' : 'px-3 py-5',
      ]"
    >
      <div
        class="flex items-center"
        :class="isOpen ? 'gap-3' : 'justify-center'"
      >
        <div
          class="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center shadow-md flex-shrink-0 cursor-pointer hover:bg-primary-700 transition-colors"
          @click="isOpen = !isOpen"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <div v-if="isOpen" class="overflow-hidden">
          <h2
            class="font-display font-700 text-slate-900 text-base leading-tight whitespace-nowrap"
          >
            CipherForge
          </h2>
          <p class="text-xs text-slate-400 font-display whitespace-nowrap">
            Kalkulator Cipher
          </p>
        </div>
      </div>
    </div>

    <!-- Nav -->
    <nav
      class="flex-1 py-4 overflow-y-auto overflow-x-hidden"
      :class="isOpen ? 'px-3' : 'px-2'"
    >
      <!-- Label only shown when open -->
      <p
        v-if="isOpen"
        class="text-[10px] font-display font-600 uppercase tracking-widest text-slate-400 px-3 mb-3"
      >
        Algoritma
      </p>
      <div v-else class="mb-3 h-4"></div>

      <div class="space-y-1">
        <button
          v-for="item in ciphers"
          :key="item.id"
          @click="handleSelect(item.id)"
          :title="!isOpen ? item.label : ''"
          :class="[
            'w-full flex items-center rounded-xl text-left transition-all duration-150 group cursor-pointer',
            isOpen ? 'gap-3 px-3 py-2.5' : 'justify-center px-0 py-2.5',
            activeCipher === item.id
              ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
              : 'text-slate-600 hover:bg-primary-50 hover:text-primary-700',
          ]"
        >
          <!-- Icon -->
          <div
            :class="[
              'rounded-lg flex items-center justify-center flex-shrink-0 transition-all',
              isOpen ? 'w-8 h-8' : 'w-9 h-9',
              activeCipher === item.id
                ? 'bg-white/20'
                : 'bg-slate-100 group-hover:bg-primary-100',
            ]"
          >
            <span
              v-html="item.icon"
              :class="
                activeCipher === item.id ? 'text-white' : 'text-primary-600'
              "
            ></span>
          </div>

          <!-- Label (only when open) -->
          <div v-if="isOpen" class="min-w-0 flex-1">
            <p
              :class="[
                'text-sm font-display font-500 leading-tight',
                activeCipher === item.id ? 'text-white' : '',
              ]"
            >
              {{ item.label }}
            </p>
            <p
              :class="[
                'text-[10px] font-display truncate mt-0.5',
                activeCipher === item.id ? 'text-blue-200' : 'text-slate-400',
              ]"
            >
              {{ item.tag }}
            </p>
          </div>

          <!-- Active dot (only when open) -->
          <div
            v-if="isOpen && activeCipher === item.id"
            class="ml-auto w-1.5 h-1.5 rounded-full bg-white flex-shrink-0"
          ></div>
        </button>
      </div>
    </nav>

    <!-- Footer -->
    <div
      class="border-t border-slate-100"
      :class="isOpen ? 'px-5 py-4' : 'px-2 py-4'"
    >
      <p
        v-if="isOpen"
        class="text-[10px] text-slate-400 font-display text-center whitespace-nowrap"
      >
        Iqbal Ghifari (21120123140175) - Kriptografi C
      </p>
      <div v-else class="flex justify-center">
        <div class="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({ activeCipher: String });
const emit = defineEmits(["select"]);

const isOpen = ref(true);

function handleSelect(id) {
  emit("select", id);
  // On mobile feel: if collapsed, open when selecting
}

const ciphers = [
  {
    id: "vigenere",
    label: "Vigenere Cipher",
    tag: "Polialfabetik",
    icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
  },
  {
    id: "affine",
    label: "Affine Cipher",
    tag: "Substitusi Linear",
    icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="20" x2="20" y2="4"/><path d="M4 4h6v6"/><path d="M14 14h6v6"/></svg>`,
  },
  {
    id: "playfair",
    label: "Playfair Cipher",
    tag: "Digraf Matriks 5×5",
    icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
  },
  {
    id: "hill",
    label: "Hill Cipher",
    tag: "Perkalian Matriks",
    icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h4v4H4z M10 4h4v4h-4z M16 4h4v4h-4z M4 10h4v4H4z M10 10h4v4h-4z M16 10h4v4h-4z M4 16h4v4H4z M10 16h4v4h-4z M16 16h4v4h-4z"/></svg>`,
  },
  {
    id: "enigma",
    label: "Enigma Cipher",
    tag: "Mesin Rotor",
    icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>`,
  },
];
</script>

<style scoped>
/* Pointer cursor for all interactive elements in sidebar */
button {
  cursor: pointer;
}
</style>
