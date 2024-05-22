// src/utils/database.ts
import { DataSource } from 'typeorm';
import { User } from '../entity/User';


export const AppDataSource = new DataSource({
    type: 'postgres',
    host: `${process.env.POSTGRES_HOST}`,
    port: 5432,
    username: `${process.env.POSTGRES_USERNAME}`,
    password: `${process.env.POSTGRES_PASSWORD}`,
    database: `${process.env.POSTGRES_DATABASE}`,
    entities: [User],
    synchronize: true,
    logging: ['info', 'schema']
});