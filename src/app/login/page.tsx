"use client";
import { AccountContext } from "@/contex/AccountContext";
import { AccountService } from "@/services/AccountService";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function Login() {
	const accountService = new AccountService();
	const [errorMessage, setErrorMessage] = useState("");
	const { setAccountInfo } = useContext(AccountContext);
	const router = useRouter();

	type Inputs = {
		email: string;
		password: string;
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>({
		defaultValues: {
			email: "test20@eesti.ee",
			password: "Foobar.1",
		},
	});

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		console.log(data);
		try {
			var result = await accountService.loginAsync(
				data.email,
				data.password,
			);

			if (result.errors) {
				setErrorMessage("User not found");
				return;
			}

			setAccountInfo!({
				token: result.data!.token,
				refreshToken: result.data!.refreshToken,
			});

			router.push("/todoTask");
		} catch (error) {
			console.error("Login failed:", error);
			setErrorMessage("Login failed - " + (error as Error).message);
		}
	};

	return (
		<>
			<div className="form-template">
				{errorMessage && (
					<div className="error-message">{errorMessage}</div>
				)}
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="form-group">
						<input
							type="email"
							className="form-control mw-300"
							id="inputEmail"
							aria-describedby="emailHelp"
							placeholder="Enter email"
							{...register("email", {
								required: "Email required",
								maxLength: {
									value: 256,
									message:
										"Email max length can be 256 symbols",
								},
							})}
						/>
						{errors.email && (
							<span className="text-danger field-validation-valid">
								{errors.email.message}
							</span>
						)}
					</div>
					<div className="form-group">
						<input
							type="password"
							className="form-control mw-300"
							id="inputPassword"
							placeholder="Password"
							{...register("password", {
								required: "Password required",
								minLength: {
									value: 6,
									message:
										"Password length must be at least 6 symbols",
								},
								maxLength: {
									value: 100,
									message:
										"Pasword max length can be 100 symbols",
								},
							})}
						/>
						{errors.password && (
							<span className="text-danger field-validation-valid">
								{errors.password.message}
							</span>
						)}
					</div>
					<button type="submit" className="btn btn-primary">
						Submit
					</button>
				</form>
			</div>
		</>
	);
}
