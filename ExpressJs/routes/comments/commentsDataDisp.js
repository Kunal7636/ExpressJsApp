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

/**
 * Middle ware to maintain the logic for dispaying data for a required user
 */
var dWithId
var postId
const middleware = async (req, res, next) => {
  postId = req.params['id']

  dWithId = await knex('posts').select('*').where({ id: postId })
  if (dWithId.length == 0) res.status(404).send("Sorry can't find")
  else
  next()
};

/**
 * To verify right data is being accessed
 */
router.get('/posts/:id/comments', middleware, verifyToken, function (req, res) {
  jwt.verify(req.token, secretKey, async (err, authData) => {
    if (err)
      res.status(401).send("UnAuthorized")
    if (dWithId[0].userId == JSON.stringify(authData.foundUser[0].id)) {
      var commentsData = await knex('comments').select('*').where({ postId: postId })
      res.status(200).send({
        data: commentsData
      })
    } else { res.status(401).send("UnAuthorized to access") }
  })
})

module.exports = router


