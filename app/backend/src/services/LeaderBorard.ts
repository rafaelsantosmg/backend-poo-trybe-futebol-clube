import Matche from '../database/models/matches';
import Team from '../database/models/teams';
import { TMatche } from '../types/TMatche';
import { TTeam } from '../types/TTeam';
import { TReturnMatche } from '../types/TReturnMatche';

export default class LeaderBoardService {
  private _dataTeams: Team[];
  private _dataMatches: Matche[];
  private _matches: TMatche[];
  private _teams: TTeam[];
  private _leaderBoard: TReturnMatche;
  private _returnLeaderBoard: TReturnMatche[];

  private getMatchesInProgress(matches: Matche[]) {
    this._matches = matches
      .reduce((acc: Array<TMatche>, { id, homeTeam, awayTeam, homeTeamGoals,
        awayTeamGoals, inProgress }) => {
        if (inProgress === false) {
          acc.push({ id, homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress });
        }
        return acc;
      }, []);
    return this._matches;
  }

  private getTeams(teams: Team[]) {
    this._teams = teams
      .reduce((acc: Array<TTeam>, { id, teamName }) => {
        if (id !== 0) acc.push({ id, teamName });
        return acc;
      }, []);
    return this._teams;
  }

  private getTeamWinner = (matches: TMatche[]): number => matches.reduce((acc, matche) => {
    if (matche.homeTeamGoals > matche.awayTeamGoals) {
      return acc + 1;
    }
    return acc;
  }, 0);

  private getTeamLosser = (matches: TMatche[]): number => matches.reduce((acc, matche) => {
    if (matche.homeTeamGoals < matche.awayTeamGoals) {
      return acc + 1;
    }
    return acc;
  }, 0);

  private getTeamDrawrs = (matches: TMatche[]): number => matches.reduce((acc, matche) => {
    if (matche.homeTeamGoals === matche.awayTeamGoals) {
      return acc + 1;
    }
    return acc;
  }, 0);

  private getGoalsFavor = (matches: TMatche[]):number => matches.reduce((acc, matche) => {
    if (matche.homeTeamGoals > 0) {
      return acc + matche.homeTeamGoals;
    }
    return acc;
  }, 0);

  private getGoalsOwn = (matches: TMatche[]):number => matches.reduce((acc, matche) => {
    if (matche.awayTeamGoals > 0) {
      return acc + matche.awayTeamGoals;
    }
    return acc;
  }, 0);

  private createLeaderboard = (teamName: string, macthes: TMatche[]) => {
    this._leaderBoard = {
      name: teamName,
      totalPoints: this.getTeamWinner(macthes as TMatche[]) * 3
        + this.getTeamDrawrs(macthes as TMatche[]),
      totalGames: macthes.length,
      totalVictories: this.getTeamWinner(macthes as TMatche[]),
      totalDraws: this.getTeamDrawrs(macthes as TMatche[]),
      totalLosses: this.getTeamLosser(macthes as TMatche[]),
      goalsFavor: this.getGoalsFavor(macthes as TMatche[]),
      goalsOwn: this.getGoalsOwn(macthes as TMatche[]),
      goalsBalance: this.getGoalsFavor(macthes as TMatche[])
        - this.getGoalsOwn(macthes as TMatche[]),
      efficiency: Number((((this.getTeamWinner(macthes as TMatche[]) * 3
        + this.getTeamDrawrs(macthes as TMatche[]))
        / (macthes.length * 3))
        * 100).toFixed(2)),
    };
    return this._leaderBoard;
  };

  private sortLeaderBoard(leaderboard: TReturnMatche[]) {
    this._returnLeaderBoard = leaderboard.sort((teamA, teamB) => (
      teamB.totalPoints - teamA.totalPoints
      || teamB.totalVictories - teamA.totalVictories
      || teamB.goalsBalance - teamA.goalsBalance
      || teamB.goalsFavor - teamA.goalsFavor
      || teamB.goalsOwn - teamA.goalsOwn
    ));
    return this._returnLeaderBoard;
  }

  private getHome(teams: TTeam[], matches: TMatche[]) {
    return teams.map((team) => {
      this._matches = matches.filter((matche) => (
        team.id === matche.homeTeam
      ));
      return this.createLeaderboard(team.teamName, this._matches);
    });
  }

  async getAll() {
    this._dataTeams = await Team.findAll();
    this._dataMatches = await Matche.findAll();
    this._matches = this.getMatchesInProgress(this._dataMatches);
    this._teams = this.getTeams(this._dataTeams);
    this._returnLeaderBoard = this.getHome(this._teams, this._matches);
    return this.sortLeaderBoard(this._returnLeaderBoard);
  }
}
