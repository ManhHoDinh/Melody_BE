import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from "typeorm";
import { PersonRole, Profile } from "../../helper/class/profile.entity";
import { Account } from "../../account/entities/account.entity";
import { ManyToOne, JoinColumn } from "typeorm";
import { Vehicle } from "../../vehicle/entities/vehicle.entity";

@Entity()
export class Resident {
    @PrimaryColumn()
    id: string;

    @Column(() => Profile)
    profile: Profile;

    @OneToOne(() => Account, (account) => account.resident, {
        nullable: true,
        cascade: true,
    })
    @JoinColumn()
    account?: Account;

    @Column({ nullable: true })
    account_id?: string;

    @Column({ nullable: true })
    payment_info?: string;

   
    @Column({ nullable: true })
    stay_at_apartment_id: string;

    @OneToMany(() => Vehicle, (vehicle) => vehicle.resident)
    vehicles: Vehicle[];

   
    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

    role = PersonRole.RESIDENT;
}
