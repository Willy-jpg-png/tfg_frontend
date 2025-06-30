# RepEat Frontend

This is the frontend of the **RepEat** food delivery web application. It is developed with [React](https://reactjs.org/) and connects to a Spring Boot backend via REST APIs and WebSockets.

## Requirements

Make sure you have the following installed before running the app:

- [Node.js](https://nodejs.org/) (version 18 or above recommended)
- npm (comes with Node.js) or [Yarn](https://yarnpkg.com/) (optional)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/rep-eat-frontend.git
   cd rep-eat-frontend
   ```
2. Install dependencies
 ```bash
   npm install
  # or if you're using yarn
  yarn install
   ```
3. **Configure backend URL**
If needed, update the base URL for the backend API and WebSocket server in your configuration file (e.g. services/config.js or constants.js):
```js
export const BASE_URL = "http://localhost:8080/tfg/api";
export const WS_URL = "http://localhost:8080/tfg/api/ws-location";
```
4. **Start the development server**
```bash
npm start
# or
yarn start
```
This will start the app at: http://localhost:3000
