export type MockModel = {
  findUnique: jest.Mock;
  findFirst: jest.Mock;
  findMany: jest.Mock;
  create: jest.Mock;
  createMany: jest.Mock;
  update: jest.Mock;
  updateMany: jest.Mock;
  upsert: jest.Mock;
  delete: jest.Mock;
  deleteMany: jest.Mock;
  count: jest.Mock;
  aggregate: jest.Mock;
  groupBy: jest.Mock;
  fields: Record<string, any>;
};

export const createMockModel = (): MockModel => ({
  findUnique: jest.fn(),
  findFirst: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  createMany: jest.fn(),
  update: jest.fn(),
  updateMany: jest.fn(),
  upsert: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
  count: jest.fn().mockResolvedValue(0),
  aggregate: jest.fn(),
  groupBy: jest.fn(),
  fields: new Proxy({}, { get: (_, prop) => prop }),
});

export type MockPrismaService = {
  user: MockModel;
  hostProfile: MockModel;
  subscriptionPlan: MockModel;
  hostSubscription: MockModel;
  subscriptionRequest: MockModel;
  raffle: MockModel;
  instantWin: MockModel;
  transaction: MockModel;
  ticket: MockModel;
  winner: MockModel;
  withdrawal: MockModel;
  category: MockModel;
  marketingReport: MockModel;
  auditLog: MockModel;
  $transaction: jest.Mock;
  $connect: jest.Mock;
  $disconnect: jest.Mock;
  $queryRaw: jest.Mock;
  $executeRaw: jest.Mock;
};

export const createMockPrismaService = (): MockPrismaService => {
  const mock: Partial<MockPrismaService> = {
    user: createMockModel(),
    hostProfile: createMockModel(),
    subscriptionPlan: createMockModel(),
    hostSubscription: createMockModel(),
    subscriptionRequest: createMockModel(),
    raffle: createMockModel(),
    instantWin: createMockModel(),
    transaction: createMockModel(),
    ticket: createMockModel(),
    winner: createMockModel(),
    withdrawal: createMockModel(),
    category: createMockModel(),
    marketingReport: createMockModel(),
    auditLog: createMockModel(),
    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),
    $queryRaw: jest.fn(),
    $executeRaw: jest.fn(),
  };

  mock.$transaction = jest.fn((input: any) => {
    if (typeof input === 'function') {
      return input(mock);
    }
    if (Array.isArray(input)) {
      return Promise.all(input);
    }
    return Promise.resolve(input);
  });

  return mock as MockPrismaService;
};
