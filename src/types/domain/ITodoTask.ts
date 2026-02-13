import type { IDomainId } from "./IDomainId";

export interface ITodoTask extends IDomainId {
	taskName: string;
	taskSort: number;
	createdDt: string;
	dueDt: string;
	isCompleted: boolean;
	isArchived: boolean;
	todoCategoryId: string;
	todoPriorityId: string;
	syncDt: string;
}
