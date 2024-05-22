import Web3 from 'web3'
import axios from 'axios'

const rpcUrls = [
    'https://eth.public-rpc.com',
    'https://eth.llamarpc.com',
    'https://rpc.ankr.com/eth',
    'https://rpc.flashbots.net/',
    'https://cloudflare-eth.com/',
    'https://eth-mainnet.gateway.pokt.network/v1/5f3453978e354ab992c4da79',
]

let currentRpcIndex = 0
let web3 = new Web3(rpcUrls[currentRpcIndex])

const axiosInstance = axios.create({
    baseURL: rpcUrls[currentRpcIndex],
    headers: { 'Content-Type': 'application/json' }
})
const switchRpcAxios = () => {
    currentRpcIndex = (currentRpcIndex + 1) % rpcUrls.length;
    axiosInstance.defaults.baseURL = rpcUrls[currentRpcIndex];
};


export const getLatestBlockNumber = async (): Promise<number> => {
    try {
        const response = await axiosInstance.post('', {
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
            id: 1
        });
        return parseInt(response.data.result, 16);
    }
    catch (error) {
        switchRpcAxios();
        return getLatestBlockNumber();
    }
}

export const getTransactionsByBlockNumber = async (blockNumber: number): Promise<any[]> => {
    try {
        const response = await axiosInstance.post('', {
            jsonrpc: '2.0',
            method: 'eth_getBlockByNumber',
            params: [web3.utils.toHex(blockNumber), true],
            id: 1
        });
        return response.data.result.transactions;
    } catch (error) {
        switchRpcAxios();
        return getTransactionsByBlockNumber(blockNumber);
    }
};

const switchRpc = () => {
    currentRpcIndex = (currentRpcIndex + 1) % rpcUrls.length;
    web3 = new Web3(rpcUrls[currentRpcIndex]);
};

export const filterTransactions = (transactions: any[], filters: any) => {
    return transactions.filter(tx => {
        const valueInETH = parseFloat(web3.utils.fromWei(tx.value, 'ether'));
        const withinRange = (value: number) => {
            if (filters.range === '0-100' && value >= 0 && value <= 100) return true;
            if (filters.range === '100-500' && value > 100 && value <= 500) return true;
            if (filters.range === '500-2000' && value > 500 && value <= 2000) return true;
            if (filters.range === '2000-5000' && value > 2000 && value <= 5000) return true;
            if (filters.range === '>5000' && value > 5000) return true;
            return false;
        };

        const matchesSender = filters.sender ? tx.from.toLowerCase() === filters.sender.toLowerCase() : true;
        const matchesReceiver = filters.receiver ? tx.to.toLowerCase() === filters.receiver.toLowerCase() : true;
        const matchesEither = filters.either ? (tx.from.toLowerCase() === filters.either.toLowerCase() || tx.to.toLowerCase() === filters.either.toLowerCase()) : true;

        return withinRange(valueInETH) && matchesSender && matchesReceiver && matchesEither;
    });
};