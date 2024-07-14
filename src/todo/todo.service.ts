import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { Todo, User } from '@prisma/client';

import { ValidationService } from '../common/validation.service';
import { TodoValidation } from './todo.validation';
import { WebResponse } from '../model/web.model';
import {
  TodoResponse,
  CreateTodoRequest,
  UpdateTodoRequest,
  SearchTodoRequest,
} from '../model/todo.model';

@Injectable()
export class TodoService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async create(user: User, request: CreateTodoRequest): Promise<TodoResponse> {
    this.logger.debug(
      `TodoService.create(${JSON.stringify(user)}, ${JSON.stringify(request)})`,
    );
    const createRequest: CreateTodoRequest = this.validationService.validate(
      TodoValidation.CREATE,
      request,
    );

    const todo = await this.prismaService.todo.create({
      data: {
        ...createRequest,
        ...{ username: user.username },
      },
    });

    return this.toTodoResponse(todo);
  }

  toTodoResponse(todo: Todo): TodoResponse {
    return {
      title: todo.title,
      description: todo.description,
      status: todo.status,
      id: todo.id,
    };
  }

  async checkTodoMustExists(username: string, todoId: number): Promise<Todo> {
    const todo = await this.prismaService.todo.findFirst({
      where: {
        username: username,
        id: todoId,
      },
    });

    if (!todo) {
      throw new HttpException('Todo is not found', 404);
    }

    return todo;
  }

  async get(user: User, todoId: number): Promise<TodoResponse> {
    const todo = await this.checkTodoMustExists(user.username, todoId);
    return this.toTodoResponse(todo);
  }

  async update(user: User, request: UpdateTodoRequest): Promise<TodoResponse> {
    const updateRequest = this.validationService.validate(
      TodoValidation.UPDATE,
      request,
    );
    let todo = await this.checkTodoMustExists(
      user.username,
      updateRequest.id,
    );

    todo = await this.prismaService.todo.update({
      where: {
        id: todo.id,
        username: todo.username,
      },
      data: updateRequest,
    });

    return this.toTodoResponse(todo);
  }

  async remove(user: User, todoId: number): Promise<TodoResponse> {
    await this.checkTodoMustExists(user.username, todoId);

    const todo = await this.prismaService.todo.delete({
      where: {
        id: todoId,
        username: user.username,
      },
    });

    return this.toTodoResponse(todo);
  }

  async search(
    user: User,
    request: SearchTodoRequest,
  ): Promise<WebResponse<TodoResponse[]>> {
    const searchRequest: SearchTodoRequest = this.validationService.validate(
      TodoValidation.SEARCH,
      request,
    );

    const filters = [];

    if (searchRequest.title) {
      // add title filter
      filters.push({
        title: {
          contains: searchRequest.title,
        },
      });
    }

    if (searchRequest.description) {
      // add description filter
      filters.push({
        description: {
          contains: searchRequest.description,
        },
      });
    }

    if (searchRequest.status) {
      // add status filter
      filters.push({
        status: {
          contains: searchRequest.status,
        },
      });
    }

    const skip = (searchRequest.page - 1) * searchRequest.size;

    const todos = await this.prismaService.todo.findMany({
      where: {
        username: user.username,
        AND: filters,
      },
      take: searchRequest.size,
      skip: skip,
    });

    const total = await this.prismaService.todo.count({
      where: {
        username: user.username,
        AND: filters,
      },
    });

    return {
      data: todos.map((todo) => this.toTodoResponse(todo)),
      paging: {
        current_page: searchRequest.page,
        size: searchRequest.size,
        total_page: Math.ceil(total / searchRequest.size),
      },
    };
  }
}
