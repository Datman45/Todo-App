import axios, { AxiosInstance } from "axios";

export abstract class BaseService {
	protected axiosInstance: AxiosInstance;

	constructor() {
		this.axiosInstance = axios.create({
			baseURL: "https://taltech.akaver.com/api/v1/",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});
	}
}
