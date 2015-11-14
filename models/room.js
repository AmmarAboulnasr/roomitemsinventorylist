'use strict';

var mongoose = require('mongoose');

var Room;

var roomSchema = mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, required: true, default: new Date() },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item'}]
});

Room = mongoose.model('Room', roomSchema);

module.exports = Room;