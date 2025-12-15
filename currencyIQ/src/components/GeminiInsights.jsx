import { useState, useEffect } from "react";
import { AI_ENDPOINT } from "../config";
import {
  BotMessageSquare,
  Sparkles,
  X,
  Globe,
  Wallet,
  AlertTriangle,
  Shield,
  CloudSun,
  Utensils,
  MapPin,
  RefreshCw,
} from "lucide-react";

const GeminiInsights = ({ from, to, amount, convertedAmount }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Reset state when currency changes
  useEffect(() => {
    setData(null);
    setError(null);
    setShowResults(false);
  }, [to, from]);

  // Fetch logic with retry capability
  const fetchInsights = () => {
    setLoading(true);
    setError(null);
    setData(null);

    // Prepare payload
    const payload = { amount, from, to, convertedAmount };

    fetch(AI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(res.statusText + " (" + res.status + ")");
        return res.json();
      })
      .then((apiResponse) => {
        try {
          // Parse and sanitize response(sometimes gemini returns markdown formatted json)
          const cleanJson = apiResponse.result
            .replace(/```json/g, "")
            .replace(/```/g, "");
          setData(JSON.parse(cleanJson));
        } catch (e) {
          console.error("Failed to parse AI response", e);
          setError("Failed to process travel data.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Travel AI is currently busy. Please try again.");
        setLoading(false);
      });
  };

  // Trigger fetch on user interaction
  useEffect(() => {
    if (showResults && !data && !loading && !error) {
      fetchInsights();
    }
  }, [showResults]);

  const getSafetyColor = (score) => {
    const num = parseInt(score);
    if (num >= 8) return "bg-green-500";
    if (num >= 5) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleRetry = () => {
    setError(null);
    setLoading(false);
    // Force re-mount to clear transient states
    setIsOpen(false);
    setTimeout(() => setIsOpen(true), 100);
  };

  return (
    <>
      {/* Floating Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all border-4 border-[#0f172a]"
      >
        <BotMessageSquare className="w-8 h-8 text-white" />
        {/* Notification Dot Animation */}
        {!data && !error && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
          </span>
        )}
      </button>

      {/* Modal Container */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0f172a] w-full max-w-lg rounded-3xl border border-indigo-500/30 shadow-2xl p-6 relative overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                  <h3 className="text-xl font-bold text-white">Travel AI</h3>
                </div>
                <p className="text-sm text-indigo-300 mt-1 font-medium">
                  Analysis for {amount} {from} to {to}
                </p>
              </div>
              <div className="flex gap-2">
                {/* Refresh Button */}
                {showResults && (
                  <button
                    onClick={fetchInsights}
                    disabled={loading}
                    className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
                    title="Refresh Analysis"
                  >
                    <RefreshCw
                      className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                    />
                  </button>
                )}
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-red-500/20 hover:text-red-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Welcome View */}
            {!showResults && !error && (
              <div className="text-center py-12 flex flex-col items-center">
                <div className="bg-indigo-500/10 p-6 rounded-full mb-4">
                  <Globe className="w-12 h-12 text-indigo-400" />
                </div>
                <h4 className="text-white text-lg font-bold mb-2">
                  Ready to explore {to}?
                </h4>
                <p className="text-slate-400 text-sm mb-8 max-w-xs">
                  Get instant safety scores, budget tips, and local food guides.
                </p>
                <button
                  onClick={() => setShowResults(true)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <Sparkles className="w-5 h-5" /> Reveal Guide
                </button>
              </div>
            )}

            {/* ERROR STATE */}
            {showResults && error && (
              <div className="py-10 flex flex-col items-center justify-center text-center">
                <div className="bg-red-500/10 p-4 rounded-full mb-3">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <h4 className="text-white font-bold mb-2">Connection Issue</h4>
                <p className="text-slate-400 text-sm mb-6 max-w-xs">{error}</p>
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Try Again
                </button>
              </div>
            )}

            {/* Loading Skeleton */}
            {showResults && loading && !error && (
              <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-500">
                {/* Skeleton Headline */}
                <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 h-32 animate-pulse flex flex-col justify-center gap-3">
                  <div className="h-6 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-700/50 rounded w-1/2"></div>
                </div>

                {/* Skeleton Tip */}
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 h-24 animate-pulse flex flex-col gap-2">
                  <div className="h-4 bg-slate-700 rounded w-1/4"></div>
                  <div className="h-4 bg-slate-700/50 rounded w-full"></div>
                  <div className="h-4 bg-slate-700/50 rounded w-2/3"></div>
                </div>

                {/* Skeleton Split */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 h-32 animate-pulse flex flex-col gap-2">
                    <div className="h-4 bg-slate-700 rounded w-1/3"></div>
                    <div className="h-8 bg-slate-700 rounded w-1/2 my-1"></div>
                    <div className="h-2 bg-slate-700 rounded w-full mt-auto"></div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 h-32 animate-pulse flex flex-col gap-2">
                    <div className="h-4 bg-slate-700 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                    <div className="h-4 bg-slate-700/50 rounded w-full"></div>
                  </div>
                </div>

                {/* Skeleton List */}
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 h-40 animate-pulse flex flex-col gap-3">
                  <div className="h-4 bg-slate-700 rounded w-1/4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-slate-700/50 rounded w-20"></div>
                    <div className="h-6 bg-slate-700/50 rounded w-24"></div>
                    <div className="h-6 bg-slate-700/50 rounded w-16"></div>
                  </div>
                  <div className="h-px bg-slate-700/50 w-full my-1"></div>
                  <div className="h-4 bg-slate-700 rounded w-1/4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-slate-700/50 rounded w-24"></div>
                    <div className="h-6 bg-slate-700/50 rounded w-20"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Results Grid */}
            {showResults && data && !loading && !error && (
              <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-bottom-4 duration-500">
                {/* Main Headline Card */}
                <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-5 rounded-2xl border border-indigo-500/30">
                  <h3 className="text-white font-bold text-lg mb-2">
                    {data.headline}
                  </h3>
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-500/20 p-2 rounded-lg shrink-0">
                      <Wallet className="w-4 h-4 text-indigo-300" />
                    </div>
                    <p className="text-slate-300 text-sm">{data.buy}</p>
                  </div>
                </div>

                {/* Pro Tip */}
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                  <div className="flex items-center gap-2 mb-2 text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Pro Tip
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm">{data.tip}</p>
                </div>

                {/* Split Grid: Safety & Weather */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Safety Gauge */}
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-400">
                        SAFETY
                      </span>
                    </div>
                    <div className="text-2xl font-black text-white mb-2">
                      {data.safety?.score}
                      <span className="text-sm text-slate-500 font-normal">
                        /10
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getSafetyColor(
                          data.safety?.score
                        )}`}
                        style={{
                          width: `${
                            (parseInt(data.safety?.score) / 10) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Weather Widget */}
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <CloudSun className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-400">
                        WEATHER
                      </span>
                    </div>
                    <div className="text-white font-medium text-sm mb-1">
                      {data.weather?.condition}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {data.weather?.forecast}
                    </p>
                  </div>
                </div>

                {/* Must Try Section */}
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-orange-400">
                      <Utensils className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Local Eats
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {data.must_things?.foods?.map((f, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-orange-500/10 text-orange-300 text-xs rounded-lg border border-orange-500/20 shadow-sm"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-slate-700/50 w-full"></div>

                  <div>
                    <div className="flex items-center gap-2 mb-2 text-emerald-400">
                      <MapPin className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Hidden Gems
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {data.must_things?.places?.map((p, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 text-xs rounded-lg border border-emerald-500/20 shadow-sm"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiInsights;
