/**
 * Enigma Machine Simulation
 * Simplified 3-rotor Enigma (based on historical Wehrmacht Enigma)
 * Rotors: I, II, III
 * Reflector: UKW-B
 */

// Historical Enigma rotor wirings (forward mapping)
const ROTORS = {
  I: { wiring: "EKMFLGDQVZNTOWYHXUSPAIBRCJ", notch: "Q" },
  II: { wiring: "AJDKSIRUXBLHWTMCQGZNPYFVOE", notch: "E" },
  III: { wiring: "BDFHJLCPRTXVZNYEIWGAKMUSQO", notch: "V" },
  IV: { wiring: "ESOVPZJAYQUIRHXLNFTGKDCMWB", notch: "J" },
  V: { wiring: "VZBRGITYUPSDNHLXAWMJQOFECK", notch: "Z" },
};

// UKW-B Reflector
const REFLECTOR_B = "YRUHQSLDPXNGOKMIEBFZCWVJAT";

function encodeThroughRotor(letter, wiring, offset, reverse = false) {
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const idx = (A.indexOf(letter) + offset + 26) % 26;
  if (!reverse) {
    const mapped = wiring[idx];
    return A[(A.indexOf(mapped) - offset + 26) % 26];
  } else {
    const target = A[(A.indexOf(letter) + offset + 26) % 26];
    const pos = wiring.indexOf(target);
    return A[(pos - offset + 26) % 26];
  }
}

function stepRotors(r1pos, r2pos, r3pos, rotors) {
  const r1notch = rotors[0].notch;
  const r2notch = rotors[1].notch;
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const willR2Step = A[r1pos] === r1notch;
  const willR3Step = A[r2pos] === r2notch;

  // Double stepping anomaly
  if (willR3Step || willR2Step) r2pos = (r2pos + 1) % 26;
  if (willR3Step) r3pos = (r3pos + 1) % 26;
  r1pos = (r1pos + 1) % 26;

  return [r1pos, r2pos, r3pos];
}

export function enigmaProcess(
  text,
  rotor1 = "I",
  rotor2 = "II",
  rotor3 = "III",
  rings = [0, 0, 0],
  starts = [0, 0, 0],
) {
  const clean = text.toUpperCase().replace(/[^A-Z]/g, "");
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const rotorDefs = [ROTORS[rotor1], ROTORS[rotor2], ROTORS[rotor3]];
  let [r1pos, r2pos, r3pos] = starts.map((s) =>
    typeof s === "number" ? s : A.indexOf(s),
  );

  let result = "";

  for (const ch of clean) {
    // Step rotors before encoding
    [r1pos, r2pos, r3pos] = stepRotors(r1pos, r2pos, r3pos, rotorDefs);

    let signal = ch;

    // Forward through rotors (right to left: rotor1 first)
    signal = encodeThroughRotor(
      signal,
      rotorDefs[0].wiring,
      r1pos - rings[0],
      false,
    );
    signal = encodeThroughRotor(
      signal,
      rotorDefs[1].wiring,
      r2pos - rings[1],
      false,
    );
    signal = encodeThroughRotor(
      signal,
      rotorDefs[2].wiring,
      r3pos - rings[2],
      false,
    );

    // Through reflector
    signal = REFLECTOR_B[A.indexOf(signal)];

    // Backward through rotors (left to right)
    signal = encodeThroughRotor(
      signal,
      rotorDefs[2].wiring,
      r3pos - rings[2],
      true,
    );
    signal = encodeThroughRotor(
      signal,
      rotorDefs[1].wiring,
      r2pos - rings[1],
      true,
    );
    signal = encodeThroughRotor(
      signal,
      rotorDefs[0].wiring,
      r1pos - rings[0],
      true,
    );

    result += signal;
  }

  return result;
}

export const AVAILABLE_ROTORS = ["I", "II", "III", "IV", "V"];
