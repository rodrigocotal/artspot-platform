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
}

export const articleService = new ArticleService();
