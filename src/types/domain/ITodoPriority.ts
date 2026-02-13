import type { IDomainId } from "./IDomainId";

export interface ITodoPriority extends IDomainId {
	appUserId: string;
	priorityName: string;
	prioritySort: number;
	syncDt: string;
	tag: string;
}
