"use client";

import { AccountContext } from "@/contex/AccountContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { TodoCategoryService } from "@/services/TodoCategoryService";
import { ITodoCategory } from "@/types/domain/ITodoCategory";
import { TodoPriorityService } from "@/services/TodoPriorityService";
import { ITodoPriority } from "@/types/domain/ITodoPriority";
import { TodoTaskService } from "@/services/TodoTasksService";
import { containsProhibitedWord } from "@/helpers/prohibitedWords";

export default function Create() {
	const router = useRouter();
	const { accountInfo } = useContext(AccountContext);
	const [errorMessage, setErrorMessage] = useState("");
	const [todoCategoryData, setTodoCategoryData] = useState<ITodoCategory[]>();
	const todoCategoryService = new TodoCategoryService();

	type Inputs = {
		taskName: string;
		taskSort: number;
		createdDt: string;
		dueDt: string;
		isCompleted: boolean;
		isArchived: boolean;
		todoCategoryId: string;
		todoPriorityId: string;
		syncDt: string;
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>({
		defaultValues: {
			taskName: "",
			taskSort: 0,
			dueDt: "",
			isCompleted: false,
			isArchived: false,
		},
	});

	useEffect(() => {
		if (!accountInfo?.token) {
			router.push("/login");
		}
	}, [accountInfo, router]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await todoCategoryService.getAllAsync(
					accountInfo
				);

				setTodoCategoryData(result.data!);
				if (result.errors) {
					setErrorMessage(result.errors[0]);
					return;
				}

				console.log("TodoCategories data:", result.data);
			} catch (error) {
				setErrorMessage(
					"Fetch Data failed - " + (error as Error).message
				);
			}
		};
		fetchData();
	}, []);

	const [todoPriorityData, setTodoPriorityData] = useState<ITodoPriority[]>();
	const todoPriorityService = new TodoPriorityService();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await todoPriorityService.getAllAsync(
					accountInfo
				);

				setTodoPriorityData(result.data!);
				if (result.errors) {
					setErrorMessage(result.errors[0]);
					return;
				}

				console.log("TodoCategories data:", result.data);
			} catch (error) {
				setErrorMessage(
					"Fetch Data failed - " + (error as Error).message
				);
			}
		};
		fetchData();
	}, []);

	const todoTaskService = new TodoTaskService();
	const onsubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
		if (containsProhibitedWord(data.taskName)) {
			setErrorMessage("Task name contains a prohibited word!");
			return;
		}

		const inputData = {
			taskName: data.taskName,
			taskSort: data.taskSort,
			createdDt: new Date().toISOString(),
			dueDt: data.dueDt,
			isCompleted: data.isCompleted,
			isArchived: data.isArchived,
			todoCategoryId: data.todoCategoryId,
			todoPriorityId: data.todoPriorityId,
			syncDt: new Date().toISOString(),
		};

		console.log("Input Data:", inputData);

		try {
			var result = await todoTaskService.addAsync(inputData, accountInfo);

			if (result.errors) {
				setErrorMessage(result.errors[0]);
				return;
			}

			router.push("/todoTask");
		} catch (error) {
			setErrorMessage("Login failed - " + (error as Error).message);
		}
	};

	return (
		<>
			<div className="form-template">
				<h1>TodoTask Create</h1>
				{errorMessage}
				<form onSubmit={handleSubmit(onsubmit)}>
					<div className="mb-3">
						<label htmlFor="name" className="form-label">
							TaskName
						</label>
						<input
							type="text"
							className="form-control mw-300"
							id="name"
							{...register("taskName", {
								required: "Task Name required",
								minLength: {
									value: 2,
									message:
										"Task Name length must be at least 2 symbols",
								},
								maxLength: {
									value: 256,
									message:
										"Task Name max length can be 256 symbols",
								},
							})}
						/>
						{errors.taskName && (
							<span className="text-danger field-validation-valid">
								{errors.taskName.message}
							</span>
						)}
					</div>
					<div className="mb-3">
						<label htmlFor="taskSort" className="form-label">
							Task Sort
						</label>
						<input
							type="number"
							className="form-control mw-300"
							id="taskSort"
							{...register("taskSort", {
								required: "Task Sort required",
								min: {
									value: 1,
									message: "Task Sort must be at least 1",
								},
							})}
						/>
						{errors.taskSort && (
							<span className="text-danger field-validation-valid">
								{errors.taskSort.message}
							</span>
						)}
					</div>
					<div className="mb-3 mw-300">
						<label htmlFor="dueDt" className="form-label ">
							DueDt
						</label>
						<input
							type="datetime-local"
							className="form-control"
							id="dueDt"
							{...register("dueDt", {
								required: "Due Date required",
							})}
						/>
					</div>
					<div className="mb-3 form-check">
						<input
							type="checkbox"
							className="form-check-input"
							id="isCompleted"
							{...register("isCompleted")}
						/>
						<label
							htmlFor="isCompleted"
							className="form-check-label"
						>
							IsCompleted
						</label>
					</div>
					<div className="mb-3 form-check">
						<input
							type="checkbox"
							className="form-check-input"
							id="isArchived"
							{...register("isArchived")}
						/>
						<label
							htmlFor="isArchived"
							className="form-check-label"
						>
							IsArchived
						</label>
					</div>
					<div className="mb-3 mw-300">
						<label htmlFor="todoCategoryId" className="form-label ">
							TodoCategoryId
						</label>
						<select
							className="form-control"
							id="todoCategoryId"
							{...register("todoCategoryId", {
								required: "Category is required",
							})}
						>
							<option></option>
							{todoCategoryData &&
								todoCategoryData.map((item) => (
									<option key={item.id} value={item.id}>
										{item.categoryName}
									</option>
								))}
						</select>
					</div>
					<div className="mb-3 mw-300">
						<label htmlFor="todoPriorityId" className="form-label ">
							TodoPriorityId
						</label>
						<select
							className="form-control"
							id="todoPriorityId"
							{...register("todoPriorityId", {
								required: "Priority is required",
							})}
						>
							<option></option>
							{todoPriorityData &&
								todoPriorityData.map((item) => (
									<option key={item.id} value={item.id}>
										{item.priorityName}
									</option>
								))}
						</select>
					</div>
					<button type="submit" className="btn btn-primary">
						Create
					</button>
					<button
						className="btn btn-secondary ms-2"
						onClick={() => router.back()}
					>
						Cancel
					</button>
				</form>
			</div>
		</>
	);
}
