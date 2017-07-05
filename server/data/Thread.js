let mongoose = require('mongoose')
let schemaTypes = mongoose.SchemaTypes
const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let threadSchema = mongoose.Schema({
  title: {type: schemaTypes.String, required: REQUIRED_VALIDATION_MESSAGE},
  description: {type: schemaTypes.String, required: REQUIRED_VALIDATION_MESSAGE},
  author: {type: schemaTypes.ObjectId, ref: 'User'},
  answers: [{type: schemaTypes.ObjectId, ref: 'Answer'}],
  postedDate: {type: schemaTypes.Date, default: Date.now()},
  lastAnswer: {type: schemaTypes.Date},
  views: {type: schemaTypes.Number, default: 0},
  category: {type: schemaTypes.ObjectId, ref: 'Category', required: true},
  likedBy: [{type: schemaTypes.ObjectId, ref: 'User'}]
})

let Thread = mongoose.model('Thread', threadSchema)

module.exports = Thread
