import { useCallback, useState } from "react";

export function useCopyToClipboard(resetMs = 1800) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setError(false);
        setTimeout(() => setCopied(false), resetMs);
      } catch {
        setError(true);
        setTimeout(() => setError(false), resetMs);
      }
    },
    [resetMs],
  );

  return { copied, error, copy };
}
