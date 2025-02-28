import axios from "axios";

export const http = axios.create({
  baseURL: "https://app-prodwareazurecopilotapi-dev-001.azurewebsites.net/",
  headers: {
    'Content-Type': 'application/json',
    'ApiKey': 'c66b5486-b22e-49f8-8738-62fbb55ac9c5'
  },
  timeout: 30000,
});
export default http;