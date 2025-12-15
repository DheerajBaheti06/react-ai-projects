import { useState, useEffect, useCallback } from "react";
import { ArrowUpDown, RefreshCw, TrendingUp, DollarSign } from "lucide-react";
import { FLAG_API_BASE } from "./config";

// Import components and hooks
import {
  InputBox,
  GeminiInsights,
  CurrencyChart,
  DeveloperInfo,
} from "./components/index";
import { useCurrencyInfo } from "./hooks/useCurrencyInfo";

// Main Component
function App() {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(0);

  const currencyResult = useCurrencyInfo(from);
  const currencyInfo = currencyResult.data;

  // Comprehensive currency list - always available
  const allCurrencies = [
    "USD",
    "EUR",
    "GBP",
    "INR",
    "JPY",
    "AUD",
    "CAD",
    "CHF",
    "CNY",
    "SEK",
    "NZD",
    "BRL",
    "MXN",
    "SGD",
    "HKD",
    "NOK",
    "DKK",
    "PLN",
    "CZK",
    "HUF",
    "RON",
    "BGN",
    "TRY",
    "PHP",
    "IDR",
    "ILS",
    "KRW",
    "MYR",
    "THB",
    "ZAR",
    "ISK",
  ];

  // API data with fallback to comprehensive list
  const apiOptions = Object.keys(currencyInfo);
  const finalApiOptions =
    currencyInfo && apiOptions.length > 0
      ? [...new Set([from, ...apiOptions])].sort()
      : [];
  const options = finalApiOptions.length > 0 ? finalApiOptions : allCurrencies;

  const convert = useCallback(() => {
    if (currencyInfo && currencyInfo[to]) {
      setConvertedAmount(amount * currencyInfo[to]);
    }
  }, [amount, currencyInfo, to]);

  useEffect(() => {
    convert();
  }, [convert]);

  const swap = () => {
    setFrom(to);
    setTo(from);
    setAmount(convertedAmount);
    setConvertedAmount(amount);
  };

  return (
    <div className="min-h-screen w-full bg-[#040609] text-white flex flex-col items-center pt-16 sm:pt-6 lg:pt-10 pb-24 sm:pb-10 px-2 sm:px-4 lg:px-6 xl:px-8 font-sans selection:bg-indigo-500/30">
      {/* Ambient Background */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Developer Info Bar */}
      <DeveloperInfo />

      {/* Header */}
      <header className="z-10 text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 pb-2">
          Global Currency
        </h1>
        <p className="text-slate-400 font-medium mt-2">
          Fast, secure, and accurate conversions.
        </p>
        <div className="inline-flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700 mt-4 shadow-lg backdrop-blur-md">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
            Live Exchange Rates
          </span>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="z-10 w-full max-w-[98vw] sm:max-w-[96vw] lg:max-w-[94vw] xl:max-w-[92vw] 2xl:max-w-[90vw] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
          {/* Left Column: Input & Converter */}
          <div className="lg:col-span-2 xl:col-span-3 order-1">
            <div className="w-full bg-slate-800/40 backdrop-blur-xl border border-slate-700 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent "></div>

              <div>
                <InputBox
                  label="From"
                  amount={amount}
                  currencyOptions={options}
                  onCurrencyChange={(curr) => setFrom(curr)}
                  selectCurrency={from}
                  onAmountChange={(amt) => setAmount(amt)}
                  loading={currencyResult.loading}
                />
                <div className="relative h-12 sm:h-14 lg:h-8 flex items-center justify-center my-4">
                  <div className="absolute w-full border-t border-slate-700/50"></div>
                  <button
                    type="button"
                    className="relative z-10 bg-slate-900 border-4 border-slate-800 rounded-full p-2 sm:p-3 text-indigo-400 hover:text-white hover:bg-indigo-600 hover:rotate-180 transition-all duration-300 shadow-xl group touch-manipulation"
                    onClick={swap}
                  >
                    <ArrowUpDown className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                <InputBox
                  label="To"
                  amount={convertedAmount.toFixed(2)}
                  currencyOptions={options}
                  onCurrencyChange={(curr) => setTo(curr)}
                  selectCurrency={to}
                  amountDisable
                  loading={currencyResult.loading}
                />

                {/* Exchange Rate Status */}
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:justify-between gap-2 text-xs text-slate-400 px-2 font-mono">
                  <span className="text-center sm:text-left">
                    1 {from} = {(currencyInfo[to] || 0).toFixed(4)} {to}
                  </span>
                  <span className="flex items-center justify-center sm:justify-end gap-1">
                    <RefreshCw className="w-3 h-3" /> Updated just now
                  </span>
                </div>
              </div>

              {/* Popular Pairs */}
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-700/50">
                <p className="text-slate-400 text-xs font-bold uppercase mb-3 text-center sm:text-left">
                  Popular Pairs
                </p>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                  {["USD/EUR", "USD/INR", "EUR/GBP", "GBP/USD"].map((pair) => {
                    const [pFrom, pTo] = pair.split("/");
                    return (
                      <button
                        key={pair}
                        onClick={() => {
                          setFrom(pFrom);
                          setTo(pTo);
                        }}
                        className="bg-slate-700/50 hover:bg-slate-600 text-slate-300 text-xs py-2 px-3 rounded-lg border border-slate-600 hover:border-indigo-400 transition-all touch-manipulation text-center"
                      >
                        {pair}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Analytics & Reference */}
          <div className="lg:col-span-1 xl:col-span-2 order-2 space-y-4 sm:space-y-6">
            {/* Chart - Responsive height */}
            <CurrencyChart from={from} to={to} />

            {/* Reference Table */}
            <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700 rounded-2xl p-3 sm:p-4 lg:p-5 shadow-xl">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                <DollarSign className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <h3 className="text-slate-200 font-bold text-sm sm:text-base lg:text-lg truncate">
                  Quick Reference
                </h3>
              </div>

              {/* Show conversion to multiple currencies */}
              <div className="space-y-3">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                  {amount} {from} converts to:
                </div>

                {/* Common pairs */}
                {["USD", "EUR", "GBP", "JPY", "INR", "AUD"]
                  .filter((curr) => curr !== from && currencyInfo[curr])
                  .slice(0, 6)
                  .map((currency) => (
                    <div
                      key={currency}
                      className="flex justify-between items-center py-1.5 sm:py-2 border-b border-slate-700/30 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        {/* Flag Image */}
                        <img
                          src={`${FLAG_API_BASE}/${currency
                            .slice(0, 2)
                            .toLowerCase()}.png`}
                          alt={currency}
                          className="w-5 h-3.5 object-cover rounded shadow-sm"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "block"; // Show fallback if hidden
                          }}
                        />
                        {/* Fallback Globe (Hidden by default, shown on error) */}
                        <div className="hidden">
                          <ArrowUpDown className="w-4 h-4 text-slate-600" />
                        </div>

                        <span className="text-slate-400 text-xs font-mono">
                          {currency}
                        </span>
                        <span className="text-slate-500 text-xs">
                          {currency === "USD"
                            ? "US Dollar"
                            : currency === "EUR"
                            ? "Euro"
                            : currency === "GBP"
                            ? "British Pound"
                            : currency === "JPY"
                            ? "Japanese Yen"
                            : currency === "INR"
                            ? "Indian Rupee"
                            : currency === "AUD"
                            ? "Australian Dollar"
                            : currency}
                        </span>
                      </div>
                      <span className="text-slate-200 font-bold font-mono text-xs sm:text-sm">
                        {(amount * (currencyInfo[currency] || 0)).toFixed(
                          currency === "JPY" ? 0 : 2
                        )}
                      </span>
                    </div>
                  ))}

                {/* Current selection fallback */}
                {!["USD", "EUR", "GBP", "JPY", "INR", "AUD"].includes(to) &&
                  currencyInfo[to] && (
                    <div className="flex justify-between items-center py-1.5 sm:py-2 border-t border-slate-700/30 pt-2 mt-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={`${FLAG_API_BASE}/${to
                            .slice(0, 2)
                            .toLowerCase()}.png`}
                          alt={to}
                          className="w-5 h-3.5 object-cover rounded shadow-sm"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                        <span className="text-indigo-400 text-xs font-mono font-bold">
                          {to}
                        </span>
                        <span className="text-slate-500 text-xs">
                          Current Selection
                        </span>
                      </div>
                      <span className="text-indigo-300 font-bold font-mono text-xs sm:text-sm">
                        {convertedAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <GeminiInsights
        from={from}
        to={to}
        amount={amount}
        convertedAmount={convertedAmount.toFixed(2)}
      />
    </div>
  );
}

export default App;
