import { Injectable } from "@nestjs/common";
import { readFileSync } from "fs";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { StorageManager } from "../storage/storage.service";
import { faker } from "@faker-js/faker";
import { Gender } from "../helper/class/profile.entity";
import { MemoryStoredFile } from "nestjs-form-data";
import { Admin } from "../admin/entities/admin.entity";
import { IdGenerator } from "../id-generator/id-generator.service";
import { HashService } from "../hash/hash.service";
import { AvatarGenerator } from "../avatar-generator/avatar-generator.service";
import { Resident } from "../resident/entities/resident.entity";
import { Manager } from "../manager/entities/manager.entity";
import { Technician } from "../technician/entities/technician.entity";
import { ResidentRepository } from "../resident/resident.service";

import { ContractRole, ContractStatusRole } from "../helper/enums/contractEnum";
import { Client } from "elasticsearch";
@Injectable()
export class SeedService {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
        private readonly storageManager: StorageManager,
        private readonly idGenerator: IdGenerator,
        private readonly hashService: HashService,
        private readonly avatarGenerator: AvatarGenerator,
     //   private readonly elasticsearchClient: Client,
        private readonly residentService: ResidentRepository,
        ) {}

    async dropDB() {
        try {
            await this.storageManager.destroyStorage();
            await this.dataSource.dropDatabase();
            // await this.elasticsearchClient.indices.delete({
            //     index: "apartment",
            // });
            // await this.elasticsearchClient.indices.create({
            //     index: "apartment",
            //     method: "PUT",
            // });
        } catch (error) {
            console.error(error);
            // throw error;
        }
    }
    async createDB() {
        try {
            await this.storageManager.initiateStorage();
            await this.dataSource.synchronize();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    private readonly NUMBER_OF_BUILDING = 5;
    private readonly NUMBER_OF_FLOOR_PER_BUILDING = 5;
    private readonly NUMBER_OF_APARTMENT_PER_FLOOR = 6;
    private readonly NUMBER_OF_RESIDENT = 1;

    private readonly NUMBER_OF_EMPLOYEE = 10;
    private readonly NUMBER_OF_MANAGER = 10;
    private readonly NUMBER_OF_TECHNICIAN = 10;
    private readonly NUMBER_OF_ADMIN = 2;
    private readonly NUMBER_OF_Service = 5;
    private readonly NUMBER_OF_ServicePackage_PER_SERVICE = 5;

    private readonly frontIdentity = {
        buffer: readFileSync(process.cwd() + "/src/seed/front.jpg"),
    } as MemoryStoredFile;

    private readonly backIdentity = {
        buffer: readFileSync(process.cwd() + "/src/seed/back.jpg"),
    } as MemoryStoredFile;
    private readonly pool = {
        buffer: readFileSync(process.cwd() + "/src/seed/pool.jpg"),
    } as MemoryStoredFile;
    private readonly gym = {
        buffer: readFileSync(process.cwd() + "/src/seed/gym.jpg"),
    } as MemoryStoredFile;
    private readonly library = {
        buffer: readFileSync(process.cwd() + "/src/seed/library.jpg"),
    } as MemoryStoredFile;
    private readonly parking = {
        buffer: readFileSync(process.cwd() + "/src/seed/parking.jpg"),
    } as MemoryStoredFile;

    private readonly images = [
        {
            buffer: readFileSync(process.cwd() + "/src/seed/room.jpg"),
        } as MemoryStoredFile,
        {
            buffer: readFileSync(process.cwd() + "/src/seed/room (2).jpg"),
        } as MemoryStoredFile,
        {
            buffer: readFileSync(process.cwd() + "/src/seed/room (3).jpg"),
        } as MemoryStoredFile,
        {
            buffer: readFileSync(process.cwd() + "/src/seed/room (4).jpg"),
        } as MemoryStoredFile,
        {
            buffer: readFileSync(process.cwd() + "/src/seed/room (5).jpg"),
        } as MemoryStoredFile,
    ];

    async startSeeding() {
        await this.createDemoAdmin();
        await this.createDemoTechnician();
        await this.createDemoAccountResident();

       
    }

    
    async createDemoAccountResident() {
        let id = "RESIDENT";
        const resident = await this.dataSource.getRepository(Resident).save({
            id: id,
            profile: {
                date_of_birth: faker.date.birthdate(),
                name: faker.person.fullName(),
                gender: Gender.MALE,
                phone_number: faker.phone.number(),
                front_identify_card_photo_URL: await this.storageManager.upload(
                    this.frontIdentity.buffer,
                    "resident/" + id + "/frontIdentifyPhoto.jpg",
                    "image/jpeg",
                ),
                back_identify_card_photo_URL: await this.storageManager.upload(
                    this.backIdentity.buffer,
                    "resident/" + id + "/backIdentifyPhoto.jpg",
                    "image/jpeg",
                ),
                identify_number: faker.string.numeric(12),
                avatarURL: await this.storageManager.upload(
                    await this.avatarGenerator.generateAvatar("DEMO RESIDENT"),
                    "resident/" + id + "/avatar.svg",
                    "image/svg+xml",
                ),
            },
            account: {
                owner_id: id,
                email: "resident@gmail.com",
                password: this.hashService.hash("password"),
            },
        });
    }

    async createDemoTechnician() {
        let id = "TEC" + this.idGenerator.generateId();
        const technician = await this.dataSource
            .getRepository(Technician)
            .save({
                id: id,
                profile: {
                    date_of_birth: new Date("1999-01-01"),
                    name: "DEMO TECHNICIAN",
                    gender: Gender.MALE,
                    phone_number: "0896666666",
                    front_identify_card_photo_URL:
                        await this.storageManager.upload(
                            this.frontIdentity.buffer,
                            "technician/" + id + "/frontIdentifyPhoto.jpg",
                            "image/jpeg",
                        ),
                    back_identify_card_photo_URL:
                        await this.storageManager.upload(
                            this.backIdentity.buffer,
                            "technician/" + id + "/backIdentifyPhoto.jpg",
                            "image/jpeg",
                        ),
                    identify_number: faker.string.numeric(12),
                    avatarURL: await this.storageManager.upload(
                        await this.avatarGenerator.generateAvatar(
                            "DEMO TECHNICIAN",
                        ),
                        "technician/" + id + "/avatar.svg",
                        "image/svg+xml",
                    ),
                },
                account: {
                    owner_id: id,
                    email: "technician@gmail.com",
                    password: this.hashService.hash("password"),
                },
            });
    }

    async createDemoManager() {
        let id = "MNG" + this.idGenerator.generateId();
        const manager = await this.dataSource.getRepository(Manager).save({
            id: id,
            profile: {
                date_of_birth: new Date("1999-01-01"),
                name: "DEMO MANAGER",
                gender: Gender.MALE,
                phone_number: "0677778787",
                front_identify_card_photo_URL: await this.storageManager.upload(
                    this.frontIdentity.buffer,
                    "manager/" + id + "/frontIdentifyPhoto.jpg",
                    "image/jpeg",
                ),
                back_identify_card_photo_URL: await this.storageManager.upload(
                    this.backIdentity.buffer,
                    "manager/" + id + "/backIdentifyPhoto.jpg",
                    "image/jpeg",
                ),
                identify_number: faker.string.numeric(12),
                avatarURL: await this.storageManager.upload(
                    await this.avatarGenerator.generateAvatar("DEMO MANAGER"),
                    "manager/" + id + "/avatar.svg",
                    "image/svg+xml",
                ),
            },
            account: {
                owner_id: id,
                email: "manager@gmail.com",
                password: this.hashService.hash("password"),
            },
            
        });
    }

    async createDemoResident(index, apartment_id: string) {
        let id = "RES" + this.idGenerator.generateId();
        const resident = await this.dataSource.getRepository(Resident).save({
            id: id,
            profile: {
                date_of_birth: faker.date.birthdate(),
                name: faker.person.fullName(),
                gender: Gender.MALE,
                phone_number: faker.phone.number(),
                front_identify_card_photo_URL: await this.storageManager.upload(
                    this.frontIdentity.buffer,
                    "resident/" + id + "/frontIdentifyPhoto.jpg",
                    "image/jpeg",
                ),
                back_identify_card_photo_URL: await this.storageManager.upload(
                    this.backIdentity.buffer,
                    "resident/" + id + "/backIdentifyPhoto.jpg",
                    "image/jpeg",
                ),
                identify_number: faker.string.numeric(12),
                avatarURL: await this.storageManager.upload(
                    await this.avatarGenerator.generateAvatar("DEMO RESIDENT"),
                    "resident/" + id + "/avatar.svg",
                    "image/svg+xml",
                ),
            },
            // stay_at: apartment,
            account:
                index % 2 === 0
                    ? {
                          owner_id: id,
                          email: faker.internet.email(),
                          password: this.hashService.hash("password"),
                      }
                    : undefined,
         });
    }

    async createDemoEmployee(index) {
        let id = "EMP" + this.idGenerator.generateId();
    
    }

    async createDemoAdmin() {
        let id = "ADM" + this.idGenerator.generateId();
        const admin = await this.dataSource.getRepository(Admin).save({
            id: id,
            profile: {
                date_of_birth: new Date("1999-01-01"),
                name: "DEMO ADMIN",
                gender: Gender.MALE,
                phone_number: "0755555555",
                front_identify_card_photo_URL: await this.storageManager.upload(
                    this.frontIdentity.buffer,
                    "admin/" + id + "/frontIdentifyPhoto.jpg",
                    "image/jpeg",
                ),
                back_identify_card_photo_URL: await this.storageManager.upload(
                    this.backIdentity.buffer,
                    "admin/" + id + "/backIdentifyPhoto.jpg",
                    "image/jpeg",
                ),
                identify_number: faker.string.numeric(12),
                avatarURL: await this.storageManager.upload(
                    await this.avatarGenerator.generateAvatar("DEMO ADMIN"),
                    "admin/" + id + "/avatar.svg",
                    "image/svg+xml",
                ),
            },
            account: {
                owner_id: id,
                email: "admin@gmail.com",
                password: this.hashService.hash("password"),
            },
        });
    }
    async createDemoApartment(id?: string) {
        let apartmentId = "APM" + this.idGenerator.generateId();
        if (id) apartmentId = id;
     }

    async createDemoEmployees() {
        for (let i = 0; i < this.NUMBER_OF_EMPLOYEE; i++) {
            await this.createDemoEmployee(i);
        }
    }
}
