### URL
http://192.168.0.46:3000/api/


### Users API
path: http://192.168.0.46:3000/api/users

#### Créer un compte
méthode: POST

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

#### Se connecter à son compte
méthode: POST

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

#### Avoir la liste des amis
méthode: GET

path: http://192.168.0.46:3000/api/users/friends

headers:
```js
headers = {
    "x-access-token": "eyJhbGciOiJIUzI1NiIs...", //YOUR TOKEN
}
```

#### Ajouter un ami
méthode : POST

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

#### Supprimmer un ami
méthode : POST

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

#### Avoir la liste de tout les utilisateurs avec leurs infos publiques
méthode : GET

path: http://192.168.0.46:3000/api/users/list

headers:
```js
headers = {
    "x-access-token": "eyJhbGciOiJIUzI1NiIs...", //YOUR TOKEN
}
```

#### Avoir les infos publique d'un utilisateur
méthode : GET

path: http://192.168.0.46:3000/api/users/:username
- remplacer **:username** par le username

headers:
```js
headers = {
    "x-access-token": "eyJhbGciOiJIUzI1NiIs...", //YOUR TOKEN
}
```

### Messages API
path: http://192.168.0.46:3000/api/messages

#### Envoyer un message à un ami
méthode : POST

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

#### Avoir tout les messages privés reçus et envoyés
méthode : GET

path: http://192.168.0.46:3000/api/messages/friendmessages

headers:
```js
headers = {
    "x-access-token": "eyJhbGciOiJIUzI1NiIs...", //YOUR TOKEN
}
```
#### Envoyer un message dans un groupe
méthode : POST

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

#### Avoir tout les messages d'un groupe
méthode : GET

path: http://192.168.0.46:3000/api/messages/roommessages/:roomName
- remplacer **:roomName** par le nom du groupe

headers:
```js
headers = {
    "x-access-token": "eyJhbGciOiJIUzI1NiIs...", //YOUR TOKEN
}
```

### Rooms API
path: http://192.168.0.46:3000/api/rooms

#### Create a room
méthode : POST

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

#### Avoir les infos d'une room
méthode : GET

path: http://192.168.0.46:3000/api/room/:roomName
- remplacer **:roomName** par le nom du groupe

headers:
```js
headers = {
    "x-access-token": "eyJhbGciOiJIUzI1NiIs...", //YOUR TOKEN
}
```

#### Ajouter un utilisateur au groupe
méthode : POST

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

#### Supprimmer un utilisateur du groupe
méthode : POST

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

#### Supprimmer un groupe
méthode : POST

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