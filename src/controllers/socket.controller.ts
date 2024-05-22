import { Server, Socket } from "socket.io";
import { EthereumService } from "../services/ethereum.service";
import { Container } from "typedi";
import * as jwt from 'jsonwebtoken'

const ethereumService = Container.get(EthereumService)

export const setupSocketIO = (io: Server) => {
    io.use(async (socket: Socket, next) => {
        try {
            const token = socket.handshake.auth.token
            if (!token) {
                return next(new Error('Authentication token is required'));
            }
            const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`)
            socket.data.userId = (decoded as { userId: number }).userId
        }
        catch (error) {
            next(new Error('Authentication failed'))
        }
    })

    io.on('connection', async (socket: Socket) => {
        console.log('A client connected')

        //subscribe to all events
        socket.on('subscribeAll', async () => {
            streamTransaction(socket)
        })

        socket.on('subscribeBySender', async (address: string) => {
            streamTransactionsBySender(socket, address)
        })

        socket.on('subscribeByReceiver', async (address: string) => {
            streamTransactionsByReceiver(socket, address)
        })

        socket.on('subscribeBySenderOrReceiver', async (address: string) => {
            streamTransactionsBySenderOrReceiver(socket, address)
        })

        socket.on('subscribeByValueRange', async (range: string) => {
            streamTransactionsByValueRange(socket, range)
        })

        socket.on('disconnect', () => {
            console.log('A client disconnected');
        });
    })
}

const streamTransaction = async (socket: Socket) => {
    let latestBlockNumber = await ethereumService.getLatestBlockNumber()

    const streamBlocks = async () => {
        const currentBlockNumber = await ethereumService.getLatestBlockNumber()

        if (currentBlockNumber > latestBlockNumber) {
            for (let blockNumber = latestBlockNumber + 1; blockNumber <= currentBlockNumber; blockNumber++) {
                const transactions = await ethereumService.getBlockTransactions(blockNumber)

                for (const transaction of transactions) {
                    const {
                        from,
                        to,
                        blockNumber,
                        blockHash,
                        hash,
                        gasPrice,
                        value
                    } = transaction

                    const eventData = {
                        senderAddress: from,
                        receiverAddress: to,
                        blockNumber,
                        blockHash,
                        transactionHash: hash,
                        gasPrice: parseInt(gasPrice, 16),
                        value: parseInt(value, 16),
                    }
                    socket.emit('transaction', eventData)
                }
            }

            latestBlockNumber = currentBlockNumber
        }

        setTimeout(streamBlocks, 12000) //check for new blocks every 12 seconds
    }
    streamBlocks()
}

const streamTransactionsBySender = async (socket: Socket, address: string) => {
    let latestBlockNumber = await ethereumService.getLatestBlockNumber();

    const streamBlocks = async () => {
        const currentBlockNumber = await ethereumService.getLatestBlockNumber();

        if (currentBlockNumber > latestBlockNumber) {
            for (let blockNumber = latestBlockNumber + 1; blockNumber <= currentBlockNumber; blockNumber++) {
                const transactions = await ethereumService.getBlockTransactions(blockNumber);

                for (const transaction of transactions) {
                    const { from, to, blockNumber, blockHash, hash, gasPrice, value } = transaction;

                    if (from.toLowerCase() === address.toLowerCase()) {
                        const eventData = {
                            senderAddress: from,
                            receiverAddress: to,
                            blockNumber,
                            blockHash,
                            transactionHash: hash,
                            gasPrice: parseInt(gasPrice, 16),
                            value: parseInt(value, 16),
                        };

                        socket.emit('transaction', eventData);
                    }
                }
            }

            latestBlockNumber = currentBlockNumber;
        }

        setTimeout(streamBlocks, 12000); // Check for new blocks every 12 seconds
    };

    streamBlocks();
};

const streamTransactionsByReceiver = async (socket: Socket, address: string) => {
    let latestBlockNumber = await ethereumService.getLatestBlockNumber();

    const streamBlocks = async () => {
        const currentBlockNumber = await ethereumService.getLatestBlockNumber();

        if (currentBlockNumber > latestBlockNumber) {
            for (let blockNumber = latestBlockNumber + 1; blockNumber <= currentBlockNumber; blockNumber++) {
                const transactions = await ethereumService.getBlockTransactions(blockNumber);

                for (const transaction of transactions) {
                    const { from, to, blockNumber, blockHash, hash, gasPrice, value } = transaction;

                    if (to.toLowerCase() === address.toLowerCase()) {
                        const eventData = {
                            senderAddress: from,
                            receiverAddress: to,
                            blockNumber,
                            blockHash,
                            transactionHash: hash,
                            gasPrice: parseInt(gasPrice, 16),
                            value: parseInt(value, 16),
                        };

                        socket.emit('transaction', eventData);
                    }
                }
            }

            latestBlockNumber = currentBlockNumber;
        }

        setTimeout(streamBlocks, 12000); // Check for new blocks every 12 seconds
    };

    streamBlocks();
};

const streamTransactionsBySenderOrReceiver = async (socket: Socket, address: string) => {
    let latestBlockNumber = await ethereumService.getLatestBlockNumber();

    const streamBlocks = async () => {
        const currentBlockNumber = await ethereumService.getLatestBlockNumber();

        if (currentBlockNumber > latestBlockNumber) {
            for (let blockNumber = latestBlockNumber + 1; blockNumber <= currentBlockNumber; blockNumber++) {
                const transactions = await ethereumService.getBlockTransactions(blockNumber);

                for (const transaction of transactions) {
                    const { from, to, blockNumber, blockHash, hash, gasPrice, value } = transaction;

                    if (from.toLowerCase() === address.toLowerCase() || to.toLowerCase() === address.toLowerCase()) {
                        const eventData = {
                            senderAddress: from,
                            receiverAddress: to,
                            blockNumber,
                            blockHash,
                            transactionHash: hash,
                            gasPrice: parseInt(gasPrice, 16),
                            value: parseInt(value, 16),
                        };

                        socket.emit('transaction', eventData);
                    }
                }
            }

            latestBlockNumber = currentBlockNumber;
        }

        setTimeout(streamBlocks, 12000); // Check for new blocks every 12 seconds
    };

    streamBlocks();
};

const streamTransactionsByValueRange = async (socket: Socket, range: string) => {
    let latestBlockNumber = await ethereumService.getLatestBlockNumber();
    const [minValue, maxValue] = range.split('-').map(value => parseInt(value, 10));

    const streamBlocks = async () => {
        const currentBlockNumber = await ethereumService.getLatestBlockNumber();

        if (currentBlockNumber > latestBlockNumber) {
            for (let blockNumber = latestBlockNumber + 1; blockNumber <= currentBlockNumber; blockNumber++) {
                const transactions = await ethereumService.getBlockTransactions(blockNumber);

                for (const transaction of transactions) {
                    const { from, to, blockNumber, blockHash, hash, gasPrice, value } = transaction;
                    const transactionValue = parseInt(value, 16);

                    if (transactionValue >= minValue && transactionValue <= maxValue) {
                        const eventData = {
                            senderAddress: from,
                            receiverAddress: to,
                            blockNumber,
                            blockHash,
                            transactionHash: hash,
                            gasPrice: parseInt(gasPrice, 16),
                            value: transactionValue,
                        };

                        socket.emit('transaction', eventData);
                    }
                }
            }

            latestBlockNumber = currentBlockNumber;
        }

        setTimeout(streamBlocks, 12000); // Check for new blocks every 12 seconds
    };

    streamBlocks();
};