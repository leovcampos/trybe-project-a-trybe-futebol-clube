import Match from "src/database/models/Match";
import Team from "src/database/models/Team";

import IMatchResponse from "src/interfaces/IMatchResponse";
import IGameInfos from "src/interfaces/IGameInfos";
import ILeaderBoardResponse from "src/interfaces/ILeaderBoardResponse";

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
}

export default LeaderBoardService;
