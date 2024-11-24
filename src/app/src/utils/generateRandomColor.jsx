const generateRandomColor = () => {
  const randomHex = Math.floor(Math.random() * 16777215).toString(16); // Generate a random number and convert to hex
  return `#${randomHex.padStart(6, "0")}`; // Ensure it's always 6 characters long
};