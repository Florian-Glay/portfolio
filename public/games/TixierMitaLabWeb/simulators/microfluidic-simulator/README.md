# Interactive Microfluidic Simulator

A self-contained browser simulation of color transport and mixing in 3D microfluidic devices.

## Available device models

1. **Straight mixer** — two cylindrical wells connected by one microchannel.
2. **Bridge array** — two parallel inlet/outlet pairs connected by five simple microtubes. Fluids travel along both primary channels and mix across the bridge array.
3. **Dual parallel** — four wells arranged as a square, with two independent horizontal microchannels inspired by the photographed acrylic devices.
4. **Hooked maze** — two wells connected by a raised hook-shaped route before descending to the outlet.

## Project structure

```text
microfluidic-simulator/
├── index.html              # Self-contained preview and application entry point
├── README.md
├── assets/
│   └── styles.css          # Source styles
└── js/
    ├── app.js              # Input handling and animation loop
    ├── config.js           # Fluids, speeds, and device constants
    ├── simulation.js       # Mixing, transport, and device physics
    ├── renderer.js         # Canvas rendering for both 3D devices
    └── app.bundle.js       # Browser-compatible bundled script
```

`index.html` contains an inline copy of the CSS and bundled JavaScript so it also works inside restricted file preview environments.

## Color model

Colors use RGB values premultiplied by fluid amount. Components are constrained by the associated volume, preventing repeated injections from clipping to white. New liquid progressively displaces an equivalent fraction when a reservoir is full.
