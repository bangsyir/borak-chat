# Direct Messaged API spec

## Retrive Direct Messages API

Endpoint: GET /api/messages/direct?with={user_id}

Headers:
-Authorization : Bearer jwt_token

Response Success Body :

```json
{
  "success": true,
  "data": [
    {
      "user_id": 1,
      "content": "test message",
      "createdAt": "1-3-2025"
    },
    {
      "user_id": 2,
      "content": "test message",
      "createdAt": "1-3-2025"
    }
  ]
}
```

Auth Response Error Body :

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

## Send direct message Api

Endpoint: POST /api/messages/direct

Headers:
-Authorization : Bearer jwt_token

Request Body:

```json
{
  "content": "test message",
  "receiver_id": 3
}
```

Respose Success Body :

```json
{
  "success": true,
  "message": "success",
  "data": {
    "content": "test message",
    "receiver_id": 3
  }
}
```

Auth Response Error Body :

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

## Mark a direct message as read API

Endpoint : PUT /api/messages/direct/{message_id}/read
Headers :

- Authorization : Bearer jwt_token

Response Success Body :

```json
{
  "success": true,
  "message": "success updated read message"
}
```

Response Error Body :

```json
{
  "success": false,
  "message": "message is not found"
}
```

Auth Response Error Body :

```json
{
  "success": false,
  "message": "Unauthorized"
}
```
