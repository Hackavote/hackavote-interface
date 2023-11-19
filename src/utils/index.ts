export function shuffleArray<T>(array: T[]): T[] {
  const tempArray = [...array]; // avoid mutating the original array
  let currentIndex = tempArray.length, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Swap tempArray[currentIndex] with tempArray[randomIndex]
    [tempArray[currentIndex], tempArray[randomIndex]] = [
      tempArray[randomIndex], tempArray[currentIndex]];
  }

  return tempArray;
}
