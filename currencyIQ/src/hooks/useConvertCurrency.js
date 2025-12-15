import { useState, useEffect } from "react";
import axios from "axios";
import { CURRENCY_API_BASE } from "../config";

export function useConvertCurrency(from, to, amount) {
  const [newAmount, setNewAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!from || !to || !amount || from === to) {
      setNewAmount(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    axios(`${CURRENCY_API_BASE}/latest?from=${from}&to=${to}`)
      .then((res) => {
        const rate = res.data.rates[to];
        setNewAmount(amount * rate);
      })
      .catch((err) => {
        console.error("Currency conversion failed:", err);
        setError("Failed to convert currency");
        setNewAmount(0);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [from, to, amount]);

  return { newAmount, isLoading, error };
}
