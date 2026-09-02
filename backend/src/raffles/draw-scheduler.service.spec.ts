import { Test, TestingModule } from '@nestjs/testing';
import { DrawSchedulerService } from './draw-scheduler.service';
import { PrismaService } from '../prisma/prisma.service';
import { RafflesService } from './raffles.service';
import { createMockPrismaService, MockPrismaService } from '../test-utils/prisma-mock';

describe('DrawSchedulerService', () => {
  let service: DrawSchedulerService;
  let mockPrisma: MockPrismaService;
  let mockRafflesService: { drawWinner: jest.Mock };

  beforeEach(async () => {
    mockPrisma = createMockPrismaService();
    mockRafflesService = {
      drawWinner: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DrawSchedulerService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RafflesService, useValue: mockRafflesService },
      ],
    }).compile();

    service = module.get<DrawSchedulerService>(DrawSchedulerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleAutoDraws', () => {
    it('should trigger drawWinner for auto-draw raffles and close manual-draw raffles', async () => {
      mockPrisma.raffle.findMany
        .mockResolvedValueOnce([
          { id: 'r-auto-1', title: 'Auto Raffle', isAutoDraw: true },
        ])
        .mockResolvedValueOnce([
          { id: 'r-manual-1', title: 'Manual Raffle', isAutoDraw: false },
        ]);
      mockRafflesService.drawWinner.mockResolvedValue({ id: 'w-1' });
      mockPrisma.raffle.update.mockResolvedValue({ id: 'r-manual-1', status: 'ENDED' });

      await service.handleAutoDraws();

      expect(mockRafflesService.drawWinner).toHaveBeenCalledWith('r-auto-1');
      expect(mockPrisma.raffle.update).toHaveBeenCalledWith({
        where: { id: 'r-manual-1' },
        data: { status: 'ENDED' },
      });
    });

    it('should handle errors gracefully without crashing the scheduler loop', async () => {
      mockPrisma.raffle.findMany
        .mockResolvedValueOnce([
          { id: 'r-auto-err', title: 'Failing Raffle', isAutoDraw: true },
        ])
        .mockResolvedValueOnce([
          { id: 'r-manual-err', title: 'Failing Manual Raffle', isAutoDraw: false },
        ]);
      mockRafflesService.drawWinner.mockRejectedValue(new Error('Draw failure'));
      mockPrisma.raffle.update.mockRejectedValue(new Error('Update failure'));

      await expect(service.handleAutoDraws()).resolves.not.toThrow();
    });
  });
});
