const mongoose = require('mongoose')
const Thread = mongoose.model('Thread')
const Answer = mongoose.model('Answer')
const User = mongoose.model('User')
const Category = mongoose.model('Category')
const errorHandler = require('../utilities/error-handler')

module.exports = {
  addGet: (req, res) => {
    Category.find().then((categories) => {
      res.render('threads/add', {categories: categories})
    })
  },
  addPost: (req, res) => {
    let reqThread = req.body

    if (reqThread.title === '' || reqThread.description === '') {
      res.locals.globalError = 'Please Enter Title & Description!'
      res.render('threads/add', reqThread)
      return
    }

    reqThread.author = req.user._id
    Thread.create(reqThread).then(thread => {
      res.redirect('/')
    })
      .catch(err => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.render('thread/add', reqThread)
      })
  },
  listGet: (req, res) => {
    let pageSize = 20
    let page = parseInt(req.query.page) || 1

    Thread
    .find()
    .sort('-lastAnswer')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .populate('category').then(threads => {
      for (let thread of threads) {
        if (thread.likedBy.indexOf(req.user._id) >= 0) {
          thread.likeAllowed = false
        } else {
          thread.likeAllowed = true
        }
      }
      res.render('threads/list', {
        threads: threads,
        hasPrevPage: page > 1,
        hasNextPage: threads.length > 0,
        prevPage: page - 1,
        nextPage: page + 1 })
    })
  },
  detailsGet: (req, res) => {
    let id = req.params.id
    Thread.findById(id).populate('answers category').then(thread => {
      thread.views += 1
      thread.save().then((thread) => {
        res.render('threads/details', thread)
      })
    })
  },
  editGet: (req, res) => {
    let id = req.params.id
    Thread.findById(id).then(thread => {
      res.render('threads/edit', thread)
    })
  },
  editPost: (req, res) => {
    let id = req.params.id
    let updatedThread = req.body

    if (updatedThread.title === '' || updatedThread.description === '') {
      res.locals.globalError = 'Please Enter Title & Description!'
      res.render(`thread/edit/${id}`, updatedThread)
      return
    }

    Thread.update({_id: id}, {$set: {title: updatedThread.title, description: updatedThread.description}})
      .then(thread => {
        res.redirect('/')
      })
      .catch(err => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.render(`thread/edit/${id}`, updatedThread)
      })
  },
  deletePost: (req, res) => {
    let id = req.params.id
    Thread.findOneAndRemove({_id: id}).then(thread => {
      Answer.remove({thread: thread}).then(() => {
        res.redirect('/')
      })
    })
  },
  like: (req, res) => {
    let id = req.params.id
    Thread.findById(id).then(thread => {
      thread.likedBy.push(req.user._id)
      thread.save().then(() => {
        res.redirect('/')
      })
    })
  },
  unlike: (req, res) => {
    let id = req.params.id
    Thread.findById(id).then(thread => {
      let index = thread.likedBy.indexOf(req.user._id)
      thread.likedBy.splice(index, 1)
      thread.save().then(() => {
        res.redirect('/')
      })
    })
  }
}
