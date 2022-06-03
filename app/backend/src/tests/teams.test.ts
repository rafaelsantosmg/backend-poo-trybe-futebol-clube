import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { describe, it, before, after } from 'mocha';

import { app } from '../app';
import Team from '../database/models/teams';
import { mockTeams, mockTeam } from './mocks/teams';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

let chaiHttpResponse: Response;

describe('Testa as rotas de Teams', () => {
  describe('Testa a requisição da rota "/Teams"', () => {
    describe('Testa se a requisição de Teams retorna todos os times', () => {
      before(async () => {
        sinon
          .stub(Team, "findAll")
          .resolves( mockTeams as Team[]);
      });
    
      after(()=>{
        (Team.findAll as sinon.SinonStub).restore();
      })
    
      it('Testa se Team contem todas as proprioedades!', async () => {
        chaiHttpResponse = await chai.request(app).get('/teams')
          mockTeams.forEach((_t, index) => {
            expect(chaiHttpResponse.status).to.be.equal(200);
            expect(chaiHttpResponse.body[index]).have.property('id');
            expect(chaiHttpResponse.body[index]).have.property('teamName');
          });
        });
    });
  });
describe('Testa a requisição da rota "/Teams/id"', () => {
  describe('Testa se a requisição de Teams retorna todos os times', () => {
    before(async () => {
      sinon
        .stub(Team, "findOne")
        .resolves( mockTeam as Team);
    });
  
    after(()=>{
      (Team.findOne as sinon.SinonStub).restore();
    })
  
    it('Testa se Team contem todas as proprioedades!', async () => {
      chaiHttpResponse = await chai.request(app).get('/teams/1')
        expect(chaiHttpResponse.status).to.be.equal(200);
        expect(chaiHttpResponse.body).have.property('id');
        expect(chaiHttpResponse.body).have.property('teamName');
      });
    });
  });
});
