/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const parts = path.split('.').filter(Boolean);

  return (obj) => {
    let current = obj;

    for (const key of parts) {
      if (current == null || typeof current !== 'object') return undefined;
      if (!Object.hasOwn(current, key)) return undefined;
      current = current[key];
    }

    return current;
  };
}
