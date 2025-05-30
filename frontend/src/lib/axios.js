import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "http://26.84.9.17:5000/api",
	withCredentials: true, 
});

export default axiosInstance;