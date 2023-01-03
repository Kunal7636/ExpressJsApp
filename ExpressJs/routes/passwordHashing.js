
const express = require('express')
const bcrypt = require('bcrypt')
var flag = 0
var Rounds = 10
var newUserInfo

function generateHash(password) {
    password = bcrypt.hashSync(password, Rounds)
    return password
}
async function compareHash(password, passwordFromDb) {
    const match = await bcrypt.compare(password, passwordFromDb);
    return match

}

module.exports = {
    generateHash,
    compareHash
}