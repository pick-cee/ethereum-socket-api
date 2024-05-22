# Ethereum Transaction Streamer

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables for JWT secret, PostgresDB Credentials and PORT .
4. Build the project: `npm run build`
5. Start the project: `npm start`

## Running with Docker

1. Build and start the containers: `docker-compose up --build`
2. Access the application on `http://localhost:3000`

## API Endpoints

### Registration

POST /auth/register

```json
{
	"username": "your_username",
	"password": "your_password"
}
```

### Login

POST /auth/login

```json
{
	"username": "your_username",
	"password": "your_password"
}
```
