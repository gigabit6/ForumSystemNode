const home = require('./home-controller')
const users = require('./users-controller')
const threads = require('./thread-controller')
const answers = require('./answer-controller')
const categories = require('./category-controller')

module.exports = {
  home: home,
  users: users,
  threads: threads,
  answers: answers,
  categories: categories
}
