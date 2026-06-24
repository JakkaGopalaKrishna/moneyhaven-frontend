export const setItem = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error saving to localStorage', error);
  }
};

export const getItem = (key) => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return null;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error('Error getting from localStorage', error);
    return null;
  }
};

export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage', error);
  }
};

export const clearAll = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage', error);
  }
};
