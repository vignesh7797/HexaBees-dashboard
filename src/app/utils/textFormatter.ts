export const toUpperCase = (str) => str.toUpperCase();

export const toLowerCase = (str) => str.toLowerCase();

export const toTitleCase = (str) =>
  str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

export const toDecimal = (str) => Number(str).toFixed(2);