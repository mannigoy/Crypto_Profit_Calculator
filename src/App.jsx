import { useState, useCallback, useEffect } from "react";
import "./App.css";

const API_KEY = "f861d1c3bbe2356180766c42";
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

const fmt = (n, decimals = 4) =>
  isNaN(n) ? "—" : "$" + Math.abs(n).toFixed(decimals);
const fmtPhp = (n) =>
  isNaN(n) ? "—" : "₱" + Math.abs(n).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = (n) => (isNaN(n) ? "—" : (n >= 0 ? "+" : "") + n.toFixed(2) + "%");

export default function App() {
  const [amount, setAmount] = useState("500");
  const [feeRate, setFeeRate] = useState("0.10");
  const [buyPrice, setBuyPrice] = useState("86.73");
  const [sellPrice, setSellPrice] = useState("89");
  const [phpRate, setPhpRate] = useState("57.50");
  const [phpRateLoading, setPhpRateLoading] = useState(true);
  const [phpRateError, setPhpRateError] = useState(null);
  const [results, setResults] = useState(null);

  const [desiredProfit, setDesiredProfit] = useState("20");
  const [desiredPhp, setDesiredPhp] = useState("");
  const [targetResult, setTargetResult] = useState(null);

  const fetchPhpRate = useCallback(async () => {
    setPhpRateLoading(true);
    setPhpRateError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.result !== "success") throw new Error(data["error-type"] || "API error");
      const rate = data.conversion_rates?.PHP;
      if (!rate) throw new Error("PHP rate not found");
      setPhpRate(parseFloat(rate).toFixed(2));
    } catch (err) {
      console.error("PHP Rate fetch error:", err);
      setPhpRateError(err.message || "Failed to fetch rate");
    } finally {
      setPhpRateLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhpRate();
  }, [fetchPhpRate]);

  const calculate = useCallback(() => {
    const a = parseFloat(amount);
    const fee = parseFloat(feeRate) / 100;
    const buy = parseFloat(buyPrice);
    const sell = parseFloat(sellPrice);
    const php = parseFloat(phpRate) || 57.5;
    if (!a || !buy || !sell) return;

    const qty = a / buy;
    const buyFee = a * fee;
    const sellProceeds = qty * sell;
    const sellFee = sellProceeds * fee;
    const totalFees = buyFee + sellFee;
    const grossProfit = sellProceeds - a;
    const netProfit = grossProfit - totalFees;
    const pctMove = ((sell - buy) / buy) * 100;

    setResults({
      buyFee, sellFee, totalFees,
      grossProfit, netProfit,
      netPhp: netProfit * php,
      pctMove,
      profitable: netProfit >= 0,
    });
  }, [amount, feeRate, buyPrice, sellPrice, phpRate]);

  const calcTarget = useCallback(() => {
    const a = parseFloat(amount);
    const fee = parseFloat(feeRate) / 100;
    const buy = parseFloat(buyPrice);
    const php = parseFloat(phpRate) || 57.5;

    let desired = parseFloat(desiredProfit) || 0;
    const phpVal = parseFloat(desiredPhp);
    if (!isNaN(phpVal) && phpVal > 0) desired = phpVal / php;

    if (!a || !buy) return;

    const qty = a / buy;
    const buyFee = a * fee;
    const targetSell = (a + buyFee + desired) / (qty * (1 - fee));
    const pctNeeded = ((targetSell - buy) / buy) * 100;

    setTargetResult({ targetSell, pctNeeded, desired, desiredPhp: desired * php });
  }, [amount, feeRate, buyPrice, phpRate, desiredProfit, desiredPhp]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="10" stroke="#3d7fff" strokeWidth="1.5" />
            <path d="M8 7.5h4.5c1.1 0 2 .9 2 2s-.9 2-2 2H8m0-4v7m0-3.5h5c1.1 0 2 .9 2 2s-.9 2-2 2H8" stroke="#3d7fff" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>CryptoCalc</span>
        </div>
        <span className="version-badge">v0.1</span>
      </header>

      <main className="main">
        <div className="col">
          <section className="card">
            <div className="card-label">Trade details</div>
            <div className="input-grid">
              <Field label="Trade amount" hint="In USDT / quote currency" prefix="$">
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
              </Field>
              <Field label="Fee rate" hint="e.g. 0.10 for Binance" suffix="%">
                <input type="number" value={feeRate} step="0.01" min="0.01" max="1" onChange={e => setFeeRate(e.target.value)} />
              </Field>
              <Field label="Buy price" hint="Entry / open price" prefix="$">
                <input type="number" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} />
              </Field>
              <Field label="Sell price" hint="Target / exit price" prefix="$">
                <input type="number" value={sellPrice} onChange={e => setSellPrice(e.target.value)} />
              </Field>
            </div>

            <div className="php-rate-row">
              <div className="php-rate-left">
                <span className="php-rate-label">USD → PHP live rate</span>
                <span className="php-rate-source">exchangerate-api.com</span>
              </div>
              <div className="php-rate-right">
                <span className={`php-rate-value ${phpRateLoading ? "loading" : phpRateError ? "error" : ""}`}>
                  {phpRateLoading ? "Fetching..." : phpRateError ? `₱— (${phpRateError})` : `₱${phpRate}`}
                </span>
                <button className="btn-refresh" onClick={fetchPhpRate} disabled={phpRateLoading} title="Refresh live rate">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M12 7A5 5 0 1 1 7 2a5 5 0 0 1 3.54 1.46L12 2v4H8l1.3-1.3A3 3 0 1 0 10 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <button className="btn-primary" onClick={calculate}>
              Calculate fees &amp; profit
            </button>
          </section>

          <section className="card">
            <div className="card-label">Target sell price</div>
            <p className="card-desc">Enter your desired profit to find the required sell price.</p>
            <div className="input-grid">
              <Field label="Desired profit (USD)" hint="Net after all fees" prefix="$">
                <input type="number" value={desiredProfit} onChange={e => { setDesiredProfit(e.target.value); setDesiredPhp(""); }} />
              </Field>
              <Field label="Or in PHP" hint="Auto-converts to USD" prefix="₱">
                <input type="number" value={desiredPhp} placeholder="optional" onChange={e => { setDesiredPhp(e.target.value); setDesiredProfit(""); }} />
              </Field>
            </div>
            <button className="btn-secondary" onClick={calcTarget}>
              Find target sell price
            </button>

            {targetResult && (
              <div className="target-result">
                <div className="target-price-label">You need to sell at</div>
                <div className="target-price">${targetResult.targetSell.toFixed(4)}</div>
                <div className="target-sub">
                  {pct(targetResult.pctNeeded)} from buy price · Net ≈ {fmt(targetResult.desired, 4)} / {fmtPhp(targetResult.desiredPhp)}
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="col">
          {results ? (
            <section className="card results-card">
              <div className="results-header">
                <div className="card-label">Result summary</div>
                <span className={`move-badge ${results.pctMove >= 0 ? "up" : "down"}`}>
                  {pct(results.pctMove)} move
                </span>
              </div>

              <div className="fee-grid">
                <MetricTile label="Buy fee" value={fmt(results.buyFee)} />
                <MetricTile label="Sell fee" value={fmt(results.sellFee)} />
                <MetricTile label="Total fees" value={fmt(results.totalFees)} danger />
              </div>

              <div className="divider" />

              <div className="gross-row">
                <span className="gross-label">Gross profit</span>
                <span className={`gross-val ${results.grossProfit >= 0 ? "pos" : "neg"}`}>
                  {results.grossProfit >= 0 ? "+" : "-"}{fmt(results.grossProfit)}
                </span>
              </div>

              <div className="net-block">
                <div className="net-left">
                  <div className="net-label">Net profit after fees</div>
                  <div className="gross-sub">Gross: {fmt(results.grossProfit)} − Fees: {fmt(results.totalFees)}</div>
                  <span className={`profit-pill ${results.profitable ? "pos" : "neg"}`}>
                    {results.profitable ? "▲ Profitable trade" : "▼ Loss trade"}
                  </span>
                </div>
                <div className="net-right">
                  <div className={`net-amount ${results.profitable ? "pos" : "neg"}`}>
                    {results.netProfit >= 0 ? "" : "-"}{fmt(results.netProfit)}
                  </div>
                </div>
              </div>

              <div className="php-result-row">
                <div>
                  <div className="php-result-label">Net profit in Philippine Peso</div>
                  <div className="php-result-rate">@ ₱{parseFloat(phpRate).toFixed(2)} per $1</div>
                </div>
                <div className={`php-result-amount ${results.profitable ? "pos" : "neg"}`}>
                  {results.netPhp >= 0 ? "" : "-"}{fmtPhp(results.netPhp)}
                </div>
              </div>

              <div className="divider" />

              <div className="breakdown-grid">
                <BreakItem label="Quantity" value={(parseFloat(amount) / parseFloat(buyPrice)).toFixed(6) + " units"} />
                <BreakItem label="Buy cost" value={fmt(parseFloat(amount))} />
                <BreakItem label="Sell proceeds" value={fmt((parseFloat(amount) / parseFloat(buyPrice)) * parseFloat(sellPrice))} />
                <BreakItem label="Fee rate" value={feeRate + "%"} />
              </div>
            </section>
          ) : (
            <section className="card empty-state">
              <div className="empty-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="18" stroke="var(--border-hover)" strokeWidth="1.5" strokeDasharray="4 3" />
                  <path d="M14 17h7c2 0 3.5 1.5 3.5 3.5S23 24 21 24h-7m0-7v10m0-5h8c2 0 3.5 1.5 3.5 3.5" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="empty-title">No results yet</div>
              <div className="empty-sub">Fill in your trade details and hit calculate</div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function Field({ label, hint, prefix, suffix, children, inline }) {
  if (inline) {
    return (
      <div className="input-wrap-inline">
        {prefix && <span className="affix">{prefix}</span>}
        {children}
        {suffix && <span className="affix">{suffix}</span>}
      </div>
    );
  }
  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      <div className="input-wrap">
        {prefix && <span className="affix">{prefix}</span>}
        {children}
        {suffix && <span className="affix suffix">{suffix}</span>}
      </div>
      {hint && <div className="field-hint">{hint}</div>}
    </div>
  );
}

function MetricTile({ label, value, danger }) {
  return (
    <div className="metric-tile">
      <div className="metric-label">{label}</div>
      <div className={`metric-val ${danger ? "danger" : ""}`}>{value}</div>
    </div>
  );
}

function BreakItem({ label, value }) {
  return (
    <div className="break-item">
      <span className="break-label">{label}</span>
      <span className="break-val">{value}</span>
    </div>
  );
}
