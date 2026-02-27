import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@artspot.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin123!';
  const name = process.env.ADMIN_NAME || 'Admin';

  console.log(`Seeding admin user: ${email}`);

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: 'ADMIN',
      name,
    },
    create: {
      email,
      passwordHash,
      role: 'ADMIN',
      name,
      emailVerified: true,
    },
  });

  console.log(`Admin user ready: ${user.id} (${user.email})`);
}

seedAdmin()
  .catch((e) => {
    console.error('Error seeding admin:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
