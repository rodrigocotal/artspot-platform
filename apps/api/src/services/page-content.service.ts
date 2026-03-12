import { prisma } from '../config/database';

export class PageContentService {
  async getBySlug(slug: string) {
    return prisma.pageContent.findUnique({
      where: { slug },
    });
  }
}

export const pageContentService = new PageContentService();
