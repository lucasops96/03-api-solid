import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Search Gyms (e2e)',()=>{
    beforeAll(async ()=>{
        await app.ready()
    })

    afterAll(async ()=>{
        await app.close()
    })
    it('should be able search gyms by title', async ()=>{
        
        const { token } = await createAndAuthenticateUser(app)

        await request(app.server)
            .post('/gyms')
            .set('Authorization',`Bearer ${token}`)
            .send({
                title:'JavaScript Gym',
                description:'Some Description',
                phone:'88000000000',
                latitude:-4.3160809,
                longitude:-40.705786,
            })
        
        await request(app.server)
            .post('/gyms')
            .set('Authorization',`Bearer ${token}`)
            .send({
                title:'TypeScript Gym',
                description:'Some Description',
                phone:'88000000000',
                latitude:-4.3160809,
                longitude:-40.705786,
            })
        
        const response = await request(app.server)
            .get('/gyms/search')
            .query({
                q: 'JavaScript'
            })
            .set('Authorization',`Bearer ${token}`)
            .send()


        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title:'JavaScript Gym'
            }),
        ])
    })
})