import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { describe, it, before, after } from 'mocha';

import { app } from '../app';
import Matches from '../database/models/matches';
import { mockMatches, mockInProgressTrue, mockInProgressFalse,
  mockCreateMatche } from './mocks/matches';
import { mockToken } from './mocks/login';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

let chaiHttpResponse: Response;

describe('Testa as rotas de Matches', () => {
  describe('Testa a requisição da rota "/Matches"', () => {
    describe('Testa se a requisição de Matches retorna todos os Jogos', () => {
      before(async () => {
        sinon
          .stub(Matches, "findAll")
          .resolves( mockMatches as unknown as Matches[]);
      });
    
      after(()=>{
        (Matches.findAll as sinon.SinonStub).restore();
      })
    
      it('Testa se matches contem todas as proprioedades!', async () => {
        chaiHttpResponse = await chai.request(app).get('/matches')
          mockMatches.forEach((_m, index) => {
            expect(chaiHttpResponse.status).to.be.equal(200);
            expect(chaiHttpResponse.body[index]).have.property('id');
            expect(chaiHttpResponse.body[index]).have.property('homeTeam');
            expect(chaiHttpResponse.body[index]).have.property('homeTeamGoals');
            expect(chaiHttpResponse.body[index]).have.property('awayTeam');
            expect(chaiHttpResponse.body[index]).have.property('awayTeamGoals');
            expect(chaiHttpResponse.body[index]).have.property('inProgress');
            expect(chaiHttpResponse.body[index]).have.property('teamHome');
            expect(chaiHttpResponse.body[index].teamHome).to.not.have.property('id');
            expect(chaiHttpResponse.body[index].teamHome).have.property('teamName');
            expect(chaiHttpResponse.body[index]).have.property('teamAway');
            expect(chaiHttpResponse.body[index].teamAway).to.not.have.property('id');
            expect(chaiHttpResponse.body[index].teamAway).have.property('teamName');
          });
      });
    });

    describe('Testa se a requisição de Matches retorna todos os Jogos Não Terminados', () => {
      before(async () => {
        sinon
          .stub(Matches, "findAll")
          .resolves( mockInProgressFalse as unknown as Matches[]);
      });
    
      after(()=>{
        (Matches.findAll as sinon.SinonStub).restore();
      })
    
      it('Testa se contem todas as partidas não terminadas!', async () => {
        chaiHttpResponse = await chai.request(app).get('/matches?inProgress=false')
          mockMatches.forEach((_m, index) => {
            expect(chaiHttpResponse.body[index]).have.property('inProgress');
            expect(chaiHttpResponse.body[index].inProgress).to.deep.equal(false);
          });
        });
      });
    });

    describe('Testa se a requisição de Matches retorna todos os Jogos Terminados', () => {
      before(async () => {
        sinon
          .stub(Matches, "findAll")
          .resolves( mockInProgressTrue as unknown as Matches[]);
      });
    
      after(()=>{
        (Matches.findAll as sinon.SinonStub).restore();
      })
    
      it('Testa se contem todas as partidas terminadas!', async () => {
        chaiHttpResponse = await chai.request(app).get('/matches?inProgress=true')
          mockMatches.forEach((_m, index) => {
            expect(chaiHttpResponse.body[index]).have.property('inProgress');
            expect(chaiHttpResponse.body[index].inProgress).to.deep.equal(true);
          });
      });
    });

    describe('Testa se cria um matche com sucesso', () => {
      before(async () => {
        sinon
          .stub(Matches, "create")
          .resolves( mockCreateMatche as Matches);
      });
    
      after(()=>{
        (Matches.create as sinon.SinonStub).restore();
      })
    
      it('Testa se matche foi criado corretamente!', async () => {
        chaiHttpResponse = await chai.request(app)
          .post('/matches')
          .set('authorization', mockToken)
          .send({
            "homeTeam": 16,
            "awayTeam": 8,
            "homeTeamGoals": 2,
            "awayTeamGoals": 2,
            "inProgress": true,
        })

          expect(chaiHttpResponse.status).to.be.equal(201);
          expect(chaiHttpResponse.body).to.property('id');
          expect(chaiHttpResponse.body).to.property('homeTeam');
          expect(chaiHttpResponse.body).to.property('awayTeam');
          expect(chaiHttpResponse.body).to.property('homeTeamGoals');
          expect(chaiHttpResponse.body).to.property('awayTeamGoals');
          expect(chaiHttpResponse.body).to.property('inProgress');
      });
    });

    describe('Testa se não cria um matche com sucesso', () => {
      before(async () => {
        sinon
          .stub(Matches, "create")
          .resolves( mockCreateMatche as Matches);
      });
    
      after(()=>{
        (Matches.create as sinon.SinonStub).restore();
      })
    
      it('Testa se deu falaha na cração do match!', async () => {
        chaiHttpResponse = await chai.request(app)
          .post('/matches')
          .set('authorization', mockToken)
          .send({
            "homeTeam": 16,
            "awayTeam": 8,
            "homeTeamGoals": 2,
            "awayTeamGoals": 2,
            "inProgress": false,
        })
        
          expect(chaiHttpResponse.status).to.be.equal(401);
          expect(chaiHttpResponse.body).have.property('message');
      });
    });

    describe('Testa se atualiza um matche com sucesso', () => {
      before(async () => {
        sinon
          .stub(Matches, "update")
          .resolves();
      });
    
      after(()=>{
        (Matches.update as sinon.SinonStub).restore();
      })
    
      it('Testa se foi possivel atualizar um matche!', async () => {
        chaiHttpResponse = await chai.request(app)
          .patch('/matches/1/finish')
        
          expect(chaiHttpResponse.status).to.be.equal(200);
          expect(chaiHttpResponse.body).have.property('message');
          expect(chaiHttpResponse.body.message).to.be.equal('Finished');
      });
    });

    describe('Testa se atualiza um matche com sucesso', () => {
      before(async () => {
        sinon
          .stub(Matches, "update")
          .resolves();
      });
    
      after(()=>{
        (Matches.update as sinon.SinonStub).restore();
      })
    
      it('Testa se foi possivel atualizar um matche!', async () => {
        chaiHttpResponse = await chai.request(app)
          .patch('/matches/1')
        
          expect(chaiHttpResponse.status).to.be.equal(200);
          expect(chaiHttpResponse.body).have.property('message');
          expect(chaiHttpResponse.body.message).to.be.equal('Finished');
      });
    });
});
