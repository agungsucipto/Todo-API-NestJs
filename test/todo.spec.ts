import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('TodoController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST /api/todos', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/todos')
        .set('Authorization', 'test')
        .send({
          title: '',
          description: '',
          status: ''
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to create todo', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/todos')
        .set('Authorization', 'test')
        .send({
          title: 'test',
          description: 'test',
          status: 'pending'
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.title).toBe('test');
      expect(response.body.data.description).toBe('test');
      expect(response.body.data.status).toBe('pending');
    });
  });

  describe('GET /api/todos/:todoId', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
      await testService.createTodo();
    });

    it('should be rejected if todo is not found', async () => {
      const todo = await testService.getTodo();
      const response = await request(app.getHttpServer())
        .get(`/api/todos/${todo.id + 1}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get todo', async () => {
      const todo = await testService.getTodo();
      const response = await request(app.getHttpServer())
        .get(`/api/todos/${todo.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.title).toBe('test');
      expect(response.body.data.description).toBe('test');
      expect(response.body.data.status).toBe('pending');
    });
  });

  describe('PUT /api/todos/:todoId', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUser();
      await testService.createTodo();
    });

    it('should be rejected if request is invalid', async () => {
      const todo = await testService.getTodo();
      const response = await request(app.getHttpServer())
        .put(`/api/todos/${todo.id}`)
        .set('Authorization', 'test')
        .send({
          title: '',
          description: '',
          status: ''
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if todo is not found', async () => {
      const todo = await testService.getTodo();
      const response = await request(app.getHttpServer())
        .put(`/api/todos/${todo.id + 1}`)
        .set('Authorization', 'test')
        .send({
          title: 'test',
          description: 'test',
          status: 'penfing'
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to update todo', async () => {
      const todo = await testService.getTodo();
      const response = await request(app.getHttpServer())
        .put(`/api/todos/${todo.id}`)
        .set('Authorization', 'test')
        .send({
          title: 'test updated',
          description: 'test updated',
          status: 'done'
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.title).toBe('test updated');
      expect(response.body.data.description).toBe('test updated');
      expect(response.body.data.status).toBe('done');
    });
  });

  describe('DELETE /api/todos/:todoId', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
      await testService.createTodo();
    });

    it('should be rejected if todo is not found', async () => {
      const todo = await testService.getTodo();
      const response = await request(app.getHttpServer())
        .delete(`/api/todos/${todo.id + 1}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to remove todo', async () => {
      const todo = await testService.getTodo();
      const response = await request(app.getHttpServer())
        .delete(`/api/todos/${todo.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);
    });
  });

  describe('GET /api/todos', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
      await testService.createTodo();
    });

    it('should be able to search todos', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/todos`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able to search todos by title', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/todos`)
        .query({
          title: 'es',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able to search todos by title not found', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/todos`)
        .query({
          title: 'wrong',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });

    it('should be able to search todos by status', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/todos`)
        .query({
          status: 'ing',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able to search todos by status not found', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/todos`)
        .query({
          status: 'nan',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });

    it('should be able to search todos by description', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/todos`)
        .query({
          description: 'test',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able to search todos by description not found', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/todos`)
        .query({
          description: 'xfghdfhfh',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });

    it('should be able to search todos with page', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/todos`)
        .query({
          size: 1,
          page: 2,
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
      expect(response.body.paging.current_page).toBe(2);
      expect(response.body.paging.total_page).toBe(1);
      expect(response.body.paging.size).toBe(1);
    });
  });
});
