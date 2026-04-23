<<<<<<< HEAD
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

=======
#  A VIBE CODED APP

# 🚀 CryptoCalc: Crypto Profit & Target Calculator
try windows installer: https://github.com/mannigoy/Crypto_Profit_Calculator/blob/main/CryptoCalc.exe
A sleek, no-nonsense calculator built to take the guesswork out of your crypto trades. Whether you're swinging SOL, holding ETH, or day-trading XRP, this tool breaks down exactly what you're making after the exchange takes its cut. 

No more hidden fees eating your margins. Set your entry, check your exit, and see your exact take-home profit.

## ✨ The Vibe
Trading is stressful enough without having to do complex fee math on the fly. TradeCalc is designed to be fast, responsive, and relentlessly accurate. It doesn't just tell you what you *did* make—it tells you what you *need* to make to hit your goals.

## 🧮 Core Features

* **Gross vs. Net Breakdown:** See exactly how much you're making before and after exchange fees.
* **Granular Fee Tracking:** Splits out your buy fee, sell fee, and total fees so you know exactly what you're paying the house.
* **Real-Time PHP Conversion:** Automatically converts your final USD net profit into Philippine Peso (PHP) so you can track your actual local purchasing power.
* **Target Profit Engine (Reverse Math):** Have a specific profit goal in mind? Type in your desired net profit, and the calculator will automatically reverse-engineer the exact Sell Price you need to hit to make it happen (fees included).

## 🛠️ Usage

Simply input your trade parameters:
1.  **Trade Amount:** Your total capital deployed (e.g., $500).
2.  **Fee Rate:** Your exchange's maker/taker fee tier (e.g., 0.10%).
3.  **Buy Price:** Your entry price.
4.  **Sell Price:** Your target exit price.

The summary engine will instantly output your fee structure, gross move, and net profit. 

## 💻 Local Setup

Clone the repo and drop into the directory:

```bash
git clone [https://github.com/yourusername/tradecalc.git](https://github.com/yourusername/tradecalc.git)
cd tradecalc
npm install
npm run dev
>>>>>>> 260861565614d1c66c01d3882428b210e711800a
