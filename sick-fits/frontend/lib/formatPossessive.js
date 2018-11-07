exports.formatPossessive = word =>
  `${word}'${word.slice(-1) === "s" ? "" : "s"}`;
