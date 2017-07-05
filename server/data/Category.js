const mongoose = require('mongoose')
const schemaTypes = mongoose.Schema.Types

let categorySchema = mongoose.Schema({
  name: {type: schemaTypes.String, required: true, unique: true}
})

let Category = mongoose.model('Category', categorySchema)

module.exports = Category
