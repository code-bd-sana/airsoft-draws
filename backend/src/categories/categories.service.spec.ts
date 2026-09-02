import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { createMockPrismaService, MockPrismaService } from '../test-utils/prisma-mock';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let mockPrisma: MockPrismaService;

  beforeEach(async () => {
    mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should generate slug from name if not provided', async () => {
      mockPrisma.category.create.mockResolvedValue({
        id: 'c-1',
        name: 'AEG Rifles',
        slug: 'aeg-rifles',
      });

      const result = await service.create({ name: 'AEG Rifles' });
      expect(result.slug).toBe('aeg-rifles');
      expect(mockPrisma.category.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ slug: 'aeg-rifles' }),
      });
    });
  });

  describe('findAll and findAllActive', () => {
    it('should return all categories', async () => {
      mockPrisma.category.findMany.mockResolvedValue([{ id: 'c-1' }]);
      const result = await service.findAll();
      expect(result).toHaveLength(1);
    });

    it('should return only active categories', async () => {
      mockPrisma.category.findMany.mockResolvedValue([{ id: 'c-1', isActive: true }]);
      const result = await service.findAllActive();
      expect(result).toHaveLength(1);
      expect(mockPrisma.category.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { createdAt: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if category does not exist', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(null);
      await expect(service.findOne('c-unknown')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return category when found', async () => {
      mockPrisma.category.findUnique.mockResolvedValue({ id: 'c-1', name: 'Snipers' });
      const result = await service.findOne('c-1');
      expect(result.name).toBe('Snipers');
    });
  });

  describe('update', () => {
    it('should update category and update slug if name changed', async () => {
      mockPrisma.category.findUnique.mockResolvedValue({ id: 'c-1', name: 'Old' });
      mockPrisma.category.update.mockResolvedValue({
        id: 'c-1',
        name: 'Gas Blowback',
        slug: 'gas-blowback',
      });

      const result = await service.update('c-1', { name: 'Gas Blowback' });
      expect(result.slug).toBe('gas-blowback');
    });
  });

  describe('remove', () => {
    it('should delete category if found', async () => {
      mockPrisma.category.findUnique.mockResolvedValue({ id: 'c-1' });
      mockPrisma.category.delete.mockResolvedValue({ id: 'c-1' });

      const result = await service.remove('c-1');
      expect(result.id).toBe('c-1');
    });
  });
});
