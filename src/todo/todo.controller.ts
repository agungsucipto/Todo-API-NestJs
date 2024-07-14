import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Auth } from '../common/auth.decorator';
import { User } from '@prisma/client';
import {
  TodoResponse,
  CreateTodoRequest,
  SearchTodoRequest,
  UpdateTodoRequest,
} from '../model/Todo.model';
import { WebResponse } from '../model/web.model';

@Controller('/api/todos')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Post()
  @HttpCode(200)
  async create(
    @Auth() user: User,
    @Body() request: CreateTodoRequest,
  ): Promise<WebResponse<TodoResponse>> {
    const result = await this.todoService.create(user, request);
    return {
      data: result,
    };
  }

  @Get('/:TodoId')
  @HttpCode(200)
  async get(
    @Auth() user: User,
    @Param('TodoId', ParseIntPipe) TodoId: number,
  ): Promise<WebResponse<TodoResponse>> {
    const result = await this.todoService.get(user, TodoId);
    return {
      data: result,
    };
  }

  @Put('/:TodoId')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Param('TodoId', ParseIntPipe) TodoId: number,
    @Body() request: UpdateTodoRequest,
  ): Promise<WebResponse<TodoResponse>> {
    request.id = TodoId;
    const result = await this.todoService.update(user, request);
    return {
      data: result,
    };
  }

  @Delete('/:TodoId')
  @HttpCode(200)
  async remove(
    @Auth() user: User,
    @Param('TodoId', ParseIntPipe) TodoId: number,
  ): Promise<WebResponse<boolean>> {
    await this.todoService.remove(user, TodoId);
    return {
      data: true,
    };
  }

  @Get()
  @HttpCode(200)
  async search(
    @Auth() user: User,
    @Query('title') title?: string,
    @Query('status') status?: string,
    @Query('description') description?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
  ): Promise<WebResponse<TodoResponse[]>> {
    const request: SearchTodoRequest = {
      title: title,
      status: status,
      description: description,
      page: page || 1,
      size: size || 10,
    };
    return this.todoService.search(user, request);
  }
}
