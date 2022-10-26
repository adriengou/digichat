### URL
http://192.168.0.46:3000/api/


### Users API
path: http://192.168.0.46:3000/api/users

#### Register an account
method: POST

path: http://192.168.0.46:3000/api/users/register

headers:
```js
headers = {
    "Content-Type": "application/json"
}
```

body:
```js
body = {
    "username": "Jarred87",
    "email": "Candace.Rogahn@yahoo.com",
    "password": "DJ39vSnWBFG1RPW",
    "avatar": "http://placeimg.com/640/480",
    "country": "Ecuador",
    "city": "East Eliasmouth",
    "street": "1021 Madelyn Trafficway",
    "zipCode": "916",
    "phoneNumber": "205-899-3719",
    "dialCode": "+213",
    "firstName": "Mallie",
    "lastName": "Mohr",
    "skills": ["optical"]
}
```

#### Login to account
method: POST

path: http://192.168.0.46:3000/api/users/login

headers:
```js
headers = {
    "Content-Type": "application/json"
}
```

body:
```js
body = {
    "email": "Candace.Rogahn@yahoo.com",
    "password": "DJ39vSnWBFG1RPW",
}
```

#### List your friends
method: GET

path: http://192.168.0.46:3000/api/users/friends

headers:
```js
headers = {
    "x-access-token": "eyJhbGciOiJIUzI1NiIs...", //YOUR TOKEN
}
```

#### Add a friend
method : POST

path: http://192.168.0.46:3000/api/users/addfriend

headers:
```js
headers = {
    "x-access-token": "eyJhbGciOiJIUzI1NiIs...", //YOUR TOKEN
    "Content-Type": "application/json"
}
```

body:
```js
body = {
    "friendName": "Tevin_Hermiston89"
}
```

#### Remove a friend
method : POST

path: http://192.168.0.46:3000/api/users/removefriend

headers:
```js
headers = {
    "x-access-token": "eyJhbGciOiJIUzI1NiIs...", //YOUR TOKEN
    "Content-Type": "application/json"
}
```

body:
```js
body = {
    "friendName": "Tevin_Hermiston89"
}
```

#### Get a list of all users public information
method : GET

path: http://192.168.0.46:3000/api/users/list

headers:
```js
headers = {
    "x-access-token": "eyJhbGciOiJIUzI1NiIs...", //YOUR TOKEN
}
```

#### Get public information of a specific user
method : GET

path: http://192.168.0.46:3000/api/users/:username
- replace **:username** by the username

headers:
```js
headers = {
    "x-access-token": "eyJhbGciOiJIUzI1NiIs...", //YOUR TOKEN
}
```

### Messages API
path: http://192.168.0.46:3000/api/messages

#### Send a message to a friend
method : POST

path: http://192.168.0.46:3000/api/messages/addfriendmessage

headers:
```js
headers = {
    "x-access-token": "eyJhbGciOiJIUzI1NiIs...", //YOUR TOKEN
    "Content-Type": "application/json"
}
```

body:
```js
body = {
    "friendName": "Tevin_Hermiston89",
    "content":"slt sa va"
}
```

#### Get all received friend messages
method : GET

path: http://192.168.0.46:3000/api/messages/friendmessages

headers:
```js
headers = {
    "x-access-token": "eyJhbGciOiJIUzI1NiIs...", //YOUR TOKEN
}
```
#### Send a message to a room
method : POST

path: http://192.168.0.46:3000/api/messages/addroommessage

headers:
```js
headers = {
    "x-access-token": "eyJhbGciOiJIUzI1NiIs...", //YOUR TOKEN
    "Content-Type": "application/json"
}
```

body:
```js
body = {
    "roomName": "room 1",
    "content":"slt sa va"
}
```

#### Get all received room messages
method : GET

path: http://192.168.0.46:3000/api/messages/roommessages/:roomName
- replace **:roomName** by the room's name

headers:
```js
headers = {
    "x-access-token": "eyJhbGciOiJIUzI1NiIs...", //YOUR TOKEN
}
```

### Rooms API
path: http://192.168.0.46:3000/api/rooms

#### Create a room
method : POST

path: http://192.168.0.46:3000/api/rooms/create

headers:
```js
headers = {
    "x-access-token": "eyJhbGciOiJIUzI1NiIs...", //YOUR TOKEN
    "Content-Type": "application/json"
}
```

body:
```js
body = {
    "roomName":"room 1"
}
```

#### Get information of a room
method : GET

path: http://192.168.0.46:3000/api/room/:roomName
- replace **:roomName** by the room's name

headers:
```js
headers = {
    "x-access-token": "eyJhbGciOiJIUzI1NiIs...", //YOUR TOKEN
}
```

#### Add a user to the room
method : POST

path: http://192.168.0.46:3000/api/rooms/adduser

headers:
```js
headers = {
    "x-access-token": "eyJhbGciOiJIUzI1NiIs...", //YOUR TOKEN
    "Content-Type": "application/json"
}
```

body:
```js
body = {
    "roomName":"room 1",
    "username":"Tevin_Hermiston89"
}
```

#### Remove a user from the room
method : POST

path: http://192.168.0.46:3000/api/rooms/removeuser

headers:
```js
headers = {
    "x-access-token": "eyJhbGciOiJIUzI1NiIs...", //YOUR TOKEN
    "Content-Type": "application/json"
}
```

body:
```js
body = {
    "roomName":"room 1",
    "username":"Tevin_Hermiston89"
}
```

#### Remove a user from the room
method : POST

path: http://192.168.0.46:3000/api/rooms/delete

headers:
```js
headers = {
    "x-access-token": "eyJhbGciOiJIUzI1NiIs...", //YOUR TOKEN
    "Content-Type": "application/json"
}
```

body:
```js
body = {
    "roomName":"room 1",
}
```