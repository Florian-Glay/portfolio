// Controleur navigateur du simulateur microfluidique: il relie la simulation,
// le rendu canvas et les boutons/gestes de l'interface.
import { FLUIDS } from './config.js';
import { FluidSimulation } from './simulation.js';
import { DeviceRenderer } from './renderer.js';

const stage = document.querySelector('#stage');
const app = document.querySelector('.app');
const canvas = document.querySelector('#simulationCanvas');
const fluidList = document.querySelector('#fluidList');
const gauge = document.querySelector('#cursorGauge');
const gaugeLiquid = document.querySelector('#gaugeLiquid');
const gaugeValue = document.querySelector('#gaugeValue');
const resetButton = document.querySelector('#resetButton');
const speedButtons = [...document.querySelectorAll('.speed-button')];
const modelButtons = [...document.querySelectorAll('.model-card')];

const simulation = new FluidSimulation();
const renderer = new DeviceRenderer(canvas, simulation);
const pointer = { x: -100, y: -100, inside: false };
let previousFrameTime = performance.now();

function createFluidPalette() {
  FLUIDS.forEach((fluid) => {
    const button = document.createElement('button');
    button.className = 'fluid-button';
    button.dataset.color = fluid.color;
    button.style.setProperty('--fluid-color', fluid.color);
    button.innerHTML = `
      <div class="fluid-vial"></div>
      <div class="fluid-name">${fluid.name}</div>
    `;

    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      simulation.selectFluid(fluid.color);
      simulation.beginLoading();
      selectPaletteButton(button);
      button.setPointerCapture(event.pointerId);
    });

    button.addEventListener('pointerup', (event) => {
      simulation.stopLoading();
      if (button.hasPointerCapture(event.pointerId)) button.releasePointerCapture(event.pointerId);
    });

    button.addEventListener('pointercancel', () => simulation.stopLoading());
    fluidList.append(button);
  });
}

function selectPaletteButton(selectedButton) {
  document.querySelectorAll('.fluid-button').forEach((button) => {
    button.classList.toggle('selected', button === selectedButton);
  });
}

function resizeRenderer() {
  const bounds = stage.getBoundingClientRect();
  renderer.resize(bounds.width, bounds.height);
}

function eventPosition(event) {
  const bounds = canvas.getBoundingClientRect();
  return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
}

function updatePointer(event) {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointer.inside = true;
}

function updateInterface() {
  const percent = Math.round(simulation.gauge * 100);
  gauge.style.left = `${pointer.x}px`;
  gauge.style.top = `${pointer.y}px`;
  gauge.style.opacity = pointer.inside ? '1' : '0';
  gaugeLiquid.style.height = `${percent}%`;
  gaugeLiquid.style.background = simulation.selectedFluid?.hex || '#aeb4b2';
  gaugeValue.textContent = `${percent}%`;

  speedButtons.forEach((button, index) => {
    button.classList.toggle('active', index === simulation.speedIndex);
  });
  modelButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.model === simulation.deviceModel);
  });
}

function animate(frameTime) {
  const deltaTime = Math.min(0.035, (frameTime - previousFrameTime) / 1000);
  previousFrameTime = frameTime;
  simulation.update(deltaTime);
  renderer.render();
  updateInterface();
  requestAnimationFrame(animate);
}

app.addEventListener('pointermove', updatePointer);
app.addEventListener('pointerenter', () => { pointer.inside = true; });
app.addEventListener('pointerleave', () => {
  pointer.inside = false;
  simulation.stopDispensing();
});

stage.addEventListener('pointerleave', () => {
  simulation.stopDispensing();
});

canvas.addEventListener('pointermove', (event) => {
  if (simulation.dispensingWell === null) return;
  if (renderer.getWellAt(eventPosition(event)) !== simulation.dispensingWell) {
    simulation.stopDispensing();
  }
});

canvas.addEventListener('pointerdown', (event) => {
  const wellIndex = renderer.getWellAt(eventPosition(event));
  simulation.beginDispensing(wellIndex);
  if (simulation.dispensingWell !== null) canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener('pointerup', (event) => {
  simulation.stopDispensing();
  if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
});

speedButtons.forEach((button, index) => {
  button.addEventListener('click', () => simulation.setSpeed(index));
});

modelButtons.forEach((button) => {
  button.addEventListener('click', () => {
    simulation.setDeviceModel(button.dataset.model);
    selectPaletteButton(null);
    resizeRenderer();
    renderer.render();
    updateInterface();
  });
});

resetButton.addEventListener('click', () => {
  simulation.reset();
  selectPaletteButton(null);
});

createFluidPalette();
resizeRenderer();
renderer.render();
stage.classList.add('canvas-ready');
window.addEventListener('resize', resizeRenderer);
requestAnimationFrame(animate);
