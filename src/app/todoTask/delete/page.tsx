"use client";

import { AccountContext } from "@/contex/AccountContext";
import { TodoTaskService } from "@/services/TodoTasksService";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState, Suspense } from "react";
import { ITodoTask } from "@/types/domain/ITodoTask";

export default function DeletePageWrapper() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Delete />
		</Suspense>
	);
}

function Delete() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const idParam = searchParams.get("id");
	const { accountInfo } = useContext(AccountContext);
	const todoTaskService = new TodoTaskService();
	const [getByIdData, setByIdData] = useState<ITodoTask>();
	const [errorMessage, setErrorMessage] = useState("");

	const handleDelete = async () => {
		try {
			var result = await todoTaskService.deleteAsync(
				String(idParam),
				accountInfo
			);
			if (result.errors) {
				setErrorMessage(result.errors[0]);
				return;
			}
		} catch (error) {
			setErrorMessage("Delete failed - " + (error as Error).message);
		}
		router.push("/todoTask");
	};

	useEffect(() => {
		if (!accountInfo?.token) {
			router.push("/login");
		}
	}, [accountInfo, router]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await todoTaskService.getByIdAsync(
					String(idParam),
					accountInfo
				);

				setByIdData(result.data!);
				if (result.errors) {
					setErrorMessage(result.errors[0]);
					return;
				}
			} catch (error) {
				setErrorMessage(
					"Fetch Data failed - " + (error as Error).message
				);
			}
		};
		fetchData();
	}, [accountInfo, idParam, router]);

	return (
		<>
			<div className="form-template">
				<div
					className="card shadow p-4"
					style={{ minWidth: 350, maxWidth: 500 }}
				>
					<h2 className="text-center text-danger mb-3">
						Delete Gps Session
					</h2>
					<div className="alert alert-warning text-center">
						Are you sure you want to delete this session?
					</div>
					<table className="table table-sm mb-4">
						<tbody>
							<tr>
								<th>TaskName</th>
								<td>{getByIdData?.taskName}</td>
							</tr>
							<tr>
								<th>TaskSort</th>
								<td>{getByIdData?.taskSort}</td>
							</tr>
							<tr>
								<th>CreatedDt</th>
								<td>{getByIdData?.createdDt}</td>
							</tr>
							<tr>
								<th>DueDt</th>
								<td>{getByIdData?.dueDt}</td>
							</tr>
							<tr>
								<th>IsCompleted</th>
								<td>{getByIdData?.isCompleted}</td>
							</tr>
							<tr>
								<th>IsArchived</th>
								<td>{getByIdData?.isArchived}</td>
							</tr>
							<tr>
								<th>TodoCategory</th>
								<td>{getByIdData?.todoCategoryId}</td>
							</tr>
							<tr>
								<th>TodoPriority</th>
								<td>{getByIdData?.todoPriorityId}</td>
							</tr>
							<tr>
								<th>SyncDt</th>
								<td>{getByIdData?.syncDt}</td>
							</tr>
						</tbody>
					</table>
					<div className="d-flex justify-content-end">
						<button
							className="btn btn-danger me-2"
							onClick={handleDelete}
						>
							Delete
						</button>
						<button
							className="btn btn-secondary"
							onClick={() => router.back()}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
