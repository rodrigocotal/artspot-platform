import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export class PageContentService {
  async getBySlug(slug: string, includeDraft = false) {
    const page = await prisma.pageContent.findUnique({
      where: { slug },
    });

    if (!page) return null;

    if (!includeDraft) {
      const { draftContent, ...publicPage } = page;
      return publicPage;
    }

    return page;
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

  async saveDraft(slug: string, draftContent: Record<string, any>) {
    return prisma.pageContent.upsert({
      where: { slug },
      update: { draftContent, status: 'DRAFT' },
      create: { slug, content: {}, draftContent, status: 'DRAFT' },
    });
  }

  async publishBySlug(slug: string) {
    const page = await prisma.pageContent.findUnique({
      where: { slug },
    });

    if (!page) return null;

    return prisma.pageContent.update({
      where: { slug },
      data: {
        content: (page.draftContent ?? page.content) as Prisma.InputJsonValue,
        draftContent: Prisma.JsonNull,
        status: 'PUBLISHED',
      },
    });
  }
}

export const pageContentService = new PageContentService();
