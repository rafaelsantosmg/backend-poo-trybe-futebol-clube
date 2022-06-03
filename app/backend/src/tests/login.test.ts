import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { describe, it, before, after } from 'mocha';

import { app } from '../app';
import User from '../database/models/users';
import { mockLogin, mockToken } from './mocks/login';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

let chaiHttpResponse: Response;

describe('Testa as rotas de Login', () => {
  describe('Testa a requisição da rota "/login"', () => {
    describe('Testa se a requisição de Login foi sucess', () => {
     before(async () => {
       sinon
         .stub(User, "findOne")
         .resolves( mockLogin as User);
     });
   
     after(()=>{
       (User.findOne as sinon.SinonStub).restore();
     })
   
     it('Testa se login foi feito com sucesso!', async () => {
       chaiHttpResponse = await chai
          .request(app).post('/login')
          .send({ email: 'admin@admin.com', password: 'secret_admin' })
       
   
          expect(chaiHttpResponse.status).to.be.equal(200);
          expect(chaiHttpResponse.body).have.property('user');
          expect(chaiHttpResponse.body).have.property('token');
        });
    });
      
    describe('Testa se a requisição foi feita com dados inválidos', () => {
      before(async () => {
        sinon
        .stub(User, 'findOne')
        .resolves( null );
      });
    
      after(()=>{
        (User.findOne as sinon.SinonStub).restore();
      })
    
      it('Testa se usuario é not found e status é 400', async () => {
        chaiHttpResponse = await chai
        .request(app).post('/login')
        .send({ email: 'an@admin.com', password: 'secret_admin'});
    
        expect(chaiHttpResponse.status).to.be.equal(401);
      });
    
      it('Testa se password é incorrect e status é 400', async () => {
        chaiHttpResponse = await chai
        .request(app).post('/login')
        .send({ email: 'admin@admin.com', password: 'admin'});
        
        expect(chaiHttpResponse.status).to.be.equal(401);
      });
  
      it('Testa se não for passado email o status é 401', async () => {
        chaiHttpResponse = await chai
        .request(app).post('/login')
        .send({ password: 'admin'});
        
        expect(chaiHttpResponse.status).to.be.equal(400);
      });
      
      it('Testa se não for passado password o status é 401', async () => {
        chaiHttpResponse = await chai
        .request(app).post('/login')
        .send({ email: 'admin@admin.com'});
        
        expect(chaiHttpResponse.status).to.be.equal(400);
      });
    })
  });

  describe('Testa a requisição da rota "/login/validate"', () => {
    describe('Testa se a requisição de Login/validate foi sucess', () => {   
     before(async () => {
       sinon
         .stub(User, "findOne")
         .resolves( mockLogin as User);
     });
   
     after(()=>{
       (User.findOne as sinon.SinonStub).restore();
     })
   
     it('Testa se a validação foi feito com sucesso!', async () => {
       chaiHttpResponse = await chai
          .request(app).get('/login/validate').set('authorization', mockToken)
       
          expect(chaiHttpResponse.status).to.be.equal(200);
          expect(chaiHttpResponse.body).to.be.equal('admin');
        });
    });
  });
});







