const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const connection = require('../../config.js')
const passHash = require('../passwordHashing.js')
var knex = require('knex')(connection.option)
const secretKey = "secretKey"
const bcrypt = require('bcrypt')

/**
 *  To get token for the id
 */
const middlewareForAuthentication = async (req, res, next) => {
    var username = req.body.username
    var password = JSON.stringify(req.body.password)
    var foundUser
    var passwordFromDb = await knex('users').select('password').where({ username: username })
    passwordFromDb = JSON.stringify(passwordFromDb[0].password)
    const match = passHash.compareHash(password, passwordFromDb);
    if (match) {
        foundUser = await knex('users').select('*').where({ username: username })
    }
    if (foundUser.length == 0) res.status(404).send("Sorry can't find either email or password is not correct")
    jwt.sign({ foundUser }, secretKey, { expiresIn: '30000s' }, (err, token) => {
        res.status(200).send({ token: token })
    })
    next()
}

/**
 *  To get login details 
 */
router.post('/users/login', middlewareForAuthentication, function (req, res) {
})


module.exports = router