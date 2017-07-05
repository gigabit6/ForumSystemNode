let mongoose = require('mongoose')
let schemaTypes = mongoose.SchemaTypes
const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let answerSchema = mongoose.Schema({
  text: {type: schemaTypes.String, required: REQUIRED_VALIDATION_MESSAGE},
  thread: {type: schemaTypes.ObjectId, required: REQUIRED_VALIDATION_MESSAGE, ref: 'Thread'},
  postedDate: {type: schemaTypes.Date, default: Date.now()},
  author: {type: schemaTypes.ObjectId, ref: 'User'}
})

let Answer = mongoose.model('Answer', answerSchema)

module.exports = Answer
