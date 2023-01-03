const express = require('express')
const app = express()
const mysql = require('mysql2')
const dataLoad = require('./dataStorage/readWriteData.js')
const dispData = require('./routes/users/usersDataDisp.js')
const modifyData = require('./routes/users/modifyUsersData.js')
const authentication = require('./routes/users/userAuthentication.js')
const modifyPost = require('./routes/posts/modifyPosts.js')
const postsDisp = require('./routes/posts/postsDisp.js')
const modifyComments = require('./routes/comments/modifyComments.js')
const commentsDisp = require('./routes/comments/commentsDataDisp.js')
const connection = require('./config.js')

app.use(express.json())
connection.createMytables()

//dataLoad.storeData() // comment as user will enter data through api calling

app.use('/', dispData)
app.use('/', modifyData)
app.use('/', authentication)
app.use('/', modifyPost)
app.use('/', postsDisp)
app.use('/', modifyComments)
app.use('/', commentsDisp)

app.listen(3030, function () {
  console.log('server is running on port 3030')
})

module.exports = { app }