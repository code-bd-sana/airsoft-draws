import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { createMockPrismaService, MockPrismaService } from '../src/test-utils/prisma-mock';
import { JwtService } from '@nestjs/jwt';
import { NotificationsService } from '../src/notifications/notifications.service';
import cookieParser from 'cookie-parser';
import { config } from '../src/config';

describe('NotificationsController & Event Dispatch (e2e)', () => {
  let app: INestApplication;
  let mockPrisma: MockPrismaService;
  let jwtService: JwtService;
  let notificationsService: NotificationsService;

  const mockAdminUser = { id: 'admin-user-id', email: 'admin@example.com', role: 'ADMIN' };
  const mockHostUser = { id: 'host-user-id', email: 'host@example.com', role: 'HOST' };
  const mockRegularUser = { id: 'regular-user-id', email: 'user@example.com', role: 'USER' };

  let adminToken: string;
  let hostToken: string;
  let userToken: string;

  beforeAll(async () => {
    mockPrisma = createMockPrismaService();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    notificationsService = moduleFixture.get<NotificationsService>(NotificationsService);

    adminToken = jwtService.sign(
      { sub: mockAdminUser.id, email: mockAdminUser.email, role: mockAdminUser.role },
      { secret: config.security.jwtSecret },
    );
    hostToken = jwtService.sign(
      { sub: mockHostUser.id, email: mockHostUser.email, role: mockHostUser.role },
      { secret: config.security.jwtSecret },
    );
    userToken = jwtService.sign(
      { sub: mockRegularUser.id, email: mockRegularUser.email, role: mockRegularUser.role },
      { secret: config.security.jwtSecret },
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication and Security Checks', () => {
    it('should reject unauthenticated GET /api/v1/notifications with 401', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/notifications')
        .expect(401);
    });

    it('should reject unauthenticated GET /api/v1/notifications/unread-count with 401', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/notifications/unread-count')
        .expect(401);
    });

    it('should reject unauthenticated PATCH /api/v1/notifications/read-all with 401', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/notifications/read-all')
        .expect(401);
    });

    it('should reject unauthenticated PATCH /api/v1/notifications/:id/read with 401', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/notifications/test-id/read')
        .expect(401);
    });

    it('should reject invalid bearer token with 401', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/notifications/unread-count')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('User Context Notifications', () => {
    it('should get unread count via Bearer Authorization header', async () => {
      mockPrisma.notification.count.mockResolvedValue(5);

      const response = await request(app.getHttpServer())
        .get('/api/v1/notifications/unread-count')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toEqual({ count: 5 });
      expect(mockPrisma.notification.count).toHaveBeenCalledWith({
        where: { userId: mockRegularUser.id, isRead: false },
      });
    });

    it('should get unread count via accessToken Cookie', async () => {
      mockPrisma.notification.count.mockResolvedValue(2);

      const response = await request(app.getHttpServer())
        .get('/api/v1/notifications/unread-count')
        .set('Cookie', [`accessToken=${userToken}`])
        .expect(200);

      expect(response.body).toEqual({ count: 2 });
    });

    it('should get paginated notifications with filters for User', async () => {
      const mockNotifications = [
        {
          id: 'notif-user-1',
          userId: mockRegularUser.id,
          type: 'WIN',
          title: 'Instant Win Claimed!',
          message: 'You won a prize: Tactical Vest',
          isRead: false,
          link: '/dashboard/user/winners',
          metadata: { ticketNumber: '101' },
          createdAt: new Date().toISOString(),
        },
      ];

      mockPrisma.notification.count.mockResolvedValue(1);
      mockPrisma.notification.findMany.mockResolvedValue(mockNotifications);

      const response = await request(app.getHttpServer())
        .get('/api/v1/notifications?type=WIN&limit=10&page=1')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toEqual({
        notifications: mockNotifications,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith({
        where: {
          userId: mockRegularUser.id,
          type: 'WIN',
        },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });
    });

    it('should mark single notification as read', async () => {
      const existingNotif = {
        id: 'notif-user-1',
        userId: mockRegularUser.id,
        title: 'Instant Win Claimed!',
        isRead: false,
      };
      const updatedNotif = {
        ...existingNotif,
        isRead: true,
      };
      mockPrisma.notification.findUnique.mockResolvedValue(existingNotif);
      mockPrisma.notification.update.mockResolvedValue(updatedNotif);

      const response = await request(app.getHttpServer())
        .patch('/api/v1/notifications/notif-user-1/read')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toEqual(updatedNotif);
      expect(mockPrisma.notification.update).toHaveBeenCalledWith({
        where: {
          id: 'notif-user-1',
        },
        data: { isRead: true },
      });
    });

    it('should mark all notifications as read for User', async () => {
      mockPrisma.notification.updateMany.mockResolvedValue({ count: 3 });

      const response = await request(app.getHttpServer())
        .patch('/api/v1/notifications/read-all')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toEqual({ count: 3 });
      expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith({
        where: {
          userId: mockRegularUser.id,
          isRead: false,
        },
        data: { isRead: true },
      });
    });
  });

  describe('Host Context Notifications', () => {
    it('should retrieve host unread badge count', async () => {
      mockPrisma.notification.count.mockResolvedValue(12);

      const response = await request(app.getHttpServer())
        .get('/api/v1/notifications/unread-count')
        .set('Authorization', `Bearer ${hostToken}`)
        .expect(200);

      expect(response.body).toEqual({ count: 12 });
      expect(mockPrisma.notification.count).toHaveBeenCalledWith({
        where: { userId: mockHostUser.id, isRead: false },
      });
    });

    it('should retrieve host notifications filtered by category', async () => {
      const hostNotifications = [
        {
          id: 'notif-host-1',
          userId: mockHostUser.id,
          type: 'PAYMENT',
          title: 'Withdrawal Approved',
          message: 'Your withdrawal of £500.00 has been approved.',
          isRead: false,
          link: '/dashboard/host/payouts',
          metadata: { amount: 500 },
          createdAt: new Date().toISOString(),
        },
      ];

      mockPrisma.notification.count.mockResolvedValue(1);
      mockPrisma.notification.findMany.mockResolvedValue(hostNotifications);

      const response = await request(app.getHttpServer())
        .get('/api/v1/notifications?type=PAYMENT')
        .set('Authorization', `Bearer ${hostToken}`)
        .expect(200);

      expect(response.body.notifications).toEqual(hostNotifications);
      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: mockHostUser.id,
            type: 'PAYMENT',
          }),
        }),
      );
    });
  });

  describe('Admin Context Notifications', () => {
    it('should retrieve admin unread badge count', async () => {
      mockPrisma.notification.count.mockResolvedValue(7);

      const response = await request(app.getHttpServer())
        .get('/api/v1/notifications/unread-count')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toEqual({ count: 7 });
      expect(mockPrisma.notification.count).toHaveBeenCalledWith({
        where: { userId: mockAdminUser.id, isRead: false },
      });
    });

    it('should retrieve admin system and approval notifications', async () => {
      const adminNotifications = [
        {
          id: 'notif-admin-1',
          userId: mockAdminUser.id,
          type: 'APPROVAL',
          title: 'New Raffle Pending Approval',
          message: 'Host "Tactical Gear Ltd" submitted a new raffle: Tokyo Marui M4',
          isRead: false,
          link: '/dashboard/admin/approvals',
          metadata: { raffleId: 'r-123' },
          createdAt: new Date().toISOString(),
        },
      ];

      mockPrisma.notification.count.mockResolvedValue(1);
      mockPrisma.notification.findMany.mockResolvedValue(adminNotifications);

      const response = await request(app.getHttpServer())
        .get('/api/v1/notifications?type=APPROVAL')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.notifications).toEqual(adminNotifications);
    });
  });

  describe('NotificationsService Dispatching across Stakeholders', () => {
    it('should create individual notification via createNotification', async () => {
      const createdRecord = {
        id: 'notif-new-1',
        userId: mockRegularUser.id,
        type: 'WIN',
        title: 'You Won!',
        message: 'Congratulations! You won Tokyo Marui M4.',
        link: '/dashboard/user/winners',
        isRead: false,
      };
      mockPrisma.notification.create.mockResolvedValue(createdRecord);

      const result = await notificationsService.createNotification({
        userId: mockRegularUser.id,
        type: 'WIN',
        title: 'You Won!',
        message: 'Congratulations! You won Tokyo Marui M4.',
        link: '/dashboard/user/winners',
      });

      expect(result).toEqual(createdRecord);
      expect(mockPrisma.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: mockRegularUser.id,
          type: 'WIN',
          title: 'You Won!',
        }),
      });
    });

    it('should dispatch notifications to all admins via notifyAdmins', async () => {
      mockPrisma.user.findMany.mockResolvedValue([
        { id: 'admin-1' },
        { id: 'admin-2' },
      ]);
      mockPrisma.notification.createMany.mockResolvedValue({ count: 2 });

      await notificationsService.notifyAdmins({
        type: 'APPROVAL',
        title: 'New Host Registered',
        message: 'Host AirsoftUK has registered and requires verification.',
        link: '/dashboard/admin/hosts',
      });

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        where: { role: 'ADMIN' },
        select: { id: true },
      });
      expect(mockPrisma.notification.createMany).toHaveBeenCalledWith({
        data: [
          expect.objectContaining({ userId: 'admin-1', type: 'APPROVAL', title: 'New Host Registered' }),
          expect.objectContaining({ userId: 'admin-2', type: 'APPROVAL', title: 'New Host Registered' }),
        ],
      });
    });
  });
});
