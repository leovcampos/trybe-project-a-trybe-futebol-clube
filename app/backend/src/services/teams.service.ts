import Exception from '../middlewares/exception';
import Team from '../database/models/Team';

export default class TeamsService {
  findAll = async () => {
    const result: Team[] = await Team.findAll();

    return { status: 200, message: result };
  };

  findOne = async (id:string) => {
    const result: Team | null = await Team.findOne({ where: {
      id,
    } });

    if (result === null) {
      throw new Exception(404, 'Team not found');
    }

    return { status: 200, message: result };
  };
}
