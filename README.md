# CryptoCalc — Tauri + React

A desktop crypto profit calculator with PHP conversion and target sell price finder.

## Prerequisites

- Node.js 18+
- Rust (stable)
- Tauri CLI: `cargo install tauri-cli`
- Windows: Microsoft C++ Build Tools (via Visual Studio Installer)

## Setup

```bash
# 1. Install JS dependencies
npm install

# 2. Run in development mode (hot reload)
npm run tauri dev

# 3. Build for production (creates installer in src-tauri/target/release/bundle)
npm run tauri build
```

## Features

- Trade amount, buy/sell price, fee rate input
- Fee rate slider (0.01% – 1.0%)
- Buy fee, sell fee, total fees breakdown
- Gross and net profit display
- PHP conversion (configurable exchange rate)
- Target sell price calculator (from desired USD or PHP profit)

## Project Structure

```
crypto-calc/
├── src/                   # React frontend
│   ├── main.jsx
│   ├── App.jsx
│   ├── App.css
│   └── index.css
├── src-tauri/             # Rust/Tauri backend
│   ├── src/main.rs
│   ├── tauri.conf.json
│   ├── Cargo.toml
│   └── build.rs
├── index.html
├── vite.config.js
└── package.json
```
