import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    try {
        return new PrismaClient()
    } catch (error) {
        console.error('FAILED_TO_INITIALIZE_PRISMA:', error)
        // Return a proxy or just let it be handled later. 
        // Most Next.js envs will crash later if DB is needed, but this prevents import-time fatal crash.
        return new PrismaClient() 
    }
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
