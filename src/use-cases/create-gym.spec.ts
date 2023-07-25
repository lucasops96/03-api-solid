import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'


let gymsRepository:  InMemoryGymsRepository
let sut: CreateGymUseCase
describe('Create Gym Use Case',()=>{
    beforeEach(()=>{
        gymsRepository = new InMemoryGymsRepository()
        sut = new CreateGymUseCase(gymsRepository)
    })

    it('should be able to create gym', async ()=>{
        const { gym } = await sut.execute({
            title:'CT Iron Berg',
            description: null,
            phone: null,
            latitude:-4.3160809,
            longitude:-40.705786,
        })

        expect(gym.id).toEqual(expect.any(String))

    })

    
})

