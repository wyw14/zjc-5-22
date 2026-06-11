interface Question {
  id: number;
  expression: string;
  correctAnswer: number;
  options: number[];
  explanation: string;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateExplanation(op: '+' | '-', a: number, b: number, answer: number): string {
  const aTens = Math.floor(a / 10);
  const aOnes = a % 10;
  const bTens = Math.floor(b / 10);
  const bOnes = b % 10;
  const answerTens = Math.floor(answer / 10);
  const answerOnes = answer % 10;

  if (op === '+') {
    const onesSum = aOnes + bOnes;
    if (onesSum >= 10) {
      const carry = Math.floor(onesSum / 10);
      return `${a} + ${b} = ${answer}\n个位：${aOnes} + ${bOnes} = ${onesSum}，写${onesSum % 10}进${carry}\n十位：${aTens} + ${bTens} + ${carry} = ${answerTens}\n合起来：${answerTens}个十和${answerOnes}个一，就是${answer}`;
    } else {
      return `${a} + ${b} = ${answer}\n个位：${aOnes} + ${bOnes} = ${onesSum}\n十位：${aTens} + ${bTens} = ${answerTens}\n合起来：${answerTens}个十和${answerOnes}个一，就是${answer}`;
    }
  } else {
    if (aOnes < bOnes) {
      return `${a} - ${b} = ${answer}\n个位：${aOnes}不够减${bOnes}，向十位借1变成${aOnes + 10} - ${bOnes} = ${answerOnes}\n十位：${aTens}借走1剩${aTens - 1}，${aTens - 1} - ${bTens} = ${answerTens}\n合起来：${answerTens}个十和${answerOnes}个一，就是${answer}`;
    } else {
      return `${a} - ${b} = ${answer}\n个位：${aOnes} - ${bOnes} = ${answerOnes}\n十位：${aTens} - ${bTens} = ${answerTens}\n合起来：${answerTens}个十和${answerOnes}个一，就是${answer}`;
    }
  }
}

function generateQuestion(id: number): Question {
  const op = Math.random() < 0.5 ? '+' : '-';
  let a: number, b: number, answer: number;

  if (op === '+') {
    a = randInt(1, 50);
    b = randInt(1, 50);
    answer = a + b;
  } else {
    a = randInt(10, 99);
    b = randInt(1, a);
    answer = a - b;
  }

  const expression = `${a} ${op} ${b}`;
  const explanation = generateExplanation(op, a, b, answer);

  const optionSet = new Set<number>([answer]);
  while (optionSet.size < 3) {
    const offset = randInt(1, 5) * (Math.random() < 0.5 ? 1 : -1);
    const fake = answer + offset;
    if (fake >= 0 && fake !== answer) {
      optionSet.add(fake);
    }
  }

  return { id, expression, correctAnswer: answer, options: shuffle([...optionSet]), explanation };
}

export function generateQuestions(count: number = 50): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    questions.push(generateQuestion(i + 1));
  }
  return questions;
}

export type { Question };
