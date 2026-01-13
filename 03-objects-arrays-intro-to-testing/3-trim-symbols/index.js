/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === undefined) return string;
  if (size === 0) return '';

  let result = '';
  let prevChar;
  let count = 0;

  for (const char of string) {
    if (char === prevChar) {
      count += 1;
    } else {
      prevChar = char;
      count = 1;
    }

    if (count <= size) {
      result += char;
    }
  }

  return result;
}
