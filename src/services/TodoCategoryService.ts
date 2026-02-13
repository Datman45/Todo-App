import { EntityService } from "./EntityService";
import { ITodoCategory } from "@/types/domain/ITodoCategory";

export class TodoCategoryService extends EntityService<ITodoCategory> {
	constructor() {
		super("TodoCategories");
	}
}
