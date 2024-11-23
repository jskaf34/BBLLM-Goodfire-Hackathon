import { useMemo } from "react";
import { faker } from "@faker-js/faker";

const generateRandomColor = () => {
  const randomHex = Math.floor(Math.random() * 16777215).toString(16); // Generate a random number and convert to hex
  return `#${randomHex.padStart(6, "0")}`; // Ensure it's always 6 characters long
};

// Hook implementation
export const useRandom = () => {
  // Memoize faker to avoid re-creating instances unnecessarily
  const memoizedFaker = useMemo(() => faker, []);
  
  // Memoize random color generation function
  const randomColor = useMemo(() => generateRandomColor, []);

  return {
    faker: memoizedFaker,
    randomColor,
  };
};