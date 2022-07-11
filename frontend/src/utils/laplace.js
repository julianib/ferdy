export function getMaxPossibleStars(smoel) {
  return smoel.ratings.length * 5;
}

export function getTotalStars(smoel) {
  // array containing each rating's stars integer value
  const arrayOfStars = smoel.ratings.map((rating) => rating.stars);

  // use reduce to sum each element in the array, with 0 as initial value
  const totalStars = arrayOfStars.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    0
  );

  return totalStars;
}

export function getLaplaceScore(smoel, rounded = false) {
  // returns unrounded Laplace score (float in range [0, 1])
  const totalStars = getTotalStars(smoel);
  const maxPossibleStars = getMaxPossibleStars(smoel);

  const laplaceScore = (totalStars + 1) / (maxPossibleStars + 2);

  if (rounded) {
    return Math.round(laplaceScore * 100) / 100;
  }

  return laplaceScore;
}
