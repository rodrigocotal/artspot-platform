import { prisma } from '../config/database';

export class PageContentService {
  async getBySlug(slug: string) {
    return prisma.pageContent.findUnique({
      where: { slug },
    });
  }

  async listAll() {
    return prisma.pageContent.findMany({
      orderBy: { slug: 'asc' },
    });
  }

  async upsertBySlug(slug: string, content: Record<string, any>) {
    return prisma.pageContent.upsert({
      where: { slug },
      update: { content },
      create: { slug, content },
    });
  }
}

export const pageContentService = new PageContentService();
