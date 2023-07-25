import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'



let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase
describe('Check-in Use Case',()=>{
    beforeEach(()=>{
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        sut = new CheckInUseCase(checkInsRepository,gymsRepository)

        gymsRepository.items.push({
            id:'gym-01',
            title:'IronBerg',
            description:'',
            phone:'',
            latitude: new Decimal(-4.3160809),
            longitude: new Decimal(-40.705786),
        })

        vi.useFakeTimers()
    })

    afterEach(()=>{
        vi.useRealTimers()
    })
    it('should be able to check in', async ()=>{
        
        const { checkIn } = await sut.execute({
            gymId:'gym-01',
            userId:'user-01',
            userLatitude:-4.3160809,
            userLongitude:-40.705786,
        })

        expect(checkIn.id).toEqual(expect.any(String))

    })

    it('should not be able to check in twice in the same day', async ()=>{

        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await sut.execute({
            gymId:'gym-01',
            userId:'user-01',
            userLatitude:-4.3160809,
            userLongitude:-40.705786,
        })

        await expect(()=>sut.execute({
            gymId:'gym-01',
            userId:'user-01',
            userLatitude:-4.3160809,
            userLongitude:-40.705786,
        })).rejects.toBeInstanceOf(Error)

    })

    it('should be able to check in twice but in different days', async ()=>{

        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await sut.execute({
            gymId:'gym-01',
            userId:'user-01',
            userLatitude:-4.3160809,
            userLongitude:-40.705786,
        })

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

        const { checkIn } = await sut.execute({
            gymId:'gym-01',
            userId:'user-01',
            userLatitude:-4.3160809,
            userLongitude:-40.705786,
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in on distant gym', async ()=>{

        gymsRepository.items.push({
            id:'gym-02',
            title:'Fittrainer',
            description:'',
            phone:'',
            latitude: new Decimal(-4.317408),
            longitude: new Decimal(-40.737801),
        })
        
        await expect(()=> sut.execute({
            gymId:'gym-02',
            userId:'user-01',
            userLatitude:-4.3160809,
            userLongitude:-40.705786,
        })
        ).rejects.toBeInstanceOf(Error)

    })
    
})
