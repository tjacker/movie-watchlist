// Debounce source https://egghead.io/lessons/javascript-build-lodash-debounce-from-scratch
export function debounce(fn, delay = 500) {
  let timeoutId;

  return function (...args) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
