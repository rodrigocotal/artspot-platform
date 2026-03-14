import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import type { ListArticlesQuery } from '../validators/article.validator';

export class ArticleService {
  async list(query: ListArticlesQuery) {
    const { page, limit, category, search, featured, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ArticleWhereInput = {};
    if (category) where.category = category;
    if (featured !== undefined) where.featured = featured;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.article.count({ where }),
    ]);

    return {
      data: articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getFeatured(limit = 6) {
    return prisma.article.findMany({
      where: { featured: true },
      orderBy: { publishedDate: 'desc' },
      take: limit,
    });
  }

  async getBySlug(slug: string) {
    return prisma.article.findUnique({ where: { slug } });
  }

  async getById(id: string) {
    return prisma.article.findUnique({ where: { id } });
  }

  async create(data: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    coverImageUrl?: string;
    author?: string;
    category?: 'ARTIST_SPOTLIGHT' | 'EXHIBITION' | 'BEHIND_THE_SCENES' | 'NEWS' | 'GUIDE';
    publishedDate?: string;
    featured?: boolean;
  }) {
    return prisma.article.create({
      data: {
        ...data,
        publishedDate: data.publishedDate ? new Date(data.publishedDate) : null,
        coverImageUrl: data.coverImageUrl || null,
      },
    });
  }

  async update(id: string, data: {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    coverImageUrl?: string;
    author?: string;
    category?: 'ARTIST_SPOTLIGHT' | 'EXHIBITION' | 'BEHIND_THE_SCENES' | 'NEWS' | 'GUIDE';
    publishedDate?: string;
    featured?: boolean;
  }) {
    const updateData: any = { ...data };
    if (data.publishedDate !== undefined) {
      updateData.publishedDate = data.publishedDate ? new Date(data.publishedDate) : null;
    }
    if (data.coverImageUrl !== undefined) {
      updateData.coverImageUrl = data.coverImageUrl || null;
    }
    return prisma.article.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    return prisma.article.delete({ where: { id } });
  }
}

export const articleService = new ArticleService();
