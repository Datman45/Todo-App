import { IResultObject } from "@/types/IResultObject";
import { BaseService } from "./BaseService";
import { AxiosError } from "axios";
import { IAccountInfo } from "@/contex/AccountContext";

export abstract class EntityService<TEntity> extends BaseService {
	constructor(private basePath: string) {
		super();
	}

	async getAllAsync(
		accountInfo?: IAccountInfo
	): Promise<IResultObject<TEntity[]>> {
		try {
			let options = {};
			if (accountInfo?.token) {
				options = {
					headers: {
						Authorization: `Bearer ${accountInfo?.token}`,
					},
				};
			}
			const response = await this.axiosInstance.get<TEntity[]>(
				this.basePath,
				options
			);
			console.log("getAll response", response);

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
			console.log("error: ", (error as AxiosError).message);
			return {
				statusCode: (error as AxiosError).status,
				errors: [(error as AxiosError).code ?? ""],
			};
		}
	}

	async getByIdAsync(
		id: string,
		accountInfo?: IAccountInfo
	): Promise<IResultObject<TEntity>> {
		try {
			let options = {};
			if (accountInfo?.token) {
				options = {
					headers: {
						Authorization: `Bearer ${accountInfo?.token}`,
					},
				};
			}

			const response = await this.axiosInstance.get<TEntity>(
				this.basePath + "/" + id,
				options
			);

			console.log("getById response", response);

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
			console.log("error: ", (error as AxiosError).message);
			return {
				statusCode: (error as AxiosError).status,
				errors: [(error as AxiosError).code ?? ""],
			};
		}
	}

	async addAsync(
		entity: TEntity,
		accountInfo?: IAccountInfo
	): Promise<IResultObject<TEntity>> {
		try {
			let options = {};
			if (accountInfo?.token) {
				options = {
					headers: {
						Authorization: `Bearer ${accountInfo?.token}`,
					},
				};
			}

			console.log(entity);
			const response = await this.axiosInstance.post<TEntity>(
				this.basePath,
				entity,
				options
			);

			console.log("Add session", response);

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
				statusCode: (error as AxiosError).status,
				errors: [(error as AxiosError).code ?? ""],
			};
		}
	}

	async updateAsync(
		entity: TEntity,
		id: string,
		accountInfo?: IAccountInfo
	): Promise<IResultObject<TEntity>> {
		try {
			let options = {};
			if (accountInfo?.token) {
				options = {
					headers: {
						Authorization: `Bearer ${accountInfo?.token}`,
					},
				};
			}
			const response = await this.axiosInstance.put<TEntity>(
				this.basePath + "/" + id,
				entity,
				options
			);

			console.log("update session", response);

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
				statusCode: (error as AxiosError).status,
				errors: [(error as AxiosError).code ?? ""],
			};
		}
	}

	async deleteAsync(
		id: string,
		accountInfo?: IAccountInfo
	): Promise<IResultObject<TEntity>> {
		try {
			let options = {};
			if (accountInfo?.token) {
				options = {
					headers: {
						Authorization: `Bearer ${accountInfo?.token}`,
					},
				};
			}

			const response = await this.axiosInstance.delete<TEntity>(
				this.basePath + "/" + id,
				options
			);

			console.log("update session", response);

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
				statusCode: (error as AxiosError).status,
				errors: [(error as AxiosError).code ?? ""],
			};
		}
	}
}
