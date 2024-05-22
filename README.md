# Ethereum Socket.IO API

This project is a backend API that streams real-time Ethereum transactions using Socket.IO. It provides various subscription modes to filter and receive transactions based on specific criteria, such as sender address, receiver address, or value range.

## Features

-   **Authentication**: Registration and login functionality with JWT authentication.
-   **Ethereum RPC Integration**: Connects to public Ethereum RPC endpoints to fetch block and transaction data.
-   **Connection Pooling**: Implements connection pooling to handle multiple RPC endpoints and failover.
-   **Batched RPC Requests**: Batches multiple RPC requests to improve performance.
-   **Real-time Transaction Streaming**: Streams Ethereum transactions in real-time using Socket.IO.
-   **Subscription Modes**:
    -   Subscribe to all transactions
    -   Subscribe to transactions by sender address
    -   Subscribe to transactions by receiver address
    -   Subscribe to transactions by sender or receiver address
    -   Subscribe to transactions within a specified value range
-   **Docker Support**: Includes Docker Compose configuration for easy deployment.

## Prerequisites

-   Node.js (version >=16)
-   npm (version >=6)
-   Docker (optional, for running with Docker Compose)

## Getting Started

1. Clone the repository:

    ```bash
    git clone git@github.com:pick-cee/ethereum-socket-api.git
    ```

2. Install dependencies:

    ```bash
    cd ethereum-socket-api
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the project root directory and add the following variables:

    ```
    JWT_SECRET=
    POSTGRES_USERNAME=
    POSTGRES_PASSWORD=
    POSTGRES_DATABASE=
    PORT=
    ```

4. Build the project:

    ```bash
    npm run build
    ```

5. Start the server:

    ```bash
    npm start
    ```

    The server will be running on `http://localhost:3000`.

## Docker Deployment

You can also run the application and its dependencies using Docker Compose:

1. Build the Docker image:

    ```bash
    docker-compose build
    ```

2. Start the Docker containers:

    ```bash
    docker-compose up
    ```

    The server will be running on `http://localhost:3000`.

## API Documentation

### Authentication

-   `POST /register`: Register a new user.

    -   Request Body: `{ username: string, password: string }`
    -   Response: `201 Created` on success, `400 Bad Request` if the username already exists.

-   `POST /login`: Log in and obtain a JWT token.
    -   Request Body: `{ username: string, password: string }`
    -   Response: `200 OK` with a JWT token on success, `401 Unauthorized` if the credentials are invalid.

### Socket.IO

To connect, you need to provide a valid JWT token obtained from the `/login` endpoint.

After connecting, you can subscribe to different transaction events by emitting the following events:

-   `subscribeAll`: Subscribe to all transactions.
-   `subscribeBySender(address: string)`: Subscribe to transactions by sender address.
-   `subscribeByReceiver(address: string)`: Subscribe to transactions by receiver address.
-   `subscribeBySenderOrReceiver(address: string)`: Subscribe to transactions by sender or receiver address.
-   `subscribeByValueRange(range: string)`: Subscribe to transactions within a specified value range (e.g., `"100-500"`).

The server will emit a `transaction` event with the transaction data in the following format:

```typescript
interface TransactionData {
	senderAddress: string;
	receiverAddress: string;
	blockNumber: number;
	blockHash: string;
	transactionHash: string;
	gasPrice: number; // in WEI
	value: number; // in WEI
}
```

## License

This project is licensed under the [MIT License](LICENSE).
