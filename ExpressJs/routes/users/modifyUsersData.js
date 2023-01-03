const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const secretKey = "secretKey"
const connection = require('../../config.js')
const passHash = require('../passwordHashing.js')
const knex = require('knex')(connection.option)
var newUserInfo


/**
 *  For the logic to add data to DataBase
 */
const middlewareToSet = (req, res, next) => {
  newUserInfo = req.body
  newUserInfo.password = passHash.generateHash(newUserInfo.password)
  knex('users').insert(newUserInfo)
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
router.post('/users', middlewareToSet, function (req, res) {
  res.status(200).send("Data added")
})

module.exports = router





