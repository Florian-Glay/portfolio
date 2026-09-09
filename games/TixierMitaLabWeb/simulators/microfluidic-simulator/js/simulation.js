// Moteur physique simplifie du simulateur microfluidique. Il garde l'etat des
// puits/canaux, applique le depot de fluide, le transport et la diffusion.
import {
  BRIDGE_ROWS,
  BRIDGE_SEGMENTS,
  CHANNEL_SEGMENTS,
  SPEEDS,
  hexToRgb
} from './config.js';

const emptyMixture = () => ({ r: 0, g: 0, b: 0, a: 0 });
const MAX_FLUID_AMOUNT = 1.25;
const COMPONENTS = ['r', 'g', 'b', 'a'];

/** Fluid colors are stored as RGB premultiplied by fluid amount. */
export class FluidSimulation {
  constructor() {
    this.speedIndex = 2;
    this.deviceModel = 'linear';
    this.selectedFluid = null;
    this.gauge = 0;
    this.loading = false;
    this.dispensingWell = null;
    this.time = 0;
    this.createDeviceState();
  }

  createDeviceState() {
    // La structure interne change selon le modele choisi, mais l'interface
    // publique reste la meme pour le renderer et le controleur.
    const usesTwoWells = this.deviceModel === 'linear' || this.deviceModel === 'hook';
    const names = usesTwoWells
      ? ['INLET', 'OUTLET']
      : ['A · INLET', 'A · OUTLET', 'B · INLET', 'B · OUTLET'];

    this.wells = names.map((name) => ({ name, mixture: emptyMixture(), level: 0 }));
    this.channel = Array.from({ length: CHANNEL_SEGMENTS }, emptyMixture);
    this.bridgeChannels = [
      Array.from({ length: CHANNEL_SEGMENTS }, emptyMixture),
      Array.from({ length: CHANNEL_SEGMENTS }, emptyMixture)
    ];
    this.microbridges = Array.from(
      { length: BRIDGE_ROWS },
      () => Array.from({ length: BRIDGE_SEGMENTS }, emptyMixture)
    );
  }

  setDeviceModel(modelId) {
    if (modelId === this.deviceModel) return;
    this.deviceModel = modelId;
    this.reset();
  }

  reset() {
    this.time = 0;
    this.selectedFluid = null;
    this.gauge = 0;
    this.loading = false;
    this.dispensingWell = null;
    this.createDeviceState();
  }

  setSpeed(index) {
    this.speedIndex = Math.max(0, Math.min(SPEEDS.length - 1, index));
  }

  selectFluid(hexColor) {
    if (this.selectedFluid?.hex === hexColor) return;
    this.selectedFluid = { ...hexToRgb(hexColor), hex: hexColor };
    this.gauge = 0;
  }

  beginLoading() {
    if (this.selectedFluid) this.loading = true;
  }

  stopLoading() { this.loading = false; }

  beginDispensing(wellIndex) {
    if (this.gauge > 0 && this.selectedFluid && wellIndex !== null) {
      this.dispensingWell = wellIndex;
    }
  }

  stopDispensing() { this.dispensingWell = null; }

  update(realDeltaTime) {
    this.updateUserInteraction(realDeltaTime);

    // Large accelerated time steps made the explicit diffusion solver unstable.
    // Run the same simulated duration through small, stable physics substeps.
    const simulatedDeltaTime = realDeltaTime * SPEEDS[this.speedIndex];
    this.time += simulatedDeltaTime;
    let remainingTime = simulatedDeltaTime;
    const maximumSubstep = 1 / 120;

    while (remainingTime > 0) {
      const dt = Math.min(maximumSubstep, remainingTime);
      if (this.deviceModel === 'bridge') this.updateBridgeDevice(dt);
      else if (this.deviceModel === 'parallel') this.updateParallelDevice(dt);
      else this.updateLinearDevice(dt);
      remainingTime -= dt;
    }
  }

  updateUserInteraction(dt) {
    // Transforme les actions utilisateur en quantite de fluide chargee/deposee.
    if (this.loading && this.selectedFluid) {
      this.gauge = Math.min(1, this.gauge + dt * 0.42);
    }
    if (this.dispensingWell === null || this.gauge <= 0) return;

    const quantity = Math.min(this.gauge, dt * 0.55);
    const well = this.wells[this.dispensingWell];
    this.addFluid(well.mixture, this.selectedFluid, quantity * 0.9);
    well.level = Math.min(1, well.level + quantity * 0.85);
    this.gauge -= quantity;

    if (this.gauge <= 0.002) {
      this.gauge = 0;
      this.stopDispensing();
    }
  }

  addFluid(mixture, color, requestedAmount) {
    // Les composantes RGB sont stockees ponderees par la quantite de fluide.
    const availableCapacity = Math.max(0, MAX_FLUID_AMOUNT - mixture.a);
    const addedAmount = Math.min(requestedAmount, availableCapacity);
    mixture.r += color.r * addedAmount;
    mixture.g += color.g * addedAmount;
    mixture.b += color.b * addedAmount;
    mixture.a += addedAmount;

    const displacedAmount = requestedAmount - addedAmount;
    if (displacedAmount > 0 && mixture.a > 0) {
      const replacement = Math.min(1, displacedAmount / mixture.a);
      mixture.r = mixture.r * (1 - replacement) + color.r * mixture.a * replacement;
      mixture.g = mixture.g * (1 - replacement) + color.g * mixture.a * replacement;
      mixture.b = mixture.b * (1 - replacement) + color.b * mixture.a * replacement;
    }
    this.sanitizeMixture(mixture);
  }

  updateLinearDevice(dt) {
    this.coupleWellToCell(this.wells[0], this.channel[0], dt);
    this.coupleWellToCell(this.wells[1], this.channel[this.channel.length - 1], dt);
    const flow = (this.wells[0].level - this.wells[1].level) * 1.8;
    this.transportLine(this.channel, dt, flow);
    this.equalizePair(0, 1, dt);
  }

  updateParallelDevice(dt) {
    const upperChannel = this.bridgeChannels[0];
    const lowerChannel = this.bridgeChannels[1];

    this.coupleWellToCell(this.wells[0], upperChannel[0], dt);
    this.coupleWellToCell(this.wells[1], upperChannel[upperChannel.length - 1], dt);
    this.coupleWellToCell(this.wells[2], lowerChannel[0], dt);
    this.coupleWellToCell(this.wells[3], lowerChannel[lowerChannel.length - 1], dt);

    this.transportLine(upperChannel, dt, (this.wells[0].level - this.wells[1].level) * 1.8);
    this.transportLine(lowerChannel, dt, (this.wells[2].level - this.wells[3].level) * 1.8);
    this.equalizePair(0, 1, dt);
    this.equalizePair(2, 3, dt);
  }

  updateBridgeDevice(dt) {
    const left = this.bridgeChannels[0];
    const right = this.bridgeChannels[1];

    this.coupleWellToCell(this.wells[0], left[0], dt);
    this.coupleWellToCell(this.wells[1], left[left.length - 1], dt);
    this.coupleWellToCell(this.wells[2], right[0], dt);
    this.coupleWellToCell(this.wells[3], right[right.length - 1], dt);

    this.transportLine(left, dt, (this.wells[0].level - this.wells[1].level) * 1.8);
    this.transportLine(right, dt, (this.wells[2].level - this.wells[3].level) * 1.8);

    const leftPressure = (this.wells[0].level + this.wells[1].level) / 2;
    const rightPressure = (this.wells[2].level + this.wells[3].level) / 2;
    const crossFlow = (leftPressure - rightPressure) * 1.5;

    this.microbridges.forEach((bridge, row) => {
      const fraction = (row + 1) / (this.microbridges.length + 1);
      const lineIndex = Math.round(fraction * (left.length - 1));
      this.exchangeCells(left[lineIndex], bridge[0], dt * 1.8);
      this.exchangeCells(right[lineIndex], bridge[bridge.length - 1], dt * 1.8);
      this.transportLine(bridge, dt, crossFlow);
    });

    this.equalizePair(0, 1, dt);
    this.equalizePair(2, 3, dt);

    const crossLevel = (leftPressure - rightPressure) * dt * 0.012;
    this.wells[0].level = Math.max(0, this.wells[0].level - crossLevel);
    this.wells[1].level = Math.max(0, this.wells[1].level - crossLevel);
    this.wells[2].level = Math.max(0, this.wells[2].level + crossLevel);
    this.wells[3].level = Math.max(0, this.wells[3].level + crossLevel);
  }

  coupleWellToCell(well, cell, dt) {
    if (well.mixture.a < 0.001) return;
    const transfer = Math.min(1, 0.8 * dt * (0.45 + well.level));
    COMPONENTS.forEach((component) => {
      cell[component] += (well.mixture[component] - cell[component]) * transfer;
    });
    this.sanitizeMixture(cell);
  }

  exchangeCells(first, second, rate) {
    const amount = Math.min(0.28, rate);
    const firstCopy = { ...first };
    COMPONENTS.forEach((component) => {
      first[component] += (second[component] - first[component]) * amount;
      second[component] += (firstCopy[component] - second[component]) * amount;
    });
    this.sanitizeMixture(first);
    this.sanitizeMixture(second);
  }

  transportLine(line, dt, pressureFlow) {
    const previous = line.map((cell) => ({ ...cell }));
    for (let i = 1; i < line.length - 1; i += 1) {
      const sourcePosition = i - pressureFlow * dt * 82;
      const sourceIndex = Math.max(0, Math.min(line.length - 1, Math.round(sourcePosition)));
      COMPONENTS.forEach((component) => {
        const diffusion = (
          previous[i - 1][component] - 2 * previous[i][component] + previous[i + 1][component]
        ) * dt * 4.2;
        line[i][component] = previous[sourceIndex][component] + diffusion;
      });
      this.sanitizeMixture(line[i]);
    }

    const transported = line.map((cell) => ({ ...cell }));
    for (let i = 1; i < line.length - 1; i += 1) {
      const donor = transported[i - 1].a > transported[i + 1].a
        ? transported[i - 1]
        : transported[i + 1];
      if (donor.a <= transported[i].a + 0.015) continue;
      const propagation = Math.min(0.34, dt * 18);
      COMPONENTS.forEach((component) => {
        line[i][component] += (donor[component] - transported[i][component]) * propagation;
      });
      this.sanitizeMixture(line[i]);
    }
  }

  equalizePair(firstIndex, secondIndex, dt) {
    const difference = (this.wells[firstIndex].level - this.wells[secondIndex].level) * dt * 0.035;
    this.wells[firstIndex].level = Math.max(0, this.wells[firstIndex].level - difference);
    this.wells[secondIndex].level = Math.max(0, this.wells[secondIndex].level + difference);
  }

  sanitizeMixture(mixture) {
    mixture.a = Math.max(0, Math.min(MAX_FLUID_AMOUNT, mixture.a));
    ['r', 'g', 'b'].forEach((component) => {
      mixture[component] = Math.max(0, Math.min(mixture.a, mixture[component]));
    });
  }
}
