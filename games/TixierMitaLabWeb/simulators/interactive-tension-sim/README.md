# Interactive Tension Simulator

A self-contained dielectrophoresis simulation embedded in the Research page through an isolated iframe.

## Project structure

```text
interactive-tension-sim/
├── index.html              # Self-contained iframe entry point
├── README.md
├── assets/
│   └── styles.css          # Extracted source styles and local visual overrides
└── js/
    └── app.bundle.js       # Browser-compatible bundled React application
```

`index.html` contains inline copies of the CSS and JavaScript so it works with the `srcdoc` iframe used by `InteractiveTensionSim.astro`.
