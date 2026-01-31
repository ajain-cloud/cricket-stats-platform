import { Test, TestingModule } from '@nestjs/testing';
import { PlayersService } from '../services/players.service';
import { CricketApiService } from '../../external/services/cricket-api.service';
import { CacheService } from '../../cache/services/cache.service';

const cricketApiServiceMock = {
  searchPlayer: jest.fn(),
};

const cacheServiceMock = {
  get: jest.fn(),
  set: jest.fn(),
};

describe('PlayersService', () => {
  let playersService: PlayersService;

  beforeEach(async () => {
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
      ]
    }).compile();

    playersService = module.get<PlayersService>(PlayersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch players from external API', async () => {
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
    cricketApiServiceMock.searchPlayer.mockResolvedValueOnce({
      data: [],
    });

    const result = await playersService.searchPlayers('unknown');

    expect(result).toEqual([]);
  });
});
