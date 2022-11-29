import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import teamsMocks from './mocks/teams.mock';

import { Response } from 'superagent';
import Team from '../database/models/Team';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('Tests team route', () => {
    let chaiHttpResponse: Response;

    it('Teams GET test', async () => {
        sinon.stub(Team, 'findAll').resolves(teamsMocks.allTeams as Team[]);

        chaiHttpResponse = await chai
            .request(app)
            .get('/teams')

        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body).to.be.an('array');
        expect(chaiHttpResponse.body).to.be.deep.equal(teamsMocks.allTeams);

        (Team.findAll as sinon.SinonStub).restore();
    })

    it('Teams GET by ID test', async () => {
        sinon.stub(Team, 'findByPk').resolves(teamsMocks.oneTeam as Team);

        chaiHttpResponse = await chai
            .request(app)
            .get('/teams/1')

        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body).to.be.an('object');
        expect(chaiHttpResponse.body).to.be.deep.equal(teamsMocks.oneTeam);
        
        (Team.findByPk as sinon.SinonStub).restore();
    })

    it('Teams GET by ID test if there isnt id', async () => {
        sinon.stub(Team, 'findByPk').resolves(null);

        chaiHttpResponse = await chai
            .request(app)
            .get('/teams/00000')

        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body).to.be.null;
        
        (Team.findByPk as sinon.SinonStub).restore();
    })
})
