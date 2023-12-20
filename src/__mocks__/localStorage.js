export const localStorageMock = (() => {
  let store = {};

  // Initialiser getItem en tant que fonction jest mockable
  const getItem = jest.fn((key) => JSON.stringify(store[key]));

  const setItem = (key, value) => {
    store[key] = value.toString();
  };

  const clear = () => {
    store = {};
  };

  const removeItem = (key) => {
    delete store[key];
  };

  return {
    getItem,
    setItem,
    clear,
    removeItem,
  };
})();
