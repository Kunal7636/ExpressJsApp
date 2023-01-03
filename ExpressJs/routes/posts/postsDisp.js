var express = require('express')
var router = express.Router()
const jwt = require('jsonwebtoken')
const secretKey = "secretKey"
const connection = require('../../config.js')
var knex = require('knex')(connection.option)

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

var getMyPosts
/**
 * To get the data from database
 */
const sendData = async (req, res, next) => {
  jwt.verify(req.token, secretKey, async (err, authData) => {
    if (err)
      res.status(401).send("UnAuthorized")
    getMyPosts = await knex('posts').select('*').where({ userId: authData.foundUser[0].id })
    res.status(200).send(getMyPosts)
  })
};

/**
* To send all posts data of the user
*/
router.get('/posts', verifyToken, sendData, (req, res) => {
})


/**
 * Middleware to maintain the logic for dispaying data for a required user
 */
var dWithId
const middleware = async (req, res, next) => {
  var givenId = req.params['id']
  dWithId = await knex('posts').select('*').where({ id: givenId })

  if (dWithId.length == 0) res.status(404).send("Sorry can't find")
  else
    next()
};

/**
 * To verify right post data is being accessed and display 
 */
router.get('/posts/:id', middleware, verifyToken, function (req, res) {
  jwt.verify(req.token, secretKey, (err, authData) => {
    if (err)
      res.status(401).send("UnAuthorized")
    if (dWithId[0].userId == JSON.stringify(authData.foundUser[0].id)) {
      res.status(200).send({
        message: "Accessed post",
        data: dWithId
      })
    } else { res.status(401).send("UnAuthorized to access") }
  })
})

module.exports = router


