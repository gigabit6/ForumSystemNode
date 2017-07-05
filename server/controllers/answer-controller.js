const mongoose = require('mongoose')
const Answer = mongoose.model('Answer')
const Thread = mongoose.model('Thread')
const errorHandler = require('../utilities/error-handler')

module.exports = {
  addPost: (req, res) => {
    let threadId = req.body.thread
    let reqAnswer = req.body

    if (reqAnswer.text === '') {
      res.locals.globalError = 'Please Enter answer!'
      res.render('threads/list')
      return
    }

    reqAnswer.author = req.user._id
    Answer.create(reqAnswer).then(answer => {
      Thread.findById(threadId).then(thread => {
        thread.answers.push(answer._id)
        thread.lastAnswer = Date.now()
        thread.save().then(() => {
          res.redirect(`/thread/${thread._id}/${thread.title}`)
        })
      })
    })
      .catch(err => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.render('threads/list')
      })
  },
  editGet: (req, res) => {
    let id = req.params.id
    Answer.findById(id).then(answer => {
      res.render('answers/edit', answer)
    })
  },
  editPost: (req, res) => {
    let id = req.params.id
    let updatedAnswer = req.body

    if (updatedAnswer.text === '') {
      res.locals.globalError = 'Please Enter answer!'
      res.render('threads/list')
      return
    }

    Answer.update({_id: id}, {$set: {text: updatedAnswer.text}}).then(answer => {
      res.redirect('thread/all')
    })
      .catch(err => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.render(`/answer/adit/${id}`, updatedAnswer)
      })
  },
  deletePost: (req, res) => {
    let id = req.params.id
    Answer.findById(id).populate('thread').then(answer => {
      let index = answer.thread.answers.indexOf(answer._id)

      answer.thread.answers.splice(index, 1)
      answer.thread.save()

      answer.remove().then(() => {
        res.redirect('/')
      })
    })
  }
}
