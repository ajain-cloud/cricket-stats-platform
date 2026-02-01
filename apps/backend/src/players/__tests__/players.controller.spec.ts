import { Test, TestingModule } from '@nestjs/testing';
import { PlayersController } from '../controllers/players.controller';
import { PlayersService } from '../services/players.service';

describe('PlayersController', () => {
  let playersController: PlayersController;
  let playersService: PlayersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayersController],
      providers: [
        {
          provide: PlayersService,
          useValue: {
            searchPlayers: jest.fn().mockResolvedValue([]),
            getPlayerAggregate: jest.fn().mockResolvedValue({
              profile: {},
              stats: {},
            }),
          },
        },
      ],
    }).compile();

    playersController = module.get<PlayersController>(PlayersController);
    playersService = module.get<PlayersService>(PlayersService);
  });

  it('should call service with search query', async () => {
    await playersController.searchPlayers('virat');

    expect(playersService.searchPlayers).toHaveBeenCalledWith('virat');
  });

  it('should call service with player id', async () => {
    await playersController.getPlayerDetails('123');

    expect(playersService.getPlayerAggregate).toHaveBeenCalledWith('123');
  });
});
