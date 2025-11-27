const supabase = require('../config/supabase');

function calculateDiversityLevel(score) {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

function calculateMatchScore(userHistory, partnerHistory) {
  const userDiseases = new Set(
    userHistory.map(h => h.disease_name.toLowerCase())
  );
  const partnerDiseases = new Set(
    partnerHistory.map(h => h.disease_name.toLowerCase())
  );

  const overlap = [...userDiseases].filter(d => partnerDiseases.has(d)).length;
  const total = new Set([...userDiseases, ...partnerDiseases]).size;

  if (total === 0) {
    return Math.floor(Math.random() * 30) + 50;
  }

  const diversityScore = ((total - overlap) / total) * 100;

  const randomVariation = (Math.random() - 0.5) * 20;
  const finalScore = Math.max(0, Math.min(100, Math.round(diversityScore + randomVariation)));

  return finalScore;
}

async function generatePairings(userId, userHistory, allUsers) {
  const pairings = [];

  const candidateUsers = allUsers.slice(0, Math.min(10, allUsers.length));

  for (const candidate of candidateUsers) {
    const { data: partnerHistory } = await supabase
      .from('family_history')
      .select('*')
      .eq('user_id', candidate.id);

    if (!partnerHistory || partnerHistory.length === 0) {
      continue;
    }

    const matchScore = calculateMatchScore(userHistory, partnerHistory);
    const diversityLevel = calculateDiversityLevel(matchScore);

    pairings.push({
      user1_id: userId,
      user2_id: candidate.id,
      match_score: matchScore,
      diversity_level: diversityLevel
    });
  }

  pairings.sort((a, b) => b.match_score - a.match_score);

  return pairings.slice(0, 5);
}

module.exports = { generatePairings, calculateMatchScore, calculateDiversityLevel };
