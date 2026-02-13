import { IAuthenticationDto } from "@/types/IAuthenticationDto";
import { BaseService } from "./BaseService";
import { IResultObject } from "@/types/IResultObject";
import { AxiosError } from "axios";

export class AccountService extends BaseService {
	async loginAsync(
		email: string,
		password: string
	): Promise<IResultObject<IAuthenticationDto>> {
		const url = "account/login";

		try {
			const loginData = {
				email,
				password,
			};
			const response = await this.axiosInstance.post<IAuthenticationDto>(
				url + "?tokenExpiresInSeconds=1",
				loginData
			);

			console.log("login response", response);

			if (response.status <= 300) {
				return {
					statusCode: response.status,
					data: response.data,
				};
			}

			return {
				statusCode: response.status,
				errors: [
					(
						response.status.toString() +
						" " +
						response.statusText
					).trim(),
				],
			};
		} catch (error) {
			console.log("error: ", (error as Error).message);
			return {
				statusCode: (error as AxiosError)?.status,
				errors: [(error as AxiosError).code ?? ""],
			};
		}
	}

	async registerAsync(
		email: string,
		password: string,
		firstName: string,
		lastName: string
	): Promise<IResultObject<IAuthenticationDto>> {
		const url = "account/register";

		try {
			const registerData = {
				email,
				password,
				firstName,
				lastName,
			};
			const response = await this.axiosInstance.post<IAuthenticationDto>(
				url + "?tokenExpiresInSeconds=1",
				registerData
			);

			console.log("register response", response);

			if (response.status <= 300) {
				return {
					statusCode: response.status,
					data: response.data,
				};
			}

			return {
				statusCode: response.status,
				errors: [
					(
						response.status.toString() +
						" " +
						response.statusText
					).trim(),
				],
			};
		} catch (error) {
			return {
				statusCode: (error as AxiosError)?.status,
				errors: [(error as AxiosError).code ?? ""],
			};
		}
	}
}
