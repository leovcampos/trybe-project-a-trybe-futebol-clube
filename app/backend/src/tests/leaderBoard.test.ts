import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import matches,
{ matchesFinish, matchesInProgress, newMatch } from './mocks/matches.mock';
import leaderboardsMocks from './mocks/leaderBoard.mock';
import { Response } from 'superagent';
import Match from '../database/models/Match';
import IMatchResponse from '../interfaces/IMatchResponse';

const { app } = new App();

chai.use(chaiHttp);

const { expect } = chai;

describe('Tests about route /leaderboard', () => {
  let chaiHttpResponse: Response;

  beforeEach(() => {
    sinon.stub(Match, 'findAll').resolves(matches as IMatchResponse[]);
  });

  afterEach(() => {
    (Match.findAll as sinon.SinonStub).restore();
  });

  it('Test if return order table when route GET', async () => {
    chaiHttpResponse = await chai 
      .request(app)
      .get('/leaderboard');

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.be.an('array');
    expect(chaiHttpResponse.body).to.deep.equal(leaderboardsMocks.leaderboard);
  });

  it('GET in route /leaderboard/home', async () => {
    chaiHttpResponse = await chai 
      .request(app)
      .get('/leaderboard/home');

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.be.an('array');
    expect(chaiHttpResponse.body).to.deep.equal(leaderboardsMocks.homeLeaderBoard);
  });

  it('GET in route /leaderboard/away', async () => {
    chaiHttpResponse = await chai 
      .request(app)
      .get('/leaderboard/away');

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.be.an('array');
    expect(chaiHttpResponse.body).to.deep.equal(leaderboardsMocks.awayLeaderBoard);
  });
});
