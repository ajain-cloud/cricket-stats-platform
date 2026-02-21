import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

import { CricketApiService } from '../src/external/services/cricket-api.service';
import { ExternalApiQuotaService } from '../src/common/services/external-api-quota.service';
import { RedisService } from '../src/common/redis/services/redis.service';

describe('Cricket Platform (e2e)', () => {
  let app: INestApplication<App>;

  const cricketMock = {
    searchPlayer: jest.fn(),
    getPlayerDetails: jest.fn(),
  };

  const quotaMock = {
    canCall: jest.fn(async () => true),
    increment: jest.fn(async () => { }),
    getUsage: jest.fn(async () => ({ used: 1, limit: 50 })),
  };

  const redisMock = {
    getClient: jest.fn(() => ({
      get: jest.fn(),
      set: jest.fn(),
      incr: jest.fn(),
      expire: jest.fn(),
      del: jest.fn(),
    }))
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CricketApiService)
      .useValue(cricketMock)
      .overrideProvider(ExternalApiQuotaService)
      .useValue(quotaMock)
      .overrideProvider(RedisService)
      .useValue(redisMock)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });


  // --------------------------------------------------
  // HEALTH
  // --------------------------------------------------

  it('GET /health → should return ok', async () => {

    const res = await request(app.getHttpServer())
      .get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });


  // --------------------------------------------------
  // SEARCH PLAYERS
  // --------------------------------------------------

  it('GET /players/search → returns players', async () => {

    cricketMock.searchPlayer.mockResolvedValueOnce({
      data: [
        { id: '1', name: 'Virat Kohli', country: 'India' }
      ]
    });

    const res = await request(app.getHttpServer())
      .get('/players/search')
      .query({ search: 'Virat', apiKey: 'dummy' });

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(cricketMock.searchPlayer).toHaveBeenCalled();
  });


  // --------------------------------------------------
  // SEARCH — quota exceeded
  // --------------------------------------------------

  it('GET /players/search → should block when quota exceeded', async () => {

    quotaMock.canCall.mockResolvedValue(false);

    const res = await request(app.getHttpServer())
      .get('/players/search')
      .query({ search: 'virat', apikey: 'dummy' });

    expect(res.status).toBe(429);
  });


  // --------------------------------------------------
  // PLAYER DETAILS
  // --------------------------------------------------

  it('GET /players/:id → returns player aggregate', async () => {

    quotaMock.canCall.mockResolvedValue(true);

    cricketMock.getPlayerDetails.mockResolvedValueOnce({
      data: {
        id: '1',
        name: 'Virat Kohli',
        country: 'India',
        role: 'Batsman',
        battingStyle: 'Right',
        bowlingStyle: 'None',
        playerImg: 'img',
        stats: []
      }
    });

    const res = await request(app.getHttpServer())
      .get('/players/1');

    expect(res.status).toBe(200);
    expect(res.body.profile.name).toBe('Virat Kohli');
  });


  // --------------------------------------------------
  // QUOTA STATUS
  // --------------------------------------------------

  it('GET /quota/status → returns usage', async () => {

    const res = await request(app.getHttpServer())
      .get('/quota/status');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ used: 1, limit: 50 });
  });
});
