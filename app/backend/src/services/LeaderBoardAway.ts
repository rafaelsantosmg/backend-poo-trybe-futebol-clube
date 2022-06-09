import Matche from '../database/models/matches';
import Team from '../database/models/teams';
import { TMatche } from '../types/TMatche';
import { TTeam } from '../types/TTeam';
import { TReturnMatche } from '../types/TReturnMatche';

export default class LeaderBoardHomeService {
  private _matches: TMatche[];
  private _teams: TTeam[];
  private _leaderBoard: TReturnMatche;
  private _returnLeaderBoard: TReturnMatche[];

  private getTeamWinner = (matches: TMatche[]): number =>
    matches.reduce((acc, matche) => {
      if (matche.awayTeamGoals > matche.homeTeamGoals) {
        return acc + 1;
      }
      return acc;
    }, 0);

  private getTeamLosser = (matches: TMatche[]): number => matches
    .reduce((acc, matche) => {
      if (matche.awayTeamGoals < matche.homeTeamGoals) {
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

  private getGoalsFavor = (matches: TMatche[]):number => matches
    .reduce((acc, matche) => acc + matche.awayTeamGoals, 0);

  private getGoalsOwn = (matches: TMatche[]):number => matches
    .reduce((acc, matche) => acc + matche.homeTeamGoals, 0);

  private getTotalPoints(matches: TMatche[]):number {
    return this.getTeamWinner(matches as TMatche[]) * 3
    + this.getTeamDrawrs(matches as TMatche[]);
  }

  private getGoalBalance(matches: TMatche[]):number {
    return this.getGoalsFavor(matches) - this.getGoalsOwn(matches);
  }

  private getEfficiency(matches: TMatche[]):number {
    return Number((((this.getTeamWinner(matches as TMatche[]) * 3
        + this.getTeamDrawrs(matches as TMatche[]))
        / (matches.length * 3))
        * 100).toFixed(2));
  }

  private createLeaderboard = (teamName: string, matches: TMatche[]) => {
    this._leaderBoard = {
      name: teamName,
      totalPoints: this.getTotalPoints(matches),
      totalGames: matches.length,
      totalVictories: this.getTeamWinner(matches as TMatche[]),
      totalDraws: this.getTeamDrawrs(matches as TMatche[]),
      totalLosses: this.getTeamLosser(matches as TMatche[]),
      goalsFavor: this.getGoalsFavor(matches as TMatche[]),
      goalsOwn: this.getGoalsOwn(matches as TMatche[]),
      goalsBalance: this.getGoalBalance(matches),
      efficiency: this.getEfficiency(matches),
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

  private getTeamsMatcheAway(teams: TTeam[], matches: TMatche[]) {
    return teams.map((team) => {
      this._matches = matches.filter((matche) => (
        team.id === matche.awayTeam
      ));
      return this.createLeaderboard(team.teamName, this._matches);
    });
  }

  public async getAway() {
    this._teams = await Team.findAll();
    this._matches = await Matche.findAll({ where: { inProgress: false } });
    this._returnLeaderBoard = this.getTeamsMatcheAway(this._teams, this._matches);
    return this.sortLeaderBoard(this._returnLeaderBoard);
  }
}
