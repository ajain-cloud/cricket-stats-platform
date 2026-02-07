import { Test, TestingModule } from '@nestjs/testing';
import { QuotaController } from '../controllers/quota.controller';
import { ExternalApiQuotaService } from '../../common/services/external-api-quota.service';

const quotaServiceMock = {
  getUsage: jest.fn(),
};

describe('QuotaController', () => {
  let quotaController: QuotaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuotaController],
      providers: [
        {
          provide: ExternalApiQuotaService,
          useValue: quotaServiceMock,
        },
      ],
    }).compile();

    quotaController = module.get<QuotaController>(QuotaController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return quota usage', async () => {
    quotaServiceMock.getUsage.mockResolvedValueOnce({
      used: 10,
      limit: 100
    });

    const result = await quotaController.getQuotaStatus();

    expect(quotaServiceMock.getUsage).toHaveBeenCalled();
    expect(result.used).toBe(10);
  });
});
