// Parse comma-separated string to array (trimmed and filtered)
export function csvToArray(input = "") {
    return input
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
}
