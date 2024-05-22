import { Server } from 'socket.io';
import { getTransactionsByBlockNumber, getLatestBlockNumber } from './services/ethereum';
import { filterTransactions } from './services/ethereum';
import * as jwt from 'jsonwebtoken';

export const setupSocket = (server: any) => {
    const io = new Server(server);

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err: any, decoded: any) => {
            if (err) {
                return next(new Error('Authentication error'));
            }
            (socket as any).user = decoded;
            next();
        });
    });

    io.on('connection', (socket) => {
        socket.on('subscribe', async (filters) => {
            const latestBlockNumber = await getLatestBlockNumber();
            const transactions = await getTransactionsByBlockNumber(latestBlockNumber);

            const filteredTransactions = filterTransactions(transactions, filters);

            socket.emit('transactions', filteredTransactions);
        });
    });
};
