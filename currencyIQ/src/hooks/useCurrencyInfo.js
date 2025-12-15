import { useEffect, useState } from "react";
import { CURRENCY_API_BASE } from "../config";

export function useCurrencyInfo(currency) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currency) return;
    setLoading(true);
    fetch(`${CURRENCY_API_BASE}/latest?from=${currency}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res.rates);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch currency data:", err);
        setLoading(false);
      });
  }, [currency]);

  return { data, loading };
}
