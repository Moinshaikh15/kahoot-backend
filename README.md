# kahoot-backend

## Endpoints
 ### Auth
 ```
   POST   /auth/signup
   POST   /auth/login
   POST   /auth/token
```
### kahoot
``` 
POST /kahoot/new - add new kahoot
GET /kahoot - get all kahoots
GET /kahoot/:id - get kahoot by id
POST /kahoot/:id/edit -edit kahoot by id
DELETE /kahoot/:id -delete kahoot by if
