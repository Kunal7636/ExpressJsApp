const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const secretKey = "secretKey"
const connection = require('../../config.js')
const bcrypt = require('bcrypt')
const knex = require('knex')(connection.option)
var flag = 0
var saltRounds = 10
var newCommentsInfo

/**
 *  For the logic to add data to DataBase
 */
const middlewareToSet = (req, res, next) => {
  newCommentsInfo = req.body
  newCommentsInfo.postId = req.params['id']
  console.log(newCommentsInfo)
  knex('comments').insert(newCommentsInfo)
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
 *  To add data and then display that Data added SuccessFully
 */
router.post('/posts/:id/comments', middlewareToSet, function (req, res) {
  res.status(200).send("Data added")
})

var getMyPosts
/**
 *  For the logic to add data to DataBase
 */

const middlewareToModify = (req, res, next) => {
  commentId = req.params.id
  newCommentsInfo = req.body
  jwt.verify(req.token, secretKey, async (err, authData) => {
    if (err)
      res.status(401).send("UnAuthorized")

    var postId = await knex('comments').select('postId').where({ id: commentId })
    var userId = await knex('posts').select('userId').where({ id: postId[0].postId })
    if (userId[0].userId == authData.foundUser[0].id) {
      getMyComments = await knex('comments').select('*').where({ id: commentId }).update(newCommentsInfo)
      if (getMyComments == 1) {
        next()
      } else {
        res.status(404).send("Record not found")
      }
    }
  })
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

router.patch('/posts/:id/comments', verifyToken, middlewareToModify, function (req, res) {
  res.status(200).send("You have modified the comment")
})

/**
 * To Delete The Comment
 */

const middlewareToDelete = (req, res, next) => {
  commentId = req.params.id
  jwt.verify(req.token, secretKey, async (err, authData) => {
    if (err)
      res.status(401).send("UnAuthorized")

    var postId = await knex('comments').select('postId').where({ id: commentId })
    var userId = await knex('posts').select('userId').where({ id: postId[0].postId })
    if (userId[0].userId == authData.foundUser[0].id) {
      getMyComments = await knex('comments').select('*').where({ id: commentId }).delete()
      if (getMyComments == 1) {
        next()
      } else {
        res.status(404).send("Record not found")
      }
    }
  })
}

router.delete('/posts/:id/comments', verifyToken, middlewareToDelete, function (req, res) {
  res.status(200).send("Data deleted")
})


module.exports = router
