export function generateRandomNumber(min = 1025, max = 49151): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
