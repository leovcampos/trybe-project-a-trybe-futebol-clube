import Match from '../database/models/Match';
import Team from '../database/models/Team';

import IMatchResponse from '../interfaces/IMatchResponse';
import IGameInfos from '../interfaces/IGameInfos';
import ILeaderBoardResponse from '../interfaces/ILeaderBoardResponse';

class LeaderBoardService {
  static async getMatches(): Promise<Match[]> {
    return Match.findAll(
      { where: { inProgress: false },
        include: [{
          model: Team,
          as: 'teamHome',
          attributes: ['teamName'],
        }, {
          model: Team,
          as: 'teamAway',
          attributes: ['teamName'],
        }],
      },
    );
  }

  private static orderLeaderboard(unorderedList: ILeaderBoardResponse[]): ILeaderBoardResponse[] {
    const orderList = unorderedList;
    orderList.sort((a: ILeaderBoardResponse, b: ILeaderBoardResponse) => (
      b.totalPoints - a.totalPoints
      || b.totalVictories - a.totalVictories
      || b.goalsBalance - a.goalsBalance
      || b.goalsFavor - a.goalsFavor
      || a.goalsOwn - b.goalsOwn
    ));

    return orderList;
  }

  private static teamIndex(list: ILeaderBoardResponse[], teamName: string): number {
    return list.findIndex(({ name }) => name === teamName);
  }

  private static getGameResult(teamGoals: number, otherTeamGoals: number) {
    const gameResult = {
      points: 1,
      victory: 0,
      draw: 1,
      loss: 0,
    };
    if (teamGoals > otherTeamGoals) {
      gameResult.points = 3;
      gameResult.victory = 1;
      gameResult.draw = 0;
    }
    if (otherTeamGoals > teamGoals) {
      gameResult.points = 0;
      gameResult.loss = 1;
      gameResult.draw = 0;
    }
    return gameResult;
  }

  private static getGameInfo(teamGoals: number, otherTeamGoals: number): IGameInfos<number> {
    const gameResult = this.getGameResult(teamGoals, otherTeamGoals);
    const gameInfo = {
      points: gameResult.points,
      victory: gameResult.victory,
      draw: gameResult.draw,
      loss: gameResult.loss,
      goalsFavor: teamGoals,
      goalsOwn: otherTeamGoals,
      goalsBalance: teamGoals - otherTeamGoals,
    };
    return gameInfo;
  }

  private static newRecord(
    teamName: string,
    teamGameInfo: IGameInfos<number>,
  ): ILeaderBoardResponse {
    return {
      name: teamName,
      totalPoints: teamGameInfo.points,
      totalGames: 1,
      totalVictories: teamGameInfo.victory,
      totalDraws: teamGameInfo.draw,
      totalLosses: teamGameInfo.loss,
      goalsFavor: teamGameInfo.goalsFavor,
      goalsOwn: teamGameInfo.goalsOwn,
      goalsBalance: teamGameInfo.goalsBalance,
      efficiency: ((teamGameInfo.points / (1 * 3)) * 100).toFixed(2),
    };
  }

  private static updateRecord(
    teamRecord: ILeaderBoardResponse,
    teamGameInfo: IGameInfos<number>,
  ): ILeaderBoardResponse {
    const sumGames = teamRecord.totalGames + 1;
    const sumPoints = teamRecord.totalPoints + teamGameInfo.points;
    return {
      name: teamRecord.name,
      totalPoints: sumPoints,
      totalGames: sumGames,
      totalVictories: teamRecord.totalVictories + teamGameInfo.victory,
      totalDraws: teamRecord.totalDraws + teamGameInfo.draw,
      totalLosses: teamRecord.totalLosses + teamGameInfo.loss,
      goalsFavor: teamRecord.goalsFavor + teamGameInfo.goalsFavor,
      goalsOwn: teamRecord.goalsOwn + teamGameInfo.goalsOwn,
      goalsBalance: teamRecord.goalsBalance + teamGameInfo.goalsBalance,
      efficiency: ((sumPoints / (sumGames * 3)) * 100).toFixed(2),
    };
  }

  private static transformMatchesInfo(matchesList: IMatchResponse[]): ILeaderBoardResponse[] {
    const matches: ILeaderBoardResponse[] = [];
    matchesList.forEach(({ homeTeamGoals, awayTeamGoals, teamHome, teamAway }) => {
      const homeTeamIdx = this.teamIndex(matches, teamHome.teamName);
      const homeTeamGameInfo = this.getGameInfo(homeTeamGoals, awayTeamGoals);
      const awayTeamIdx = this.teamIndex(matches, teamAway.teamName);
      const awayTeamGameInfo = this.getGameInfo(awayTeamGoals, homeTeamGoals);

      if (homeTeamIdx < 0) {
        matches.push(this.newRecord(teamHome.teamName, homeTeamGameInfo));
      } else {
        matches[homeTeamIdx] = this.updateRecord(matches[homeTeamIdx], homeTeamGameInfo);
      }
      if (awayTeamIdx < 0) {
        matches.push(this.newRecord(teamAway.teamName, awayTeamGameInfo));
      } else {
        matches[awayTeamIdx] = this.updateRecord(matches[awayTeamIdx], awayTeamGameInfo);
      }
    });
    return matches;
  }

  private static transformHomeMatchesInfo(matchesList: IMatchResponse[]): ILeaderBoardResponse[] {
    const matches: ILeaderBoardResponse[] = [];
    matchesList.forEach(({ homeTeamGoals, awayTeamGoals, teamHome }) => {
      const homeTeamId = this.teamIndex(matches, teamHome.teamName);
      const teamGameInfos = this.getGameInfo(homeTeamGoals, awayTeamGoals);

      if (homeTeamId < 0) {
        matches.push(this.newRecord(teamHome.teamName, teamGameInfos));
      } else {
        matches[homeTeamId] = this.updateRecord(matches[homeTeamId], teamGameInfos);
      }
    });

    return matches;
  }

  private static transformAwayMatchesInfo(matchesList: IMatchResponse[]): ILeaderBoardResponse[] {
    const table: ILeaderBoardResponse[] = [];
    matchesList.forEach(({ homeTeamGoals, awayTeamGoals, teamAway }) => {
      const awayTeamIdx = this.teamIndex(table, teamAway.teamName);
      const awayTeamGameInfo = this.getGameInfo(awayTeamGoals, homeTeamGoals);

      if (awayTeamIdx < 0) {
        table.push(this.newRecord(teamAway.teamName, awayTeamGameInfo));
      } else {
        table[awayTeamIdx] = this.updateRecord(table[awayTeamIdx], awayTeamGameInfo);
      }
    });
    return table;
  }

  static async get(): Promise<ILeaderBoardResponse[]> {
    const matches = await this.getMatches() as IMatchResponse[];
    const unorderedLeaderboard = this.transformMatchesInfo(matches);
    return this.orderLeaderboard(unorderedLeaderboard);
  }

  static async getHome(): Promise<ILeaderBoardResponse[]> {
    const matches = await this.getMatches() as IMatchResponse[];
    const unorderedLeaderboard = this.transformHomeMatchesInfo(matches);
    return this.orderLeaderboard(unorderedLeaderboard);
  }

  static async getAway(): Promise<ILeaderBoardResponse[]> {
    const matches = await this.getMatches() as IMatchResponse[];
    const unorderedLeaderboard = this.transformAwayMatchesInfo(matches);
    return this.orderLeaderboard(unorderedLeaderboard);
  }
}

export default LeaderBoardService;
