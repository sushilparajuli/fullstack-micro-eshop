// https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
import { PrismaClient } from '../generated/client';

// declare global {
//   // eslint-disable-next-line @typescript-eslint/no-namespace
//   namespace globalThis {
//     // eslint-disable-next-line no-var
//     var prismadb: PrismaClient;
//   }
// }

// const prisma: PrismaClient = new PrismaClient();

// if (process.env.NODE_ENV === 'production') global.prismadb = prisma;

// export default prisma;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
