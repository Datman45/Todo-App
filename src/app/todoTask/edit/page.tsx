"use client";

import { AccountContext } from "@/contex/AccountContext";
import { TodoCategoryService } from "@/services/TodoCategoryService";
import { TodoPriorityService } from "@/services/TodoPriorityService";
import { TodoTaskService } from "@/services/TodoTasksService";
import { ITodoCategory } from "@/types/domain/ITodoCategory";
import { ITodoPriority } from "@/types/domain/ITodoPriority";
import { ITodoTask } from "@/types/domain/ITodoTask";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState, Suspense } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function EditPageWrapper() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Edit />
		</Suspense>
	);
}

function Edit() {
	const router = useRouter();

	const searchParams = useSearchParams();
	const idParam = searchParams.get("id");

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
		reset,
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
	const [todoTaskData, setTodoTaskData] = useState<ITodoTask>();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await todoTaskService.getByIdAsync(
					String(idParam),
					accountInfo
				);

				setTodoTaskData(result.data!);
				reset(result.data!);
				if (result.errors) {
					setErrorMessage(result.errors[0]);
					return;
				}

				console.log("TodoTask data:", result.data);
			} catch (error) {
				setErrorMessage(
					"Fetch Data failed - " + (error as Error).message
				);
			}
		};
		fetchData();
	}, [accountInfo, idParam, router, reset]);

	const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
		if (!idParam) {
			setErrorMessage("Invalid task ID.");
			return;
		}

		const inputData = {
			taskName: data.taskName,
			taskSort: Number(data.taskSort),
			createdDt: todoTaskData?.createdDt ?? new Date().toISOString(),
			dueDt: new Date(data.dueDt).toISOString(),
			isCompleted: data.isCompleted,
			isArchived: data.isArchived,
			todoCategoryId: data.todoCategoryId,
			todoPriorityId: data.todoPriorityId,
			syncDt: new Date().toISOString(),
		};

		console.log("Input Data:", inputData);
		console.log(todoCategoryData);
		console.log(todoPriorityData);
		try {
			var result = await todoTaskService.updateAsync(
				inputData,
				idParam,
				accountInfo
			);
			if (result.errors) {
				setErrorMessage(result.errors[0]);
				return;
			}
		} catch (error) {
			setErrorMessage("Update failed - " + (error as Error).message);
		}
	};
	return (
		<>
			<div className="form-template">
				<h1>TodoTask Create</h1>
				{errorMessage}
				<form onSubmit={handleSubmit(onSubmit)}>
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
						Update
					</button>
					<button
						type="button"
						className="btn btn-secondary"
						onClick={() => router.push("/todoTask")}
					>
						Cancel
					</button>
				</form>
			</div>
		</>
	);
}
