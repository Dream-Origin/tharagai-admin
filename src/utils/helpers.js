// Parse comma-separated string to array (trimmed and filtered)
export function csvToArray(input = "") {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export const getProductId = (starterID = "TBP10000") => {
  const [, code, number] = starterID.match(/([A-Z]+)([0-9]+)/);
  return `${code}${Number(number) + 1}`;
};
