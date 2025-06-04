# Friendship API spec

## Friend request api

Endpoint : POST /api/friend-request

Headers:

- Authorization : Bearer jwt-token

Request Body:

```json
{
  "friendId": 2
}
```

Response Success Body:

```json
{
  "success": true,
  "Message": "Friend request sent."
}
```

Response Error Body:

```json
{
  "success": false,
  "message": "user not found"
}
```

Auth Response Error Body :

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

## Incoming friend request api

Endpoint: GET /api/friend-request/incoming

Headers:
-Authorization : Bearer jwt-token

Response Success Body:

```json
{
  "success": true,
  "data": [
    {
      "id": 2
      "username": "test",
      "requestedAt": "1-4-2025"
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

## Outgoing friend request api

Endpoint: GET /api/friend-request/outgoing

Headers:
-Authorization : Bearer jwt-token

Response Success Body:

```json
{
  "success": true,
  "data": [
    {
      "id": 1
      "username": "test",
      "requestedAt": "1-4-2025"
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

## Accept Friend Request API

Endpoint: PUT /api/friend-request/{request_token}/accept

Headers:

- Authorization : Bearer jwt_token

Response Success Body:

```json
{
  "success": true,
  "message": "Request Friend accepted"
}
```

Response Error Body:

```json
{
  "success": false,
  "message": "opss somthing wrong"
}
```

Auth Response Error Body :

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

## Rejected Friend Request API

Endpoint: PUT /api/firend-request/{request_token}/rejected

Headers:

- Authorization : Bearer jwt_token

Response Success Body:

```json
{
  "success": true,
  "message": "Request Friend rejected"
}
```

Response Error Body:

```json
{
  "success": false,
  "message": "opss somthing wrong"
}
```

Auth Response Error Body :

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

## Get Friend List API

Endpoint: GET /api/friends

Headers:
-Authorization : Bearer jwt_token

Response Success Body

```json
{
  {
    "success": true,
    "data": [
      {
        "id": 1
        "username": "test",
        "requestedAt": "1-4-2025"
      },
      {
        "id": 2
        "username": "test2",
        "requestedAt": "1-4-2025"
      }
    ]
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
