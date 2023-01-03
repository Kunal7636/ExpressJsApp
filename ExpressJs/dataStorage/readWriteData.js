const express = require('express')
const app = express()
app.use(express.json())
const fileSystem = require('fs')
const path = require('path')
const dirPath = path.join(__dirname, '../../Samples')
const connection = require('../config.js')
const knex = require('knex')(connection.option)

let userData = []
let postData = []
let commentsData = []

/**
 * To get data from json file to database if table is empty
 */
function getData() {
  return new Promise(async function (resolve, reject) {
    await fileSystem.readFile(
      `${dirPath}/users.json`,
      'utf8',
      (err, jsonString) => {
        if (err) {
          console.log('Did not read the file:', err)
          return reject(err)
        } else {
          return resolve(jsonString)
        }
      }
    )
  })
}

/**
 * To write data into DataBase
 */
async function storeData() {

  var rows = await knex('users').count('*')

  if (rows[0]['count(*)'] == 0) {
    getData().then((users) => {
      var allData = JSON.parse(users)
      for (var i in allData) {
        userData.push(allData[i])
      }
      knex('users').insert(userData)
        .then(() => {
          console.log("Data Inserted")
        })
        .catch((err) => {
          console.log(err)
          throw err
        })
        .finally(() => {
          knex.destroy()
        })
      console.log('dataSaved')
    })
  }
}
module.exports = {
  storeData,
  userData
}
