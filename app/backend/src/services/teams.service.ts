import Team from '../database/models/Team';

class TeamService {
  static async findAll(): Promise<Team[]> {
    const allTeams = await Team.findAll();
    return allTeams;
  }

  static async findById(id: string): Promise<Team | null> {
    const team = await Team.findByPk(id);
    return team;
  }
}

export default TeamService;
