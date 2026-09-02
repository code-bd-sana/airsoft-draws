import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(() => {
    service = new PrismaService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect on module init', async () => {
    const connectSpy = jest
      .spyOn(service, '$connect')
      .mockResolvedValue(undefined as never);

    await service.onModuleInit();
    expect(connectSpy).toHaveBeenCalled();
  });

  it('should handle connection errors gracefully', async () => {
    jest
      .spyOn(service, '$connect')
      .mockRejectedValue(new Error('Connection error') as never);

    await expect(service.onModuleInit()).resolves.not.toThrow();
  });

  it('should disconnect on module destroy', async () => {
    const disconnectSpy = jest
      .spyOn(service, '$disconnect')
      .mockResolvedValue(undefined as never);

    await service.onModuleDestroy();
    expect(disconnectSpy).toHaveBeenCalled();
  });
});
