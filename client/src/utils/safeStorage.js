export const safeParseJSON = (rawValue, fallback) => {
  if (rawValue === null || rawValue === undefined) return fallback;
  if (rawValue === 'undefined' || rawValue === 'null' || rawValue === '') return fallback;

  try {
    return JSON.parse(rawValue);
  } catch {
    return fallback;
  }
};

