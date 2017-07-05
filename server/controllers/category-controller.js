const mongoose = require('mongoose')
const Thread = mongoose.model('Thread')
const Answer = mongoose.model('Answer')
const Category = mongoose.model('Category')
const errorHandler = require('../utilities/error-handler')

module.exports = {
  addGet: (req, res) => {
    res.render('categories/add')
  },
  addPost: (req, res) => {
    let categoryReq = req.body

    if (categoryReq.name === '') {
      res.locals.globalError = 'Please Enter Name of category!'
      res.render('categories/add', categoryReq)
      return
    }

    Category.create(categoryReq).then(() => {
      res.redirect('/')
    })
      .catch(err => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.render('categories/add', categoryReq)
      })
  },
  all: (req, res) => {
    Category.find().then(categories => {
      res.render('categories/list', {categories: categories})
    })
  },
  threadsByCategory: (req, res) => {
    let name = req.params.name
    let pageSize = 20
    let page = parseInt(req.query.page) || 1

    Category.findOne({'name': name}).then(category => {
      Thread.find({category: category._id})
      .sort('-lastAnswer')
      .skip((page - 1) * pageSize)
      .limit(pageSize).then(threads => {
        for (let thread of threads) {
          if (thread.likedBy.indexOf(req.user._id) >= 0) {
            thread.likeAllowed = false
          } else {
            thread.likeAllowed = true
          }
        }
        res.render('categories/threadsByCategories', {threads: threads})
      })
    })
  },
  deletePost: (req, res) => {
    let id = req.params.id
    Category.findByIdAndRemove(id).then(category => {
      Thread.find({category: category}).then(threads => {
        for (let thread of threads) {
          Answer.remove({thread: thread}).then(() => {
            thread.remove()
          })
        }
        res.redirect('/')
      })
    })
  }
}
