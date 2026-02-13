import { EntityService } from "./EntityService";
import { ITodoTask } from "@/types/domain/ITodoTask";

export class TodoTaskService extends EntityService<ITodoTask> {
	constructor() {
		super("TodoTasks");
	}
}
