"use client";

import { AccountContext } from "@/contex/AccountContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { TodoTaskService } from "@/services/TodoTasksService";
import { ITodoTask } from "@/types/domain/ITodoTask";
import Link from "next/link";
import { TodoCategoryService } from "@/services/TodoCategoryService";
import { ITodoCategory } from "@/types/domain/ITodoCategory";
import { ITodoPriority } from "@/types/domain/ITodoPriority";
import { TodoPriorityService } from "@/services/TodoPriorityService";

export default function TodoTasks() {
	const todoTaskService = new TodoTaskService();
	const { accountInfo } = useContext(AccountContext);
	const router = useRouter();
	const [data, setData] = useState<ITodoTask[]>();
	const [errorMessage, setErrorMessage] = useState("");
	const [showCompleted, setShowCompleted] = useState(false);
	const [showArchived, setShowArchived] = useState(false);

	useEffect(() => {
		if (!accountInfo?.token) {
			router.push("/login");
		}
	}, [accountInfo, router]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await todoTaskService.getAllAsync(accountInfo);
				if (result.errors) {
					setErrorMessage(result.errors[0]);
					return;
				}
				setData(result.data!);

				console.log("TodoTasks data:", result.data);
			} catch (error) {
				setErrorMessage("Login failed - " + (error as Error).message);
			}
		};
		fetchData();
	}, [accountInfo, router]);

	const [todoCategoryData, setTodoCategoryData] = useState<ITodoCategory[]>();
	const todoCategoryService = new TodoCategoryService();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result =
					await todoCategoryService.getAllAsync(accountInfo);

				setTodoCategoryData(result.data!);
				if (result.errors) {
					setErrorMessage(result.errors[0]);
					return;
				}

				console.log("TodoCategories data:", result.data);
			} catch (error) {
				setErrorMessage(
					"Fetch Data failed - " + (error as Error).message,
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
				const result =
					await todoPriorityService.getAllAsync(accountInfo);

				setTodoPriorityData(result.data!);
				if (result.errors) {
					setErrorMessage(result.errors[0]);
					return;
				}

				console.log("TodoCategories data:", result.data);
			} catch (error) {
				setErrorMessage(
					"Fetch Data failed - " + (error as Error).message,
				);
			}
		};
		fetchData();
	}, []);

	const filteredData = data
		? data.filter((item) => {
				if (showCompleted && showArchived) {
					return item.isCompleted && item.isArchived;
				}
				if (showCompleted) {
					return item.isCompleted;
				}
				if (showArchived) {
					return item.isArchived;
				}

				return true;
			})
		: [];

	return (
		<>
			<div className="text-danger mb-2">{errorMessage}</div>
			<h1>Todo Tasks</h1>
			<div className="mb-3">
				<div className="form-check form-check-inline">
					<input
						className="form-check-input"
						type="checkbox"
						id="showCompleted"
						checked={showCompleted}
						onChange={() => setShowCompleted((v) => !v)}
					/>
					<label className="form-check-label" htmlFor="showCompleted">
						Show Completed Tasks
					</label>
				</div>
				<div className="form-check form-check-inline">
					<input
						className="form-check-input"
						type="checkbox"
						id="showArchived"
						checked={showArchived}
						onChange={() => setShowArchived((v) => !v)}
					/>
					<label className="form-check-label" htmlFor="showArchived">
						Show Archived Tasks
					</label>
				</div>
			</div>
			<p>
				<Link className="btn btn-primary" href="/todoTask/create">
					Create New
				</Link>
			</p>

			<div className="taksTodoTable">
				<table className="table">
					<thead>
						<tr>
							<th>Title</th>
							<th>Order</th>
							<th>Created On</th>
							<th>Due Date</th>
							<th>Completed</th>
							<th>Archived</th>
							<th>Category</th>
							<th>Priority</th>
							<th>Synced Date</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{filteredData &&
							filteredData.map((item) => (
								<tr key={item.id}>
									<td>{item.taskName}</td>
									<td>{item.taskSort}</td>
									<td>{item.createdDt}</td>
									<td>{item.dueDt}</td>
									<td>{item.isCompleted ? "Yes" : "No"}</td>
									<td>{item.isArchived ? "Yes" : "No"}</td>
									<td>
										{todoCategoryData?.find(
											(category) =>
												category.id ===
												item.todoCategoryId,
										)?.categoryName ?? ""}
									</td>
									<td>
										{todoPriorityData?.find(
											(priority) =>
												priority.id ===
												item.todoPriorityId,
										)?.priorityName ?? ""}
									</td>
									<td>
										{item.syncDt
											? new Date(
													item.syncDt,
												).toLocaleString()
											: "Not Synced"}
									</td>
									<td>
										<Link
											className="btn btn-sm btn-primary"
											href={`/todoTask/edit?id=${item.id}`}
										>
											Edit
										</Link>
									</td>
									<td>
										<Link
											className="btn btn-sm btn-danger"
											href={`/todoTask/delete?id=${item.id}`}
										>
											Delete
										</Link>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</>
	);
}
