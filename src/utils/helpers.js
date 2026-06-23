// Parse comma-separated string to array (trimmed and filtered)
export function csvToArray(input = "") {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export const getProductId = (starterID = "TBP10000") => {
  // If an array is passed, compute the max numeric suffix among productIds
  if (Array.isArray(starterID)) {
    const ids = starterID
      .map((p) => (typeof p === "string" ? p : p?.productId))
      .filter(Boolean);

    if (ids.length === 0) return getProductId("TBP10000");

    let max = -Infinity;
    let code = "";
    let numLen = 0;

    ids.forEach((id) => {
      const m = id.match(/([A-Z]+)([0-9]+)/);
      if (m) {
        const [, c, n] = m;
        const val = Number(n);
        if (val > max) {
          max = val;
          code = c;
          numLen = n.length;
        }
      }
    });

    if (max === -Infinity) return getProductId("TBP10000");

    const next = String(max + 1).padStart(numLen, "0");
    return `${code}${next}`;
  }

  const m = starterID.match(/([A-Z]+)([0-9]+)/);
  if (!m) return `${starterID}1`;
  const [, code, number] = m;
  const next = String(Number(number) + 1).padStart(number.length, "0");
  return `${code}${next}`;
};
