import { TReturnMatche } from '../types/TReturnMatche';
import LeaderBoardHomeService from './LeaderBoardHome';
import LeaderBoardAwayService from './LeaderBoardAway';

export default class LeaderBoardService {
  private _leader: TReturnMatche;
  private _leaderBoard: TReturnMatche[];
  private _returnLeaderBoard: TReturnMatche[];
  private _leaderBoardHome = new LeaderBoardHomeService();
  private _leaderBoardAway = new LeaderBoardAwayService();

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

  private getTeamsMatches(leaderBoardHome: TReturnMatche[], leaderBoardAway: TReturnMatche[]) {
    this._leaderBoard = leaderBoardHome.map((home: TReturnMatche) => leaderBoardAway
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .reduce((acc: any, away: TReturnMatche) => {
        if (home.name === away.name) {
          acc.name = home.name;
          acc.totalPoints = home.totalPoints + away.totalPoints;
          acc.totalGames = home.totalGames + away.totalGames;
          acc.totalVictories = home.totalVictories + away.totalVictories;
          acc.totalDraws = home.totalDraws + away.totalDraws;
          acc.totalLosses = home.totalLosses + away.totalLosses;
          acc.goalsFavor = home.goalsFavor + away.goalsFavor;
          acc.goalsOwn = home.goalsOwn + away.goalsOwn;
          acc.goalsBalance = acc.goalsFavor - acc.goalsOwn;
          acc.efficiency = Number((((acc.totalVictories * 3 + acc.totalDraws)
            / (acc.totalGames * 3)) * 100).toFixed(2));
        }
        return acc;
      }, {}));
    return this._leaderBoard;
  }

  public async getLeaderBoard() {
    const leaderBoardHome: TReturnMatche[] = await this._leaderBoardHome.getHome();
    const leaderBoardAway: TReturnMatche[] = await this._leaderBoardAway.getAway();
    return this.sortLeaderBoard(this.getTeamsMatches(leaderBoardHome, leaderBoardAway));
  }
}
