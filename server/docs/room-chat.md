# Room chat API spec

## Create new room Api

Endpoint : POST /api/rooms

Headers:

- Authorization : Bearer jwt_token

Request Body :

```json
{
  "name": "test toom name",
  "is_privated": true
}
```

Response Success Body :

```json
{
  "success": true,
  "message": "room is created"
}
```

Response Error Body :

```json
{
  "success": false,
  "message": "field error",
  "data": {
    "name": ["name is required"]
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

## List all rooms Api

Endpoint : GET /api/rooms

Headers :

- Authorization : Bearer jwt_token

Response Success Body :

```json
{
  "success": true,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "test name",
      "last_message": "test message",
      "last_message_created_at": "1-3-2025"
    },
    {
      "id": 2,
      "name": "test room",
      "last_message": "test message",
      "last_message_created_at": "1-3-2025"
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

## Get details specific rooms api (include member)

Endpoint : GET /api/rooms/{room_id}

Headers:

- Authorization : Bearer jwt_token

Response Success Body :

```json
{
  "success": true,
  "data": {
    "id": 1
    "name": "test name",
    "member": [
      {
        "id": 1,
        "name": "testname"
      },
      {
        "id": 2,
        "name": "testname"
      }
    ]
  }
}
```

Response Error room id not exist :

```json
{
  "success": false,
  "message": "room not found"
}
```

Auth Response Error Body :

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

## Get Room Messages Api

Endpoint : GET /api/rooms/{room_id}/messages

Headers:

- Authorization : Bearer jwt_token

Response Success Body :

```json
{
  "success": true,
  "data": [
    {
      "message_id": 1,
      "content": "this is content",
      "sender_name": "bangsyir",
      "created_at": "1-2-2025"
    }
  ]
}
```

Response Error room id not exist :

```json
{
  "success": false,
  "message": "room not found"
}
```

Auth Response Error Body :

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

## Send Message to room Api

Endpoint : POST /api/rooms/{room_id}/

Headers:

- Authorization : Bearer jwt_token

Request Body :

```json
{
  "content": "this message from room"
}
```

Response Success Body :

```json
{
  "success": true,
  "message": "messages sended"
}
```

Response Error Input Body :

```json
{
  "success": false,
  "errors": {
    "content": ["content is required"]
  }
}
```

Response Error room id not exist :

```json
{
  "success": false,
  "message": "room not found"
}
```

Auth Response Error Body :

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

## Generate Invitation token Api

Endpoint : POST /api/rooms/{room_id}/invitation

Headers :

- Authorization : Bearer jwt_token

Response Success Body :

```json
{
  "success": true,
  "message": "success create invitaion link"
}
```

Response Error room id not exist :

```json
{
  "success": false,
  "message": "room not found"
}
```

Auth Response Error Body :

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

## Join Room From Invitation

Endpoint : POST /api/rooms/invitaions/{token}/join

Update Invitation table used_by

Headers :

- Authorization : Bearer jwt_token

Response Success Body :

```json
{
  "success": true,
  "message": "Successfull, You are joined"
}
```

Response Error token not exist :

```json
{
  "success": false,
  "message": "Token not found"
}
```

Auth Response Error Body :

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

## Update Read Status for Room

Endpoint : POST /api/rooms/{room_id}/read

Headers:

- Authorization : Bearer jwt_token

Response Success body :

```json
{
  "success": true,
  "message": "Success read all chat"
}
```

Response Error room id not exist :

```json
{
  "success": false,
  "message": "room not found"
}
```

Auth Response Error Body :

```json
{
  "success": false,
  "message": "Unauthorized"
}
```
