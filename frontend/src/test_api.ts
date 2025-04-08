import { sportmonksAPI } from './services/sportmonks_api';

async function runDiagnostic() {
  console.log('🔍 Starting SportMonks API Diagnostic...\n');

  try {
    // Test des leagues
    console.log('Testing leagues endpoint...');
    const leagues = await sportmonksAPI.getLeagues();
    console.log(`✅ Found ${leagues.length} leagues`);

    if (leagues.length > 0) {
      // Test des équipes d'une ligue
      const leagueId = leagues[0].id;
      console.log(`\nTesting teams for league ${leagues[0].name}...`);
      const teams = await sportmonksAPI.getTeams(leagueId);
      console.log(`✅ Found ${teams.length} teams`);

      if (teams.length > 0) {
        // Test des joueurs d'une équipe
        const teamId = teams[0].id;
        console.log(`\nTesting players for team ${teams[0].name}...`);
        const players = await sportmonksAPI.getPlayers(teamId);
        console.log(`✅ Found ${players.length} players`);

        if (players.length > 0) {
          // Test des détails d'un joueur
          const playerId = players[0].id;
          console.log(`\nTesting player details for ${players[0].name}...`);
          const playerDetails = await sportmonksAPI.getPlayerDetails(playerId);
          console.log('✅ Player details retrieved successfully');
        }
      }
    }

  } catch (error) {
    console.error('❌ Error during tests:', error);
  }

  console.log('\n🏁 Diagnostic completed');
}

runDiagnostic(); 