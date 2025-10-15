// Data loading and parsing module

class DataLoader {
  constructor() {
    this.teamsData = [];
    this.maxValue = 0;
    this.maxWWCD = 0;
    this.maxKills = 0;
    this.maxDamage = 0;
    this.maxAssists = 0;
    this.maxAvgDmg = 0;
    this.maxLongestKill = 0;
    this.maxTimeSurvived = 0;
    this.maxDisMoved = 0;
    this.dataLoaded = false;
    this.errorMessage = '';
    this.currentDataSource = 'final_rankings';
    
    this.dataFiles = {
      'final_rankings': 'data_files/pubg_final_rankings.csv',
      'team_stats': 'data_files/stat_team_KR.csv',
      'player_stats': 'data_files/stat_player_KR.csv'
    };
  }
  
  loadDataSource(source, onSuccess, onError) {
    this.teamsData = [];
    this.maxValue = 0;
    this.maxWWCD = 0;
    this.maxKills = 0;
    this.maxDamage = 0;
    this.maxAssists = 0;
    this.maxAvgDmg = 0;
    this.maxLongestKill = 0;
    this.maxTimeSurvived = 0;
    this.maxDisMoved = 0;
    this.dataLoaded = false;
    this.currentDataSource = source;
    
    let filepath = this.dataFiles[source];
    
    try {
      loadTable(filepath, 'csv', 'header', 
        (table) => {
          console.log('CSV loaded successfully:', source);
          console.log('Rows:', table.getRowCount());
          this.dataLoaded = true;
          
          if (source === 'final_rankings') {
            this.parseFinalRankings(table);
          } else if (source === 'team_stats') {
            this.parseTeamStats(table);
          } else if (source === 'player_stats') {
            this.parsePlayerStats(table);
          }
          
          console.log('Data loaded:', this.teamsData.length);
          console.log('Max value:', this.maxValue);
          
          if (onSuccess) onSuccess();
        },
        (error) => {
          console.error('Error loading CSV:', error);
          this.errorMessage = 'Failed to load CSV file: ' + filepath;
          if (onError) onError(this.errorMessage);
        }
      );
    } catch (error) {
      console.error('Error in loadDataSource:', error);
      this.errorMessage = 'Error: ' + error.message;
      if (onError) onError(this.errorMessage);
    }
  }
  
  parseFinalRankings(table) {
    for (let i = 0; i < table.getRowCount(); i++) {
      let row = table.getRow(i);
      let teamData = {
        rank: row.getNum('Rank'),
        team: row.getString('Team'),
        totalPoints: row.getNum('Total Points'),
        placementPoints: row.getNum('Placement Points'),
        kills: row.getNum('Kills'),
        wwcd: row.getNum('WWCD')
      };
      this.teamsData.push(teamData);
      this.maxValue = max(this.maxValue, teamData.totalPoints);
      this.maxWWCD = max(this.maxWWCD, teamData.wwcd);
    }
  }
  
  parseTeamStats(table) {
    for (let i = 0; i < table.getRowCount(); i++) {
      let row = table.getRow(i);
      let killsStr = row.getString('Kills(HS)');
      let kills, headshots;
      
      if (killsStr.includes('(')) {
        kills = parseInt(killsStr.split('(')[0]);
        headshots = parseInt(killsStr.split('(')[1].split(')')[0]);
      } else {
        kills = parseInt(killsStr);
        headshots = 0;
      }
      
      let dmgDealtStr = row.getString('DmgDealt');
      let dmgDealt = parseFloat(dmgDealtStr);
      
      let avgDmgStr = row.getString('AVG.DmgDealt');
      let avgDmg = parseFloat(avgDmgStr);
      
      let longestKillStr = row.getString('LongestKill');
      let longestKill = parseFloat(longestKillStr.replace('m', ''));
      
      let timeSurvivedStr = row.getString('AVG.TimeSurvived');
      let timeParts = timeSurvivedStr.split(':');
      let timeSurvivedSeconds = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
      
      let disMovedStr = row.getString('AVG.DisMoved');
      let disMoved = parseFloat(disMovedStr.replace('km', ''));
      
      let teamData = {
        rank: row.getNum('RANK'),
        team: row.getString('Team'),
        kills: kills,
        headshots: headshots,
        dmgDealt: dmgDealt,
        dmgDealtStr: dmgDealtStr,
        assists: row.getNum('Assists'),
        avgDmg: avgDmg,
        avgDmgStr: avgDmgStr,
        longestKill: longestKill,
        longestKillStr: longestKillStr,
        timeSurvived: timeSurvivedSeconds,
        timeSurvivedStr: timeSurvivedStr,
        disMoved: disMoved,
        disMovedStr: disMovedStr
      };
      this.teamsData.push(teamData);
      
      // track max values for each metric
      this.maxKills = max(this.maxKills, teamData.kills);
      this.maxDamage = max(this.maxDamage, teamData.dmgDealt);
      this.maxAssists = max(this.maxAssists, teamData.assists);
      this.maxAvgDmg = max(this.maxAvgDmg, teamData.avgDmg);
      this.maxLongestKill = max(this.maxLongestKill, teamData.longestKill);
      this.maxTimeSurvived = max(this.maxTimeSurvived, teamData.timeSurvived);
      this.maxDisMoved = max(this.maxDisMoved, teamData.disMoved);
      this.maxValue = max(this.maxValue, teamData.dmgDealt);
    }
  }
  
  parsePlayerStats(table) {
    for (let i = 0; i < table.getRowCount(); i++) {
      let row = table.getRow(i);
      let killsStr = row.getString('Kills(HS)');
      let kills, headshots;
      
      if (killsStr.includes('(')) {
        kills = parseInt(killsStr.split('(')[0]);
        headshots = parseInt(killsStr.split('(')[1].split(')')[0]);
      } else {
        kills = parseInt(killsStr);
        headshots = 0;
      }
      
      let dmgDealtStr = row.getString('DmgDealt');
      let dmgDealt = parseFloat(dmgDealtStr);
      
      let avgDmgStr = row.getString('AVG.DmgDealt');
      let avgDmg = parseFloat(avgDmgStr);
      
      let longestKillStr = row.getString('LongestKill');
      let longestKill = parseFloat(longestKillStr.replace('m', ''));
      
      let timeSurvivedStr = row.getString('AVG.TimeSurvived');
      let timeParts = timeSurvivedStr.split(':');
      let timeSurvivedSeconds = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
      
      let disMovedStr = row.getString('AVG.DisMoved');
      let disMoved = parseFloat(disMovedStr.replace('km', ''));
      
      let teamData = {
        rank: row.getNum('Rank'),
        team: row.getString('Team'),
        player: row.getString('Player'),
        kills: kills,
        headshots: headshots,
        dmgDealt: dmgDealt,
        dmgDealtStr: dmgDealtStr,
        assists: row.getNum('Assists'),
        avgDmg: avgDmg,
        avgDmgStr: avgDmgStr,
        longestKill: longestKill,
        longestKillStr: longestKillStr,
        timeSurvived: timeSurvivedSeconds,
        timeSurvivedStr: timeSurvivedStr,
        disMoved: disMoved,
        disMovedStr: disMovedStr
      };
      this.teamsData.push(teamData);
      
      // Track max values for each metric
      this.maxKills = max(this.maxKills, teamData.kills);
      this.maxDamage = max(this.maxDamage, teamData.dmgDealt);
      this.maxAssists = max(this.maxAssists, teamData.assists);
      this.maxAvgDmg = max(this.maxAvgDmg, teamData.avgDmg);
      this.maxLongestKill = max(this.maxLongestKill, teamData.longestKill);
      this.maxTimeSurvived = max(this.maxTimeSurvived, teamData.timeSurvived);
      this.maxDisMoved = max(this.maxDisMoved, teamData.disMoved);
      this.maxValue = max(this.maxValue, teamData.dmgDealt);
    }
  }
  
  sortByMetric(metric) {
    // Don't sort if 'all'
    if (metric === 'all') {
      return;
    }
    
    // Sort the data based on the selected metric
    this.teamsData.sort((a, b) => {
      let aValue, bValue;
      
      // Handle final_rankings metrics
      if (this.currentDataSource === 'final_rankings') {
        switch(metric) {
          case 'totalPoints':
            aValue = a.totalPoints;
            bValue = b.totalPoints;
            break;
          case 'placementPoints':
            aValue = a.placementPoints;
            bValue = b.placementPoints;
            break;
          case 'kills':
            aValue = a.kills;
            bValue = b.kills;
            break;
          case 'wwcd':
            aValue = a.wwcd;
            bValue = b.wwcd;
            break;
          default:
            return 0;
        }
      } else {
        // Handle stats metrics
        switch(metric) {
          case 'kills':
            aValue = a.kills;
            bValue = b.kills;
            break;
          case 'dmgDealt':
            aValue = a.dmgDealt;
            bValue = b.dmgDealt;
            break;
          case 'assists':
            aValue = a.assists;
            bValue = b.assists;
            break;
          case 'avgDmg':
            aValue = a.avgDmg;
            bValue = b.avgDmg;
            break;
          case 'longestKill':
            aValue = a.longestKill;
            bValue = b.longestKill;
            break;
          case 'timeSurvived':
            aValue = a.timeSurvived;
            bValue = b.timeSurvived;
            break;
          case 'disMoved':
            aValue = a.disMoved;
            bValue = b.disMoved;
            break;
          default:
            return 0;
        }
      }
      
      // Sort in descending order (higher values first)
      return bValue - aValue;
    });
    
    // Update ranks after sorting
    for (let i = 0; i < this.teamsData.length; i++) {
      this.teamsData[i].rank = i + 1;
    }
  }
}

