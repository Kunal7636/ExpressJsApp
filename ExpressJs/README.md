## Goal

The goal of this project is to build a scalable ExpressJS application that allows users to post and comment on posts. 

## Instructions

Created a REST API ExpressJS application that is connected to a MySQL database. 

### Endpoints

The application exposed the following endpoints:

#### Unauthenticated
- POST /users to create a user 
- /users to fetch all users 
- /login to return an authentication token for the user. (passwords should NOT be stored in plaintext)

#### Authenticated

The following endpoints all process data relevant to the sender's user id

##### Fetching Data

- GET /posts to fetch all posts by a sender    
- GET /posts/:id to fetch a single post made by a sender 
- GET /posts/:id/comments to fetch all comments about a post 

##### Adding Data

- POST /posts to create a new post 
- POST /posts/:id/comments to add a new comment to a post 

##### Updating Data

- PATCH /posts/:id to update a post
- PATCH /posts/:id/comments to update a comment 

##### Deleting Data

- DELETE /posts/:id/comments to delete a comment 


## Execution of the files
For excecution of the file
Go to terminal and write : "node app.js"
The file will run on port 3030
Then hit the above mentioned api to get response
