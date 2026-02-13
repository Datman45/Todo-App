import { EntityService } from "./EntityService";
import { ITodoPriority } from "@/types/domain/ITodoPriority";

export class TodoPriorityService extends EntityService<ITodoPriority> {
	constructor() {
		super("TodoPriorities");
	}
}
