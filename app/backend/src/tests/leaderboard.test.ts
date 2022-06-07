import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { describe, it, before, after } from 'mocha';

import { app } from '../app';
import Matches from '../database/models/matches';
import Team from '../database/models/teams';

import { Response } from 'superagent';
import { mockMatches } from './mocks/matches';
import { mockTeams } from './mocks/teams';
import { mockLeaderBoard } from './mocks/leaderboard';

chai.use(chaiHttp);

const { expect } = chai;

let chaiHttpResponse: Response;

describe('Testa as rotas de LeaderBoard', () => {
  describe('Testa a requisição da rota "/leaderboard/home"', () => {
    describe('Testa se a requisição de LeaderBoard retorna a classificação dos times da casa', () => {
      before(async () => {
        sinon
          .stub(Matches, "findAll")
          .resolves(mockMatches as unknown as Matches[]);
        sinon
          .stub(Team, 'findAll')
          .resolves(mockTeams as unknown as Team[])
      });
    
      after(()=>{
        (Matches.findAll as sinon.SinonStub).restore();
        (Team.findAll as sinon.SinonStub).restore();
      })
    
      it('Testa se matches contem todas as proprioedades!', async () => {
        chaiHttpResponse = await chai.request(app).get('/leaderboard/home')
          mockLeaderBoard.forEach((_m, index) => {
            expect(chaiHttpResponse.status).to.be.equal(200);
            expect(chaiHttpResponse.body[index]).have.property('name');
            expect(chaiHttpResponse.body[index]).have.property('totalPoints');
            expect(chaiHttpResponse.body[index]).have.property('totalGames');
            expect(chaiHttpResponse.body[index]).have.property('totalVictories');
            expect(chaiHttpResponse.body[index]).have.property('totalDraws');
            expect(chaiHttpResponse.body[index]).have.property('totalLosses');
            expect(chaiHttpResponse.body[index]).have.property('goalsFavor');
            expect(chaiHttpResponse.body[index]).have.property('goalsOwn');
            expect(chaiHttpResponse.body[index]).have.property('goalsBalance');
            expect(chaiHttpResponse.body[index]).have.property('efficiency');
          });
      });
    });
  });
});
