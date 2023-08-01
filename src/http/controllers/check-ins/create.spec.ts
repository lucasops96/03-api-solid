import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { prisma } from '@/lib/prisma';

describe('Create Check-in (e2e)',()=>{
    beforeAll(async ()=>{
        await app.ready()
    })

    afterAll(async ()=>{
        await app.close()
    })
    it('should be able to create a check-in', async ()=>{
        
        const { token } = await createAndAuthenticateUser(app)

        const gym = await prisma.gym.create({
            data: {
              title: 'JavaScript Gym',
              latitude:-4.3160809,
              longitude:-40.705786,
            },
        })

        const response = await request(app.server)
            .post(`/gyms/${gym.id}/check-ins`)
            .set('Authorization',`Bearer ${token}`)
            .send({
                latitude:-4.3160809,
                longitude:-40.705786,
            })

        expect(response.statusCode).toEqual(201)
    })
})