var express = require('express')
var router = express.Router()
const myData = require('../../dataStorage/readWriteData.js')
const jwt = require('jsonwebtoken')
const secretKey = "secretKey"
const connection = require('../../config.js')
var knex = require('knex')(connection.option)

/**
 * To get the user data from database
 */
const sendData = async (req, res, next) => {
  userData = await knex('users').select('*');
  next()
};

/**
* To send all users data
*/
router.get('/users', sendData, (req, res) => {
  res.status(200).send(userData)
})


/**
 * Middle ware to maintain the logic for dispaying data for a required user
 */
var dWithId
const middleware = async (req, res, next) => {
  var givenId = req.params['id']
  dWithId = await knex('users').select('*').where({ id: givenId })
  if (dWithId.length == 0) res.status(404).send("Sorry can't find")
  next()
};

/**
 * To verify the token
 */
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization']
  if (!bearerHeader)
    res.status(403).send("Forbidden")

  const bearer = bearerHeader.split(" ")
  req.token = bearer[1]
  console.log("Middleware:: Verified Token")
  next()
}

/**
 * To verify right data is being accessed
 */
router.get('/users/:id', middleware, verifyToken, function (req, res) {
  jwt.verify(req.token, secretKey, (err, authData) => {
    if (err)
      res.status(401).send("UnAuthorized")
    if (dWithId[0].id == JSON.stringify(authData.foundUser[0].id)) {
      res.status(200).send({
        message: "Accessed profile",
        data: authData
      })
    } else { res.status(401).send("UnAuthorized to access") }
  })
})

module.exports = router


