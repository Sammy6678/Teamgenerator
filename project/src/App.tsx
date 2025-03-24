import React, { useState } from 'react';
import { Users, UserPlus, Loader2, Trophy, AlertCircle } from 'lucide-react';
import { Player, Team, GroupType, GROUP_LIMITS, GROUP_NAMES } from './types';
import { generateTeam } from './utils/teamGenerator';

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ name: '', group: 'TOP' as GroupType });

  const getGroupCount = (group: GroupType) => {
    return players.filter(p => p.group === group).length;
  };

  const isGroupFull = (group: GroupType) => {
    return getGroupCount(group) >= GROUP_LIMITS[group];
  };

  const addPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (isGroupFull(newPlayer.group)) {
      alert(`${GROUP_NAMES[newPlayer.group]} group is full! (Max: ${GROUP_LIMITS[newPlayer.group]} players)`);
      return;
    }
    
    const player: Player = {
      id: crypto.randomUUID(),
      name: newPlayer.name,
      group: newPlayer.group,
      selectionCount: 0
    };
    setPlayers([...players, player]);
    setNewPlayer({ name: '', group: 'TOP' });
  };

  const generateNewTeam = () => {
    setLoading(true);
    
    const groupTOP = players.filter(p => p.group === 'TOP');
    const groupBAT = players.filter(p => p.group === 'BAT');
    const groupBOWL = players.filter(p => p.group === 'BOWL');
    const groupOPT = players.filter(p => p.group === 'OPT');
    const groupRISK = players.filter(p => p.group === 'RISK');

    if (groupTOP.length < 2 || groupBAT.length < 2 || 
        groupBOWL.length < 2 || groupOPT.length < 1 ||
        groupRISK.length < 1) {
      alert('Please ensure you have enough players in each group:\n' +
            '- Top Players: at least 2\n' +
            '- Batters & All-rounders: at least 2\n' +
            '- Bowlers & Tuka: at least 2\n' +
            '- Optional Players: at least 1\n' +
            '- Risky Options: at least 1');
      setLoading(false);
      return;
    }

    try {
      const selectedPlayers = generateTeam(
        groupTOP, groupBAT, groupBOWL, groupOPT, groupRISK, teams.length
      );
      
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
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to generate team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-10 pointer-events-none" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80')"
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 flex items-center gap-3">
            <Trophy className="h-10 w-10 text-indigo-600" />
            Cricket Team Generator
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-indigo-100">
            <h2 className="text-2xl font-semibold text-indigo-900 mb-4 flex items-center gap-2">
              <UserPlus className="h-6 w-6 text-indigo-600" />
              Add New Player
            </h2>
            <form onSubmit={addPlayer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-indigo-900">
                  Player Name
                </label>
                <input
                  type="text"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                  className="mt-1 block w-full rounded-lg border-indigo-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-900">
                  Player Category
                </label>
                <select
                  value={newPlayer.group}
                  onChange={(e) => setNewPlayer({ ...newPlayer, group: e.target.value as GroupType })}
                  className="mt-1 block w-full rounded-lg border-indigo-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {Object.entries(GROUP_NAMES).map(([key, name]) => (
                    <option key={key} value={key}>
                      {name} ({getGroupCount(key as GroupType)}/{GROUP_LIMITS[key as GroupType]})
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Add Player
              </button>
            </form>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-indigo-100">
            <h2 className="text-2xl font-semibold text-indigo-900 mb-4 flex items-center gap-2">
              <Users className="h-6 w-6 text-indigo-600" />
              Player List
            </h2>
            <div className="space-y-3">
              {Object.entries(GROUP_NAMES).map(([key, name]) => (
                <div key={key} className="border border-indigo-100 rounded-lg p-4 bg-white/50">
                  <h3 className="font-medium text-indigo-900 mb-2 flex items-center justify-between">
                    <span>{name}</span>
                    <span className="text-sm text-indigo-600">
                      {getGroupCount(key as GroupType)}/{GROUP_LIMITS[key as GroupType]}
                    </span>
                  </h3>
                  <ul className="space-y-1">
                    {players
                      .filter(p => p.group === key)
                      .map(player => (
                        <li key={player.id} className="text-sm text-gray-600 flex items-center gap-2">
                          <span>• {player.name}</span>
                          <span className="text-xs text-indigo-500">
                            (Selected: {player.selectionCount})
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={generateNewTeam}
            disabled={loading || teams.length >= 5}
            className="flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 transition-all transform hover:scale-105"
          >
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <Trophy className="h-6 w-6 mr-2" />
                Generate Team
              </>
            )}
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-indigo-900 mb-4 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-indigo-600" />
            Generated Teams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team, index) => (
              <div key={team.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-indigo-100">
                <h3 className="font-medium text-xl text-indigo-900 mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-indigo-600" />
                  Team {index + 1}
                </h3>
                <ul className="space-y-2">
                  {team.players.map(player => (
                    <li key={player.id} className="text-sm text-gray-600 flex items-center gap-2">
                      <span>• {player.name}</span>
                      <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                        {GROUP_NAMES[player.group]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {teams.length === 0 && (
          <div className="mt-8 text-center text-gray-500 flex items-center justify-center gap-2">
            <AlertCircle className="h-5 w-5" />
            No teams generated yet
          </div>
        )}
      </div>
    </div>
  );
}

export default App;