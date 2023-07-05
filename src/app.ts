import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

export const app = fastify()

const prisma = new PrismaClient()

prisma.user.create({
    data:{
        name:'João Lucas de Sousa Martins',
        email:'lucasbanana96@gmail.com'
    }
})