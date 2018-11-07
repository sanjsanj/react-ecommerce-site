exports.formatPlural = (value, string) =>
  string + (value.length === 1 ? "" : string.slice(-1) === "s" ? "es" : "s");
