import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    sender!: string;

    @Column()
    receiver!: string;

    @Column()
    blockNumber!: number;

    @Column()
    blockHash!: string;

    @Column()
    transactionHash!: string;

    @Column()
    gasPrice!: string; // In WEI

    @Column()
    value!: string; // In WEI
}
