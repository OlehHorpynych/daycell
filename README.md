# DAYCELL

Online store for green-energy equipment: solar panels, hybrid inverters, home batteries.

Current stage: **home screen prototype** for style approval.

Live: **https://daycell.vercel.app/** (Vercel, deploys on every push to `main`) · mirror: https://olehhorpynych.github.io/daycell/

- `prototype/` — home screen (plain HTML/CSS/JS): product carousel (LONGi / Deye / Felicity), flow CTA button, pager.
- `design-system/DAYCELL/` — brand design system: tokens, components, logo, icons.
- `serve.ps1` — local static server without Node/Python: `powershell -ExecutionPolicy Bypass -File serve.ps1`, then open http://localhost:5173/prototype/

Image sources and rights notes: `prototype/assets/CREDITS.md`. Product renders belong to their manufacturers; the LONGi panel is a placeholder illustration.
