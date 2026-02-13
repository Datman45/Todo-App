import type { IDomainId } from "./IDomainId";

export interface ITodoCategory extends IDomainId {
	categoryName: string;
	categorySort: number;
	syncDt: string;
	tag: string;
}
