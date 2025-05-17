const questions = require('../data/assessmentQuestions');
const roadmaps = require('../data/roadmaps');

exports.suggestCareer = (answers = []) => {
  const roleScores = {};

  for (const answer of answers) {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) continue;

    const optionIndex = question.options.indexOf(answer.option);
    if (optionIndex === -1) continue;

    const hint = question.roleHints[optionIndex];

    if (Array.isArray(hint)) {
      hint.forEach((role) => {
        roleScores[role] = (roleScores[role] || 0) + 1;
      });
    } else if (typeof hint === 'string') {
      roleScores[hint] = (roleScores[hint] || 0) + 1;
    }
  }

  const sortedRoles = Object.entries(roleScores)
    .sort((a, b) => b[1] - a[1])
    .map(([role]) => ({
      role,
      steps: roadmaps[role]?.steps || [],
      skills: roadmaps[role]?.skills || []
    }));

  return sortedRoles.slice(0, 3); // Top 3 suggestions
};
