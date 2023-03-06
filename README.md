# Simple auth api

## Installation

Create .env file with MONGODB_URI and PORT (if necessaryi) variables. Look in the .env.example for a hint. Then run below commands for installing npm dependencies and running server.

```bash
    npm install 
    node index.js
```

## API Reference

#### Register new user

```http
  POST /register
  ```
  ```
  Request body eg: 
  {
    "email": "somestring",
    "password": "somestring"
  }
```

#### Login

```http
  POST /login
  ```
  ```
  Request body eg: 
  {
    "email": "somestring",
    "password": "somestring"
  }
  Success response:
  {
    "message": "Login Successful",
    "email": "useremail",
    "token": "jwttoken",
  }
```

#### Check free api endpoint

```http
  GET /free-endpoint
```

#### Check secured api endpoint

```http
  GET /auth-endpoint
```
This endpoint checks your JWT token provided in authorization header like ```"Bearer <yourtoken>"```.