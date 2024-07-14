# Todo API Spec

## Create Todo

Endpoint : POST / api/todo

Headers :

- Authorization: token

Request Body :

```json
{
  "title": "Backend API",
  "description": "Create API For Todo APP" ,
  "status": "pending
}
```

Response Body (Success):

```json
{
  "data": {
    "id": 1,
    "title": "Backend API",
    "description": "Create API For Todo APP" ,
    "status": "pending
  }
}
```

Response Body (Failed):

```json
{
  "errors": "error"
}
```

## GET Todo

Endpoint : GET / api/todo/:TodoId

Headers :

- Authorization: token

Response Body (Success):

```json
{
  "data": {
    "id": 1,
    "title": "Backend API",
    "description": "Create API For Todo APP" ,
    "status": "pending
  }
}
```

Response Body (Failed):

```json
{
  "errors": "error"
}
```

## Update Todo

Endpoint : PUT / api/todo/:TodoId

Headers :

- Authorization: token

Request Body :

```json
{
  "title": "Backend API",
  "description": "Create API For Todo APP" ,
  "status": "pending
}
```

Response Body (Success):

```json
{
  "data": {
    "id": 1,
    "title": "Backend API",
    "description": "Create API For Todo APP" ,
    "status": "pending
  }
}
```

Response Body (Failed):

```json
{
  "errors": "error"
}
```

## Remove Todo

Endpoint : DELETE / api/todo/:TodoId

Headers :

- Authorization: token

Response Body (Success):

```json
{
  "data": true
}
```

Response Body (Failed):

```json
{
  "errors": "error"
}
```

## Search Todo

Endpoint : GET / api/todo

Headers :

- Authorization: token

Query Params :

- name: string, Todo title pr description, optional
- phone: string
- status: string
- page: number, default 1
- size: number, default 10

Response Body (Success):

```json
{
  "data": [
    {
      "id": 1,
      "title": "Backend API",
      "description": "Create API For Todo APP",
      "status": "pending"
    }
  ],
  "paging": {
    "current_page": 1,
    "total_page": 10,
    "size": 10
  }
}
```

Response Body (Failed):

```json
{
  "errors": "error"
}
```
