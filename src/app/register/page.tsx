"use client";

import { AccountContext } from "@/contex/AccountContext";
import { AccountService } from "@/services/AccountService";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function Register() {
	const accountService = new AccountService();
	const { setAccountInfo } = useContext(AccountContext);
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState("");
	const [loading, setLoading] = useState(false);
	type Inputs = {
		email: string;
		password: string;
		confirmPassword: string;
		firstName: string;
		lastName: string;
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<Inputs>({
		defaultValues: {
			email: "",
			password: "",
			firstName: "",
			lastName: "",
		},
	});

	const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
		setLoading(true);

		try {
			var result = await accountService.registerAsync(
				data.email,
				data.password,
				data.firstName,
				data.lastName
			);

			setLoading(false);
			if (result.errors) {
				setErrorMessage("User already registered!");
				return;
			}

			setAccountInfo!({
				token: result.data!.token,
			});

			router.push("/todoTask");
		} catch (error) {
			setErrorMessage("Register failed - " + (error as Error).message);
		}
	};
	return (
		<>
			{loading && <div className="loading mb-2">Loading...</div>}
			{errorMessage && (
				<div className="error-message">{errorMessage}</div>
			)}
			<form onSubmit={handleSubmit(onSubmit)} className="form-template">
				<div className="form-group">
					<input
						type="email"
						className="form-control mw-300"
						id="inputEmail"
						aria-describedby="emailHelp"
						placeholder="Email"
						{...register("email", {
							required: "Email required",
							maxLength: {
								value: 256,
								message: "Email max length can be 256 symbols",
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
						type="text"
						className="form-control mw-300"
						id="inputFirstName"
						placeholder="First Name"
						{...register("firstName", {
							required: "First Name required",
							maxLength: {
								value: 128,
								message:
									"First Name max length can be 128 symbols",
							},
						})}
					/>
					{errors.firstName && (
						<span className="text-danger field-validation-valid">
							{errors.firstName.message}
						</span>
					)}
				</div>

				<div className="form-group">
					<input
						type="text"
						className="form-control mw-300"
						id="inputLastName"
						placeholder="Last Name"
						{...register("lastName", {
							required: "Last Name required",
							maxLength: {
								value: 128,
								message:
									"Last Name max length can be 128 symbols",
							},
						})}
					/>
					{errors.lastName && (
						<span className="text-danger field-validation-valid">
							{errors.lastName.message}
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
							required: "Password required!",
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
							pattern: {
								value: /[^a-zA-Z0-9]/,
								message:
									"Password must have at least one non-alphanumeric character",
							},
						})}
					/>
					{errors.password && (
						<span className="text-danger field-validation-valid">
							{errors.password.message}
						</span>
					)}
				</div>

				<div className="form-group">
					<input
						type="password"
						className="form-control mw-300"
						id="inputConfirmPassword"
						placeholder="Confirm Password"
						{...register("confirmPassword", {
							required: "Confirm password required",
							validate: (value) =>
								value === watch("password") ||
								"Passwords do not match",
						})}
					/>
					{errors.confirmPassword && (
						<span className="text-danger field-validation-valid">
							{errors.confirmPassword.message}
						</span>
					)}
				</div>

				<button type="submit" className="btn btn-primary">
					Submit
				</button>
			</form>
		</>
	);
}
