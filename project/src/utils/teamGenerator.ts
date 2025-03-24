import { Player, GroupType } from '../types';

interface PlayerScore {
  player: Player;
  score: number;
}

function calculatePlayerScore(player: Player, totalTeams: number): number {
  // Base score inversely proportional to selection count
  const selectionRatio = player.selectionCount / Math.max(1, totalTeams);
  const baseScore = 1 - selectionRatio;

  // Penalty for overused players
  const overusePenalty = Math.max(0, selectionRatio - 0.5) * 0.5;

  // Final score between 0 and 1
  return Math.max(0, baseScore - overusePenalty);
}

function selectBestPlayers(
  players: Player[],
  count: number,
  selectedPlayers: Player[],
  totalTeams: number
): Player[] {
  const availablePlayers = players.filter(p => !selectedPlayers.includes(p));
  
  if (availablePlayers.length < count) {
    throw new Error('Not enough players available');
  }

  // Calculate scores for all available players
  const playerScores: PlayerScore[] = availablePlayers.map(player => ({
    player,
    score: calculatePlayerScore(player, totalTeams)
  }));

  // Sort by score (highest to lowest)
  playerScores.sort((a, b) => b.score - a.score);

  // Select top players while ensuring some randomness for variety
  const selected: Player[] = [];
  for (let i = 0; i < count; i++) {
    // Take top 3 available players for each position
    const topChoices = playerScores.slice(0, Math.min(3, playerScores.length));
    
    // Add some randomness to selection while favoring higher scores
    const totalWeight = topChoices.reduce((sum, ps) => sum + ps.score, 0);
    let random = Math.random() * totalWeight;
    
    let selectedIndex = 0;
    for (let j = 0; j < topChoices.length; j++) {
      random -= topChoices[j].score;
      if (random <= 0) {
        selectedIndex = j;
        break;
      }
    }

    // Add selected player
    selected.push(topChoices[selectedIndex].player);
    
    // Remove selected player from available choices
    const index = playerScores.findIndex(ps => ps.player.id === topChoices[selectedIndex].player.id);
    playerScores.splice(index, 1);
  }

  return selected;
}

export function generateTeam(
  groupTOP: Player[],
  groupBAT: Player[],
  groupBOWL: Player[],
  groupOPT: Player[],
  groupRISK: Player[],
  existingTeams: number = 0
): Player[] {
  const selectedPlayers: Player[] = [];
  
  try {
    // Select players from each group based on optimal distribution
    const topPlayers = selectBestPlayers(groupTOP, 2, selectedPlayers, existingTeams);
    selectedPlayers.push(...topPlayers);

    const batters = selectBestPlayers(groupBAT, 2, selectedPlayers, existingTeams);
    selectedPlayers.push(...batters);

    const bowlers = selectBestPlayers(groupBOWL, 2, selectedPlayers, existingTeams);
    selectedPlayers.push(...bowlers);

    const optionalPlayers = selectBestPlayers(groupOPT, 1, selectedPlayers, existingTeams);
    selectedPlayers.push(...optionalPlayers);

    // Select one risky player
    const riskyPlayer = selectBestPlayers(groupRISK, 1, selectedPlayers, existingTeams);
    selectedPlayers.push(...riskyPlayer);

    return selectedPlayers;
  } catch (error) {
    throw new Error('Unable to generate balanced team. Please check player availability.');
  }
}