GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

Copyright (C) 2025 YOUR_NAME

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
...


# analyser-web

A modern, browser-based 3D graphing tool that visualizes functions of the form `z = f(x, y)` using React, TypeScript, math.js, and Three.js.

This project is a complete refactoring of a legacy DOS-based function analysis tool into a modular, web-native application.

---

## 🚀 Features

- Live input of mathematical expressions
- Real-time surface rendering with Three.js
- Dynamic sampling grid resolution
- Interactive view controls (zoom, rotate, shift, z-scale)
- Modular core for formula evaluation and transformation
- Fully written in TypeScript
- Tested with Vitest

---

## 📦 Tech Stack

- **Frontend**: React + TypeScript
- **Rendering**: Three.js
- **Math Engine**: math.js
- **Build Tool**: Vite
- **Testing**: Vitest
- **Linting/Formatting**: ESLint + Prettier

---

## 📂 Project Structure

```
src/
├── core/         # Math evaluation, sampling, transforms
├── renderer/     # 3D scene and surface rendering
├── ui/           # React components and layout
├── styles/       # Tailwind or global styles
└── main.tsx      # Entry point
```

---

## 🛠️ Setup

./setup.sh

---

## 🧪 Testing

- Tests are located in `/tests` and inside `/src/**/__tests__/`
- Use Vitest for fast unit and integration testing
- Run `npm run test:watch` for watch mode

./run.sh


## 📘 Documentation

- See `coding_conventions.md` for coding guidelines
- See `analyser_implementation_plan.txt` for project architecture and module responsibilities

---

## 📄 License

MIT © analyser-web team