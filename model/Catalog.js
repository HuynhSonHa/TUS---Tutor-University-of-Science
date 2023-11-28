const mongoose = require('mongoose');

const catalogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Catalog',
    default: null
  },
  sortOrder: {
    type: Number,
    required: true,
    min: 0
  }
});

module.exports = mongoose.model('Catalog', catalogSchema);

