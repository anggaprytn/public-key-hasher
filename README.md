# 🔐 Express Public Key Hash

An Express-based API to retrieve the SHA-256 hash of a website's public key from its TLS certificate. Useful for security monitoring, certificate pinning, and integrity verification.

## 🚀 Features

- 📡 Fetches the TLS certificate of any domain
- 🔑 Extracts and hashes the public key using SHA-256
- 📜 Returns certificate expiration date
- ⚡ Fast and lightweight Express API
- 🔒 Helps with security validation and monitoring

## 📦 Installation

```sh
# Clone the repository
git clone https://github.com/anggaprytn/public-key-hasher.git

# Navigate to the project directory
cd public-key-hasher

# Install dependencies
bun install
```

## ▶️ Usage

### Start the Server
```sh
bun start
```
The server will run on **http://localhost:3012** by default.

### API Endpoint
#### Get Public Key Hash
```http
GET /publicKeyHash?domain=example.com
```

#### Response Example:
```json
{
  "data": {
    "publicKeyHash": "base64-encoded-hash",
    "validTo": "2025-01-01T00:00:00.000Z"
  },
  "meta": {
    "code": 200,
    "message": "success"
  }
}
```

## ⚙️ Environment Variables
| Variable | Description | Default |
|----------|------------|---------|
| `PORT` | Port to run the API server | 3012 |

## 🛠 Tech Stack
- **Node.js** 🚀
- **Express.js** ⚡
- **TLS Module** 🔐
- **Crypto Module** 🔑
- **Node Forge** 🔏

## 🤝 Contributing
Pull requests are welcome! If you have any suggestions or improvements, feel free to open an issue. 🚀

## 📜 License
MIT License © 2025

