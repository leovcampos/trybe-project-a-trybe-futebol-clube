import * as chai from 'chai';
import * as sinon from 'sinon';
import { Response } from 'superagent';
import App from '../app';
import Match from '../database/models/Match';
import User from '../database/models/User';
import matches,
{ matchesFinish, matchesInProgress, newMatch } from './mocks/matches.mock';
// @ts-ignore
import chaiHttp = require('chai-http');
import userMock from './mocks/user.mock';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('Matches tests', () => {
	let chaiHttpResponse: Response;

	afterEach(sinon.restore)

	it('GET for /matches', async () => {
		sinon.stub(Match, 'findAll').resolves(matches as unknown as Match[]);

		chaiHttpResponse = await chai
			.request(app)
			.get('/matches');

		expect(chaiHttpResponse.status).to.be.equal(200);
		expect(chaiHttpResponse.body).to.be.deep.equal(matches)
	})

	it('GET for /matches?inProgress=true', async () => {
		sinon.stub(Match, 'findAll').resolves(matchesInProgress as unknown as Match[]);

		chaiHttpResponse = await chai
			.request(app)
			.get('/matches?inProgress=true');

		expect(chaiHttpResponse.status).to.be.equal(200);
		expect(chaiHttpResponse.body).to.be.deep.equal(matchesInProgress)
	})

	it('GET for /matches?inProgress=false', async () => {
		sinon.stub(Match, 'findAll').resolves(matchesFinish as unknown as Match[]);

		chaiHttpResponse = await chai
			.request(app)
			.get('/matches?inProgress=false');

		expect(chaiHttpResponse.status).to.be.equal(200);
		expect(chaiHttpResponse.body).to.be.deep.equal(matchesFinish)
	})

	it('POST for /matches', async () => {
		sinon.stub(User, 'findOne').resolves(userMock.users[0] as User);
		sinon.stub(Match, 'create').resolves(newMatch as unknown as Match)

		chaiHttpResponse = await chai
			.request(app)
			.post('/login')
			.send({ email: 'admin@admin.com', password: 'secret_admin' });

		const match = await chai
			.request(app)
			.post('/matches')
			.set('Authorization', chaiHttpResponse.body.token)
			.send({
				homeTeam: 16,
				awayTeam: 8,
				homeTeamGoals: 2,
				awayTeamGoals: 2,
			});

		expect(match.status).to.be.equal(201);
		expect(match.body).to.be.deep.equal(newMatch);
	})

	it('POST for /matches with equal teams', async () => {
    sinon.stub(User, "findOne").resolves(userMock.users[0] as User)
    sinon.stub(Match, "create").resolves(matches[0] as unknown as Match);
    
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ email: 'admin@admin.com', password: 'secret_admin' });

    const match = await chai
      .request(app)
      .post('/matches')
      .set('Authorization', chaiHttpResponse.body.token)
      .send({
        homeTeam: 8,
        awayTeam: 8,
        homeTeamGoals: 2,
        awayTeamGoals: 2,
      });

    expect(match.status).to.be.equal(422);
    expect(match.body).to.be.deep.equal({ message: "It is not possible to create a match with two equal teams" })
  });

	it('POST for matches with undefined team', async () => {
    sinon.stub(User, "findOne").resolves(userMock.users[0] as User)
    sinon.stub(Match, "findOne").resolves(null);
    
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ email: 'admin@admin.com', password: 'secret_admin' });

    const match = await chai
      .request(app)
      .post('/matches')
      .set('Authorization', chaiHttpResponse.body.token)
      .send({
        homeTeam: 123456789,
        awayTeam: 8,
        homeTeamGoals: 2,
        awayTeamGoals: 2,
      });

    expect(match.status).to.be.equal(404);
    expect(match.body).to.be.deep.equal({ message: "There is no team with such id!" })
  });

	it('validate token for POST /matches', async () => {
    const match = await chai
      .request(app)
      .post('/matches')
      .send({
        homeTeam: 16,
        awayTeam: 8,
        homeTeamGoals: 2,
        awayTeamGoals: 2,
      });

    expect(match.status).to.be.equal(401);
    expect(match.body).to.be.deep.equal({ message: "Token must be a valid token" })
  });

	it('PATCH for /matches/49/finish', async () => {
    sinon.stub(Match, "update").resolves([1]);

    const match = await chai
      .request(app)
      .patch('/matches/49/finish')
      .send({
        homeTeamGoals: 1,
        awayTeamGoals: 0,
      });

    expect(match.status).to.be.equal(200);
    expect(match.body).to.be.deep.equal({ message: "Finished" })
  });

	it('PATCH for /matches/49/finish', async () => {
    sinon.stub(Match, "update").resolves([1]);

    const match = await chai
      .request(app)
      .patch('/matches/49')
      .send({
        homeTeamGoals: 1,
        awayTeamGoals: 0,
      });

    expect(match.status).to.be.equal(200);
    expect(match.body).to.be.deep.equal({ message: "Updated" })
  });
});
