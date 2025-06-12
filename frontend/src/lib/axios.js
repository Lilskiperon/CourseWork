import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "http://26.112.27.74:5000/api",
	withCredentials: true, 
});

export default axiosInstance;