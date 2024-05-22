import axios from 'axios'
import { Service } from 'typedi'

@Service()
export class EthereumService {
    private rpcEndpoints: string[] = [
        'https://eth.public-rpc.com',
        'https://eth.llamarpc.com',
        'https://rpc.ankr.com/eth',
        'https://rpc.flashbots.net/',
        'https://cloudflare-eth.com/',
        'https://eth-mainnet.gateway.pokt.network/v1/5f3453978e354ab992c4da79',
    ]

    private currentEndpointIndex = 0

    private async sendRpcRequest(method: string, params: any[]): Promise<any> {
        const endpoint = this.rpcEndpoints[this.currentEndpointIndex]
        const payload = {
            jsonrpc: '2.0',
            method,
            params,
            id: 1
        }

        try {
            const response = await axios.post(endpoint, payload);
            return response.data
        }
        catch (error: any) {
            console.log(`Error from RPC endpoint ${endpoint}: ${error.mesage}`)
            this.currentEndpointIndex = (this.currentEndpointIndex + 1) % this.rpcEndpoints.length
            return this.sendRpcRequest(method, params)
        }
    }

    public async getLatestBlockNumber(): Promise<number> {
        const response = await this.sendRpcRequest('eth_blockNumber', [])
        return parseInt(response.result, 16)
    }

    public async getBlockTransactions(blockNumber: number): Promise<any[]> {
        const response = await this.sendRpcRequest('eth_getBlockByNumber', [
            '0x' + blockNumber.toString(16),
            true
        ])
        return response.result.transactions
    }
}