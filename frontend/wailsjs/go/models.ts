export namespace models {
	
	export class Todo {
	    id: number;
	    text: string;
	    completed: boolean;
	    createdAt: string;
	
	    static createFrom(source: any = {}) {
	        return new Todo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.text = source["text"];
	        this.completed = source["completed"];
	        this.createdAt = source["createdAt"];
	    }
	}

}

