import { useState } from 'react';

function readValue(key, initialValue) {
  try {
    const item = window.localStorage.getItem(key);
    return item !== null ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(`Could not read "${key}" from localStorage:`, error);
    return initialValue;
  }
}

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readValue(key, initialValue));

  const setStoredValue = (newValue) => {
    try {
      const valueToStore =
        newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Could not save "${key}" to localStorage:`, error);
    }
  };

  return [value, setStoredValue];
}

export default useLocalStorage;
