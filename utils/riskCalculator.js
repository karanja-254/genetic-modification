const DISEASE_WEIGHTS = {
  diabetes: 15,
  'heart disease': 18,
  cancer: 20,
  hypertension: 12,
  alzheimer: 16,
  'kidney disease': 14,
  stroke: 17,
  asthma: 10,
  default: 12
};

const RELATIVE_WEIGHTS = {
  mother: 1.2,
  father: 1.2,
  sibling: 1.0,
  sister: 1.0,
  brother: 1.0,
  grandmother: 0.6,
  grandfather: 0.6,
  aunt: 0.5,
  uncle: 0.5,
  cousin: 0.3,
  default: 0.8
};

function calculateRiskScore(historyItems) {
  if (!historyItems || historyItems.length === 0) {
    return {
      riskScore: 0,
      summary: 'No family health history available'
    };
  }

  let totalScore = 0;
  const diseaseCount = {};

  historyItems.forEach(item => {
    const diseaseName = item.disease_name.toLowerCase();
    const relative = item.relative.toLowerCase();

    const diseaseWeight = DISEASE_WEIGHTS[diseaseName] || DISEASE_WEIGHTS.default;
    const relativeWeight = RELATIVE_WEIGHTS[relative] || RELATIVE_WEIGHTS.default;

    const itemScore = diseaseWeight * relativeWeight;
    totalScore += itemScore;

    if (!diseaseCount[item.disease_name]) {
      diseaseCount[item.disease_name] = 0;
    }
    diseaseCount[item.disease_name]++;
  });

  const riskScore = Math.min(100, Math.round(totalScore));

  const topDiseases = Object.entries(diseaseCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([disease, count]) => `${disease} (${count} case${count > 1 ? 's' : ''})`)
    .join(', ');

  let riskLevel = 'Low';
  if (riskScore >= 70) {
    riskLevel = 'High';
  } else if (riskScore >= 40) {
    riskLevel = 'Medium';
  }

  const summary = `Risk Level: ${riskLevel}. Analyzed ${historyItems.length} family health record(s). Primary concerns: ${topDiseases || 'Various conditions'}. This score is calculated based on hereditary patterns and should be reviewed with a healthcare professional.`;

  return {
    riskScore,
    summary
  };
}

module.exports = { calculateRiskScore };
