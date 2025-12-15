import { useState, useEffect } from "react";
import { Globe, RefreshCw } from "lucide-react";
import { FLAG_API_BASE } from "../config";

function InputBox({
  label,
  amount,
  onAmountChange,
  onCurrencyChange,
  currencyOptions = [],
  selectCurrency = "USD",
  amountDisable = false,
  currencyDisable = false,
  loading = false,
  className = "",
}) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [selectCurrency]);

  const getFlagUrl = (code) => {
    if (!code) return "";
    const countryCode = code.slice(0, 2).toLowerCase();
    return `${FLAG_API_BASE}/${countryCode}.png`;
  };

  return (
    <div
      className={`bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-all duration-300 group ${className}`}
    >
      <div className="flex justify-between items-center mb-2">
        <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider group-focus-within:text-indigo-400 transition-colors">
          {label}
        </label>
        {loading && (
          <RefreshCw className="w-3 h-3 text-indigo-400 animate-spin" />
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Amount Field */}
        <input
          className="w-full bg-transparent text-2xl sm:text-3xl font-bold text-white outline-none placeholder-slate-600 disabled:text-slate-500"
          type="number"
          placeholder="0"
          disabled={amountDisable}
          value={amount}
          onChange={(e) =>
            onAmountChange && onAmountChange(Number(e.target.value))
          }
        />

        {/* Currency Select */}
        <div className="relative flex items-center bg-slate-900 rounded-lg p-1 border border-slate-700 min-w-[90px] sm:min-w-[100px] cursor-pointer">
          <div className="w-6 h-4 ml-2 rounded overflow-hidden flex-shrink-0 relative">
            {!imageError ? (
              <img
                src={getFlagUrl(selectCurrency)}
                alt={selectCurrency}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <Globe className="w-full h-full text-slate-500" />
            )}
          </div>

          {/* Native Select Overlay */}
          <select
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            value={selectCurrency}
            onChange={(e) =>
              onCurrencyChange && onCurrencyChange(e.target.value)
            }
            disabled={currencyDisable}
          >
            {currencyOptions.map((currency) => (
              <option key={currency} value={currency} className="text-black">
                {currency}
              </option>
            ))}
          </select>

          {/* Custom Display */}
          <div className="flex items-center justify-between w-full pl-2 pr-1 pointer-events-none">
            <span className="text-white font-bold uppercase text-sm">
              {selectCurrency}
            </span>
            <div className="text-slate-400 ml-1">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InputBox;
