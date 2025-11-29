function evaluateCondition(condition, answers) {
  const { questionKey, operator, value } = condition;
  const userAnswer = answers[questionKey];

  if (userAnswer === undefined || userAnswer === null) {
    return false;
  }

  switch (operator) {
    case "equals":
      return userAnswer === value;

    case "notEquals":
      return userAnswer !== value;

    case "contains":
      if (Array.isArray(userAnswer)) {
        return userAnswer.includes(value);
      }
      if (typeof userAnswer === "string") {
        return userAnswer.includes(value);
      }
      return false;

    default:
      return false;
  }
}

function shouldShowQuestion(rules, answersSoFar) {
  if (!rules) return true;

  const { logic, conditions } = rules;

  if (!Array.isArray(conditions) || conditions.length === 0) {
    return true; // no conditions → always show
  }

  if (logic === "AND") {
    return conditions.every((c) => evaluateCondition(c, answersSoFar));
  }

  if (logic === "OR") {
    return conditions.some((c) => evaluateCondition(c, answersSoFar));
  }

  return true; // fallback
}

module.exports = { shouldShowQuestion };
