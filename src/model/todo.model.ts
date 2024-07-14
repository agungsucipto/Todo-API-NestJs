export class TodoResponse {
  id: number;
  title: string;
  description?: string;
  status?: string;
}

export class CreateTodoRequest {
  title: string;
  description: string;
  status: string;
}

export class UpdateTodoRequest {
  id: number;
  title?: string;
  description?: string;
  status?: string;
}

export class SearchTodoRequest {
  title?: string;
  status?: string;
  description?: string;
  page: number;
  size: number;
}
