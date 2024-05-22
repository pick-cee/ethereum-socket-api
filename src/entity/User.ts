import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    userId!: string

    @Column({ type: String, nullable: false })
    username!: string

    @Column({ type: String, nullable: false })
    password!: string
}   