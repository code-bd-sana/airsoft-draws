import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import type { Request } from 'express';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let mockCategoriesService: {
    findAllActive: jest.Mock;
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    mockCategoriesService = {
      findAllActive: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        { provide: CategoriesService, useValue: mockCategoriesService },
        { provide: JwtService, useValue: { verify: jest.fn() } },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllPublic', () => {
    it('should return active categories', async () => {
      mockCategoriesService.findAllActive.mockResolvedValue([{ id: 'c-1' }]);
      const result = await controller.findAllPublic();
      expect(result).toEqual([{ id: 'c-1' }]);
    });
  });

  describe('CRUD operations', () => {
    it('should create category', async () => {
      mockCategoriesService.create.mockResolvedValue({ id: 'c-1' });
      const result = await controller.create({ name: 'Pistols' });
      expect(result).toEqual({ id: 'c-1' });
    });

    it('should find all categories', async () => {
      mockCategoriesService.findAll.mockResolvedValue([{ id: 'c-1' }]);
      const result = await controller.findAll();
      expect(result).toEqual([{ id: 'c-1' }]);
    });

    it('should find one category', async () => {
      mockCategoriesService.findOne.mockResolvedValue({ id: 'c-1' });
      const result = await controller.findOne('c-1');
      expect(result).toEqual({ id: 'c-1' });
    });

    it('should update category', async () => {
      mockCategoriesService.update.mockResolvedValue({ id: 'c-1' });
      const result = await controller.update('c-1', { name: 'Updated' });
      expect(result).toEqual({ id: 'c-1' });
    });

    it('should delete category', async () => {
      mockCategoriesService.remove.mockResolvedValue({ id: 'c-1' });
      const result = await controller.remove('c-1');
      expect(result).toEqual({ id: 'c-1' });
    });
  });

  describe('uploadCategoryImage', () => {
    it('should throw BadRequestException if file missing', async () => {
      const req = { headers: {}, protocol: 'http' } as Request;
      await expect(
        controller.uploadCategoryImage(req, null as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return image URL when file provided', async () => {
      const req = {
        headers: { host: 'localhost:5000' },
        protocol: 'http',
      } as unknown as Request;
      const file = { filename: 'cat.png' } as Express.Multer.File;

      const result = await controller.uploadCategoryImage(req, file);
      expect(result.url).toContain('/uploads/categories/cat.png');
    });
  });
});
