const encryption = require('../utilities/encryption')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Answer = mongoose.model('Answer')
const Thread = mongoose.model('Thread')
const errorHandler = require('../utilities/error-handler')

module.exports = {
  registerGet: (req, res) => {
    res.render('users/register')
  },
  registerPost: (req, res) => {
    let reqUser = req.body
    // Add validations!

    let salt = encryption.generateSalt()
    let hashedPassword = encryption.generateHashedPassword(salt, reqUser.password)

    User.create({
      username: reqUser.username,
      firstName: reqUser.firstName,
      lastName: reqUser.lastName,
      salt: salt,
      hashedPass: hashedPassword
    }).then(user => {
      req.logIn(user, (err, user) => {
        if (err) {
          res.locals.globalError = err
          res.render('users/register', user)
        }

        res.redirect('/')
      })
    })
  },
  loginGet: (req, res) => {
    res.render('users/login')
  },
  loginPost: (req, res) => {
    let reqUser = req.body
    User
      .findOne({ username: reqUser.username }).then(user => {
        if (!user) {
          res.locals.globalError = 'Invalid user data'
          res.render('users/login')
          return
        }

        if (!user.authenticate(reqUser.password)) {
          res.locals.globalError = 'Invalid user data'
          res.render('users/login')
          return
        }

        req.logIn(user, (err, user) => {
          if (err) {
            res.locals.globalError = err
            res.render('users/login')
          }

          res.redirect('/')
        })
      })
  },
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  },
  profileGet: (req, res) => {
    let username = req.params.username
    User.findOne({username: username}).then((user) => {
      Thread.find({author: user._id}).then(threads => {
        Answer.find({author: user._id}).then(answers => {
          res.render('users/profile', {threads: threads, answers: answers})
        })
      })
    })
  },
  list: (req, res) => {
    User.find({ 'roles': {'$ne': 'Admin'} }).then(users => {
      res.render('users/list', {users: users})
    })
  },
  addAdmin: (req, res) => {
    let id = req.params.id
    User.findById(id).then(user => {
      user.roles.push('Admin')
      user.save().then(() => {
        res.redirect('/')
      })
    })
  },
  blockUser: (req, res) => {
    let id = req.params.id
    User.findById(id).then(user => {
      user.isBlocked = true
      user.save().then(() => {
        res.redirect('/admins/all')
      })
    })
  }
}
