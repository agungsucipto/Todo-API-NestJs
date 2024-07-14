
## Deployment

To deploy this project run

```bash
  npm install
```

setup .env file

```bash
  DATABASE_URL="mysql://root:@localhost:3306/todo"
```

migrate the database
```bash
  npx prisma migrate dev
```

init prisma client
```bash
  npx prisma generate
```

test unit
```bash
  npm run test
```

build distribution
```bash
  npm run build
```

run production
```bash
  npm run start:prod
```

use this endpoint
```bash
  UserController {/api/users}
- /api/users, POST
- /api/users/login, POST
- /api/users/current, GET
- /api/users/current, PATCH
- /api/users/current, DELETE
TodoController {/api/todos}
- /api/todos, POST
- /api/todos/:TodoId, GET
- /api/todos/:TodoId, PUT
- /api/todos/:TodoId, DELETE
- /api/todos, GET
```

lookup to directory doc, to read documentation of api
