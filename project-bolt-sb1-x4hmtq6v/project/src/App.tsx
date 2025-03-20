import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Loader2 } from 'lucide-react';
import { Player, Team } from './types';
import { generateTeam } from './utils/teamGenerator';

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ name: '', group: 'A' });

  const addPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    const player: Player = {
      id: crypto.randomUUID(),
      name: newPlayer.name,
      group: newPlayer.group as 'A' | 'B' | 'C' | 'D',
      selectionCount: 0
    };
    setPlayers([...players, player]);
    setNewPlayer({ name: '', group: 'A' });
  };

  const generateNewTeam = () => {
    setLoading(true);
    
    const groupA = players.filter(p => p.group === 'A');
    const groupB = players.filter(p => p.group === 'B');
    const groupC = players.filter(p => p.group === 'C');
    const groupD = players.filter(p => p.group === 'D');

    if (groupA.length < 6 || groupB.length < 5 || 
        groupC.length < 4 || groupD.length < 4) {
      alert('Please ensure you have enough players in each group');
      setLoading(false);
      return;
    }

    const selectedPlayers = generateTeam(groupA, groupB, groupC, groupD);
    
    // Update selection counts
    setPlayers(players.map(p => {
      if (selectedPlayers.find(sp => sp.id === p.id)) {
        return { ...p, selectionCount: p.selectionCount + 1 };
      }
      return p;
    }));

    const newTeam: Team = {
      id: crypto.randomUUID(),
      players: selectedPlayers,
      created_at: new Date().toISOString()
    };

    setTeams([...teams, newTeam]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-8 w-8" />
            Team Generator
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Player</h2>
            <form onSubmit={addPlayer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Player Name
                </label>
                <input
                  type="text"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Group
                </label>
                <select
                  value={newPlayer.group}
                  onChange={(e) => setNewPlayer({ ...newPlayer, group: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="A">Group A</option>
                  <option value="B">Group B</option>
                  <option value="C">Group C</option>
                  <option value="D">Group D</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Add Player
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Player List</h2>
            <div className="space-y-2">
              {['A', 'B', 'C', 'D'].map(group => (
                <div key={group} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Group {group}</h3>
                  <ul className="space-y-1">
                    {players
                      .filter(p => p.group === group)
                      .map(player => (
                        <li key={player.id} className="text-sm text-gray-600">
                          {player.name} (Selected: {player.selectionCount})
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={generateNewTeam}
            disabled={loading || teams.length >= 6}
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Generate Team'
            )}
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Generated Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team, index) => (
              <div key={team.id} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-medium mb-2">Team {index + 1}</h3>
                <ul className="space-y-1">
                  {team.players.map(player => (
                    <li key={player.id} className="text-sm text-gray-600">
                      {player.name} (Group {player.group})
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;