import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    const slug = createCategoryDto.slug || createCategoryDto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
        slug,
      },
    });
  }

  findAll() {
    return this.prisma.category.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  findAllActive() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id); // verify existence

    if (updateCategoryDto.name && !updateCategoryDto.slug) {
      updateCategoryDto.slug = updateCategoryDto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // verify existence
    return this.prisma.category.delete({
      where: { id },
    });
  }
}

