import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import User from '../database/models/User';
import usersMock from './mocks/user.mock';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('Tests about login rote', () => {
  /**
   * Exemplo do uso de stubs com tipos
   */

  // let chaiHttpResponse: Response;

  // before(async () => {
  //   sinon
  //     .stub(Example, "findOne")
  //     .resolves({
  //       ...<Seu mock>
  //     } as Example);
  // });

  // after(()=>{
  //   (Example.findOne as sinon.SinonStub).restore();
  // })

  // it('...', async () => {
  //   chaiHttpResponse = await chai
  //      .request(app)
  //      ...

  //   expect(...)
  // });

  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon.stub(User, "findOne")
    .resolves(usersMock.userMock as User)
  });

  afterEach(() => {
    (User.findOne as sinon.SinonStub).restore();
  })
    
  it('Expect token and status 200 when login is valid', async () => {
    const validUser = {
      username: 'user example',
      password: 'secret_admin'
    }

    chaiHttpResponse = await chai
    .request(app)
    .post('/login')
    .send({ ...validUser })

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.haveOwnProperty('token');
  });

  it('Expect status 400 when req without email', async () => {
    const invalidReq = {
      password: 'password'
    }

    chaiHttpResponse = await chai
    .request(app)
    .post('/login')
    .send({ ...invalidReq })

    expect(chaiHttpResponse).to.have.status(400);
    expect(chaiHttpResponse.body).to.haveOwnProperty('message');
    expect(chaiHttpResponse.body.message).to.be.eq('All fields must be filled');
  })

  it('Expect status 400 when req without password', async () => {
    const invalidReq = {
      email: 'email@email.com'
    }

    chaiHttpResponse = await chai
    .request(app)
    .post('/login')
    .send({ ...invalidReq })

    expect(chaiHttpResponse).to.have.status(400);
    expect(chaiHttpResponse.body).to.haveOwnProperty('message');
    expect(chaiHttpResponse.body.message).to.be.eq('All fields must be filled');
  })

  it('Test if user exist', async () => {
    (User.findOne as sinon.SinonStub).restore();
    sinon.stub(User, 'findOne').resolves(null);

    const user = {
      email: 'email@email.com',
      password: 'password'
    }

    chaiHttpResponse = await chai
    .request(app)
    .post('/login')
    .send({ ...user })

    expect(chaiHttpResponse).to.have.status(401);
    expect(chaiHttpResponse.body).to.haveOwnProperty('message');
    expect(chaiHttpResponse.body.message).to.be.eq('Incorrect email or password');
  })

  it('Test invalid token', async () => {
    chaiHttpResponse = await chai
    .request(app)
    .post('/login/validate')

    expect(chaiHttpResponse).to.have.status(401);
    expect(chaiHttpResponse.body).to.haveOwnProperty('message');
    expect(chaiHttpResponse.body.message).to.be.eq('token not provided');
  })

  it('Test invalid password', async () => {
    const user = {
      email: "email@email.com",
      password: "password_incorrect"
    };

    chaiHttpResponse = await chai
    .request(app)
    .post('/login')
    .send({ ...user })

    expect(chaiHttpResponse).to.have.status(401);
    expect(chaiHttpResponse.body).to.haveOwnProperty('message');
    expect(chaiHttpResponse.body.message).to.be.eq('Incorrect email or password');
  })

  it('Test login sucess', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    sinon.stub(User, 'findByPk').resolves({ role: 'admin' } as User);

    chaiHttpResponse = await chai
    .request(app)
    .get('/login/validate')
    .set('authorization', token)

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.haveOwnProperty('role');
    expect(chaiHttpResponse.body.role).to.be.eq('admin');
    
    (User.findByPk as sinon.SinonStub).restore();
  })
});
