const option = {
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'password',
        database: 'knexdb'
    },
}

const knex = require('knex')(option)
function createUserTable() {
    knex.schema.hasTable('users').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('users', function (table) {
                table.increments('id').primary()
                table.string('name')
                table.string('username').unique().notNullable()
                table.string('password').notNullable()
                table.string('email').unique().notNullable()
                table.string('address')
                table.string('phone').unique().notNullable()
                table.string('website')
                table.string('company')
            })
        }
    })
        .then(() => {
            console.log("table created")
        })
        .catch((err) => {
            console.log(err)
            throw err
        })
        .finally(() => {
        })
}
function createPostTable() {
    knex.schema.hasTable('posts').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('posts', function (table) {
                table.integer('userId').unsigned().notNullable(),
                    table.foreign('userId').references('id').inTable('users')
                table.increments('id').primary()
                table.string('title')
                table.string('body')
            })
        }
    })
        .then(() => {
            console.log("Posts table created")
        })
        .catch((err) => {
            console.log(err)
            throw err
        })
        .finally(() => {
        })
}

function createCommentsTable() {
    knex.schema.hasTable('comments').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('comments', function (table) {
                table.integer('postId').unsigned().notNullable(),
                    table.foreign('postId').references('id').inTable('posts')
                table.increments('id')
                table.string('name')
                table.string('email')
                table.string('body')
            })
        }
    })
        .then(() => {
            console.log("Comments table created")
        })
        .catch((err) => {
            console.log(err)
            throw err
        })
        .finally(() => {
            knex.destroy()
        })
}

function createMytables() {
    createUserTable()
    createPostTable()
    createCommentsTable()

}


module.exports = { createMytables, option }