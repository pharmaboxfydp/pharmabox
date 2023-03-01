import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
let prisma: PrismaClient
prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['info', 'warn', 'error']
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
