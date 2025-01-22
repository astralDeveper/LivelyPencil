import { useEffect, useState } from "react";

/**
 *
 * @param {string} value The value of the string that is changing e.g text in TextInput
 * @param {number} delay Time in milliseconds
 * @returns A Custom Debounce Function
 */

export default function UseDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
