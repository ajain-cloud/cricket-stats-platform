import { Test, TestingModule } from '@nestjs/testing';
import { PlayersService } from '../services/players.service';
import { CricketApiService } from '../../external/services/cricket-api.service';
import { CacheService } from '../../cache/services/cache.service';
import { ExternalApiQuotaService } from '../../common/services/external-api-quota.service';

const cricketApiServiceMock = {
  searchPlayer: jest.fn(),
  getPlayerDetails: jest.fn(),
};

const cacheServiceMock = {
  get: jest.fn(),
  set: jest.fn(),
};

const quotaServiceMock = {
  canCall: jest.fn(),
  increment: jest.fn(),
  getUsage: jest.fn(),
};

describe('PlayersService', () => {
  let playersService: PlayersService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        {
          provide: CricketApiService,
          useValue: cricketApiServiceMock,
        },
        {
          provide: CacheService,
          useValue: cacheServiceMock,
        },
        {
          provide: ExternalApiQuotaService,
          useValue: quotaServiceMock,
        },
      ]
    }).compile();

    playersService = module.get<PlayersService>(PlayersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch players from external API', async () => {
    quotaServiceMock.canCall.mockReturnValue(true);

    cricketApiServiceMock.searchPlayer.mockResolvedValueOnce({
      data: [
        {
          id: '1',
          name: 'Virat Kohli',
          country: 'India'
        },
      ],
    } as any);

    const result = await playersService.searchPlayers('virat');

    expect(result).toHaveLength(1);
    expect(cricketApiServiceMock.searchPlayer).toHaveBeenCalledWith('virat');
    expect(quotaServiceMock.increment).toHaveBeenCalled();
  });

  it('should return cached players without calling external API', async () => {
    const cachedPlayers = [
      {
        id: '1',
        name: 'Virat Kohli',
        country: 'India'
      },
    ];

    cacheServiceMock.get.mockReturnValueOnce(cachedPlayers);

    const result = await playersService.searchPlayers('virat');

    expect(result).toEqual(cachedPlayers);
    expect(cricketApiServiceMock.searchPlayer).not.toHaveBeenCalled();
  });

  it('should return empty array when API returns no data', async () => {
    quotaServiceMock.canCall.mockReturnValue(true);

    cricketApiServiceMock.searchPlayer.mockResolvedValueOnce({
      data: [],
    });

    const result = await playersService.searchPlayers('unknown');

    expect(result).toEqual([]);
  });

  it('should throw 429 when daily quota is exceeded', async () => {
    quotaServiceMock.canCall.mockReturnValue(false);
    quotaServiceMock.getUsage.mockReturnValue({ used: 100, limit: 100 });

    await expect(
      playersService.searchPlayers('virat'),
    ).rejects.toMatchObject({
      status: 429,
    });

    expect(cricketApiServiceMock.searchPlayer).not.toHaveBeenCalled();
  });

  it('should return aggregated player data from cache without calling external API', async () => {
    const cachedRawPlayer = {
      id: '123',
      name: 'Virat Kohli',
      country: 'India',
      role: 'Batsman',
      battingStyle: 'Right Handed Bat',
      bowlingStyle: 'Right-arm medium',
      playerImg: 'img.png',
      stats: [],
    };

    cacheServiceMock.get.mockReturnValueOnce(cachedRawPlayer);

    const result = await playersService.getPlayerAggregate('123');

    expect(result.profile.name).toBe('Virat Kohli');
    expect(result.stats).toBeDefined();
    expect(cricketApiServiceMock.getPlayerDetails).not.toHaveBeenCalled();
    expect(quotaServiceMock.increment).not.toHaveBeenCalled();
  });

  it('should throw 429 when daily quota is exceeded for player details', async () => {
    cacheServiceMock.get.mockReturnValueOnce(null);
    quotaServiceMock.canCall.mockReturnValue(false);
    quotaServiceMock.getUsage.mockReturnValue({ used: 100, limit: 100 });

    await expect(
      playersService.getPlayerAggregate('123'),
    ).rejects.toMatchObject({
      status: 429,
    });

    expect(cricketApiServiceMock.getPlayerDetails).not.toHaveBeenCalled();
  });

  it('should fetch player details from API, increment quota, cache data, and return aggregate', async () => {
    const apiRawPlayer = {
      id: '123',
      name: 'Virat Kohli',
      country: 'India',
      role: 'Batsman',
      battingStyle: 'Right Handed Bat',
      bowlingStyle: 'Right-arm medium',
      playerImg: 'img.png',
      stats: [
        {
          fn: 'batting',
          matchtype: 'odi',
          stat: 'runs',
          value: '12898',
        },
      ],
    };

    cacheServiceMock.get.mockReturnValueOnce(null);
    quotaServiceMock.canCall.mockReturnValue(true);

    cricketApiServiceMock.getPlayerDetails.mockResolvedValueOnce({
      data: apiRawPlayer,
    });

    const result = await playersService.getPlayerAggregate('123');

    expect(result.profile.name).toBe('Virat Kohli');
    expect(result.stats.batting).toBeDefined();
    expect(cricketApiServiceMock.getPlayerDetails).toHaveBeenCalledWith('123');
    expect(quotaServiceMock.increment).toHaveBeenCalled();
    expect(cacheServiceMock.set).toHaveBeenCalled();
  });

  it('should return empty stats object when stats array is missing', async () => {
    const apiRawPlayer = {
      id: '123',
      name: 'Player',
      country: 'India',
      stats: undefined,
    };

    cacheServiceMock.get.mockReturnValueOnce(null);
    quotaServiceMock.canCall.mockReturnValue(true);

    cricketApiServiceMock.getPlayerDetails.mockResolvedValueOnce({
      data: apiRawPlayer,
    });

    const result = await playersService.getPlayerAggregate('123');

    expect(result.stats).toBeDefined();
  });
});
