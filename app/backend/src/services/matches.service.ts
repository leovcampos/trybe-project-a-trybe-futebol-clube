import Team from '../database/models/Team';
import Match from '../database/models/Match';
import IMatchResponse from '../interfaces/IMatchResponse';
import IMatchCreationRequest from '../interfaces/IMatchCreationRequest';

class MatchesService {
  static async getAll(inProgressQuery: string): Promise<IMatchResponse[]> {
    const matches = await Match.findAll({
      include: [{
        model: Team,
        as: 'teamHome',
        attributes: ['teamName'],
      }, {
        model: Team,
        as: 'teamAway',
        attributes: ['teamName'],
      }],
    });
    if (inProgressQuery === 'false') {
      return matches.filter(({ inProgress }) => !inProgress) as IMatchResponse[];
    }
    if (inProgressQuery === 'true') {
      return matches.filter(({ inProgress }) => inProgress) as IMatchResponse[];
    }
    return matches as IMatchResponse[];
  }

  private static async checkTeams(teams: number[]): Promise<boolean> {
    const promises = teams.map(async (teamId) => Team.findByPk(teamId));
    const results = await Promise.all(promises);
    return results.every((result) => result);
  }

  static async add(creationInfo: IMatchCreationRequest) {
    const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals } = creationInfo;
    const teamsExist = await MatchesService.checkTeams([homeTeam, awayTeam]);
    if (!teamsExist) {
      return { statusCode: 404, message: 'There is no team with such id!' };
    }

    const match = await Match.create({
      homeTeam,
      homeTeamGoals,
      awayTeam,
      awayTeamGoals,
      inProgress: true,
    });

    return { statusCode: null, message: match };
  }

  static async finishGame(id: string): Promise<void> {
    await Match.update({ inProgress: false }, { where: { id } });
  }

  static async updateGame(
    id: string,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ) {
    await Match.update(
      { homeTeamGoals, awayTeamGoals },
      { where: { id } },
    );
    return { statusCode: null, payload: 'Goals updated successfully' };
  }
}

export default MatchesService;
