import { Player } from '../types';

function weightedRandom(players: Player[]): Player {
  const totalWeight = players.reduce((acc, player) => {
    // Lower selection count means higher probability
    return acc + (1 / (player.selectionCount + 1));
  }, 0);

  let random = Math.random() * totalWeight;
  
  for (const player of players) {
    const weight = 1 / (player.selectionCount + 1);
    random -= weight;
    if (random <= 0) {
      return player;
    }
  }
  
  return players[0];
}

export function generateTeam(
  groupA: Player[],
  groupB: Player[],
  groupC: Player[],
  groupD: Player[]
): Player[] {
  const selectedPlayers: Player[] = [];
  
  // Select 4 players from Group A
  for (let i = 0; i < 4; i++) {
    const availablePlayers = groupA.filter(
      p => !selectedPlayers.includes(p)
    );
    selectedPlayers.push(weightedRandom(availablePlayers));
  }
  
  // Select 3 players from Group B
  for (let i = 0; i < 3; i++) {
    const availablePlayers = groupB.filter(
      p => !selectedPlayers.includes(p)
    );
    selectedPlayers.push(weightedRandom(availablePlayers));
  }
  
  // Select 2 players from Group C
  for (let i = 0; i < 2; i++) {
    const availablePlayers = groupC.filter(
      p => !selectedPlayers.includes(p)
    );
    selectedPlayers.push(weightedRandom(availablePlayers));
  }
  
  // Select 2 players from Group D
  for (let i = 0; i < 2; i++) {
    const availablePlayers = groupD.filter(
      p => !selectedPlayers.includes(p)
    );
    selectedPlayers.push(weightedRandom(availablePlayers));
  }
  
  return selectedPlayers;
}