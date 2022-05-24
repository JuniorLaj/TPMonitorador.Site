import axios from "axios";

const api = axios.create({
    baseUrl: "https://localhost:44349",
})

export default api;