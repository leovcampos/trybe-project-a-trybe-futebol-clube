import * as chai from 'chai';
import * as sinon from 'sinon';
import { Response } from 'superagent';
import App from '../app';
import Match from '../database/models/Match';
import User from '../database/models/User';
import usersMock from './mocks/user.mock';
import matches,
{ matchesFinish, matchesInProgress, newMatch } from './mocks/matches.mock';
// @ts-ignore
import chaiHttp = require('chai-http');

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
});
