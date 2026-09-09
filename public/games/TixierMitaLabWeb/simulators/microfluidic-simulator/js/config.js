// Parametres centraux du simulateur microfluidique: vitesses, geometrie,
// modeles de dispositifs et couleurs disponibles dans la palette.
export const SPEEDS = [0.25, 0.5, 1, 2, 4];
export const CHANNEL_SEGMENTS = 100;
export const BRIDGE_ROWS = 5;
export const BRIDGE_SEGMENTS = 42;

export const DEVICE_MODELS = [
  { id: 'linear', name: 'Straight mixer', description: 'Two wells and one microchannel' },
  { id: 'bridge', name: 'Bridge array', description: 'Two channels connected by five simple tubes' },
  { id: 'parallel', name: 'Dual parallel', description: 'Four wells connected as two independent pairs' },
  { id: 'hook', name: 'Hooked maze', description: 'A raised hook-shaped microchannel' }
];

export const FLUIDS = [
  { name: 'Red',    color: '#e33b32' },
  { name: 'Orange', color: '#f27a24' },
  { name: 'Yellow', color: '#e4bd28' },
  { name: 'Green',  color: '#22a75f' },
  { name: 'Cyan',   color: '#19aeb0' },
  { name: 'Blue',   color: '#2867be' },
  { name: 'Purple', color: '#714db5' },
  { name: 'Pink',   color: '#d33d8d' },
  { name: 'Black',  color: '#3d4244' }
];

export function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16) / 255,
    g: parseInt(hex.slice(3, 5), 16) / 255,
    b: parseInt(hex.slice(5, 7), 16) / 255
  };
}
