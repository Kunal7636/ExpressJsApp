const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const secretKey = "secretKey"
const connection = require('../../config.js')
const bcrypt = require('bcrypt')
const knex = require('knex')(connection.option)
var flag = 0
var saltRounds = 10
var newPostInfo
var postUserId

/**
 *  For the logic to add post data to DataBase
 */
const middlewareToSet = (req, res, next) => {
  jwt.verify(req.token, secretKey, async (err, authData) => {
    if (err)
      res.status(401).send("UnAuthorized")
    postUserId = authData.foundUser[0].id
  })
  newPostInfo = req.body
  newPostInfo.userId = postUserId
  knex('posts').insert(newPostInfo)
    .then(() => {
      console.log("New Data Inserted")
    })
    .catch((err) => {
      console.log(err)
      throw err
    })
  next()
}

/**
 * To verify token
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
 *  To add data for post  and then display that Data added SuccessFully
 */
router.post('/posts', verifyToken, middlewareToSet, function (req, res) {
  res.status(200).send("Data added")
})
var getMyPosts
/**
 *  For the logic to modify post and add to DataBase
 */
const middlewareToModify = (req, res, next) => {
  postId = req.params.id
  newPostInfo = req.body
  jwt.verify(req.token, secretKey, async (err, authData) => {
    if (err)
      res.status(401).send("UnAuthorized")
    getMyPosts = await knex('posts').select('*').where({ id: postId }).andWhere({ userId: authData.foundUser[0].id }).update(newPostInfo)
    if (getMyPosts == 1) {
      next()
    } else {
      res.status(404).send("Record not found")
    }
  })
}

router.patch('/posts/:id', verifyToken, middlewareToModify, function (req, res) {
  res.status(200).send("We have updated the post")
})

module.exports = router
