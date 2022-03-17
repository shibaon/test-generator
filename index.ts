const generateRandom = (to: number) => {
  return Math.floor(Math.random() * (to + 1));
};

const generateCombination = (ids: number[], length: number) => {
  const result: number[] = [];
  while (result.length < length) {
    let num = generateRandom(ids.length - 1);
    while (result.includes(num)) {
      num = generateRandom(ids.length - 1);
    }
    result.push(num)
  }
  return result;
}

{
  const ids = new Array(Number(process.argv[2])).fill(null).map((_, i) => i + 1);
  const questSize = Number(process.argv[3]);
  const maxAllowedIntersec = Number(process.argv[4]);
  const result: number[][] = [];
  let failedAttempts = 0;
  const failedAttemptsRedLine = ids.length * 1000;
  let attempts = 0;
  const startTimestamp = Date.now();

  while (failedAttempts < failedAttemptsRedLine) {
    const combination = generateCombination(ids, questSize);
    if (!result.find((realResult) => {
      return realResult.reduce((acc, id) => acc + (combination.includes(id) ? 1 : 0), 0) > maxAllowedIntersec;
    })) {
      result.push(combination);
      failedAttempts = 0;
    } else {
      failedAttempts++;
    }
    attempts++;
    if (attempts % 100 === 0) {
      process.stdout.write(`\rПопыток всего: ${attempts}, неуспешных подряд: ${failedAttempts}, сгенерировано: ${result.length}`);
      process.stdout.write(`, времени прошло: ${Math.round((Date.now() - startTimestamp) / 1000)} сек.`);
    }
  }
  console.log('\nРезультат:')

  console.log(
    result.map(
      (r) => r.map((i) => ids[i]).sort((a, b) => a - b).join(',')
    ).join('\n')
  );
}
