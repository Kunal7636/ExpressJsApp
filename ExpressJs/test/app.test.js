const apiRequest = require('supertest');
const { app } = require('../app');

let token = ''
const loginDetails = {
  "username": "Bret",
  "password": "$2b$10$EsnuEAwy.pVpmHnDz53Ly.BEx/F5ByeBe6fsbK72J3imI020NvAFK"
}


//Login into application given valid credentials
describe("login ino the application and check the api works properly", () => {
  test("post api to get token /users/login", async () => {
    const response = await apiRequest(app).post('/users/login')
      .send(loginDetails)
    token = response.body.token;
  })
});


//1. should be able to retrieve my user entity

userId = 1

describe("get logged in user information", () => {
  test("get user information by providing the id /users/1 ", async () => {
    const response = await apiRequest(app).get('/users/1').set('Authorization', `Token ${token}`)
    expect(response.status).toBe(200)
    expect(response.body.data.foundUser[0].id).toEqual(userId)
  })
})


//2. should not be able to retrieve a different user entity and return appropriate error code

const apiErrorMessage = "UnAuthorized to access";
describe("You cannot access other user's information", () => {
  test("get /users/2 ", async () => {
    await apiRequest(app).get('/users/2')
      .set('Authorization', `Token ${token}`)
      .expect(401).then(response => {
        expect((response.text)).toEqual(apiErrorMessage)
      })
  })
})

//3. should not be able to retrieve an entity if not authenticated and return appropriate error code

const errorMessage = "Forbidden";
describe("access information without login", () => {
  test("get /users/1", async () => {
    const response = await apiRequest(app).get('/users/1')
    expect(response.status).toBe(403)
    expect((response.text)).toEqual(errorMessage)
  })
})