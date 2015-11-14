'use strict';

var express = require('express');
var router = express.Router();

var Room = require('../models/room');
var Item = require('../models/item');

// router.get('/', function(req, res) {
//   Room.find({}).populate('items').exec(function(err, rooms) {
//     res.send(rooms);
//   });
  
// });

router.get('/', function(req, res) {
  Room.find({}, function(err, rooms) {
    res.send(rooms);
  }).populate('items');
  
});

router.get('/:id', function(req, res) {
  Room.findById(req.params.id, function(err, room) {
    res.send(room);
  })
});

router.put('/:id', function(req, res) {
  Room.findByIdAndUpdate(req.params.id, { $set: req.body }, function(err, room) {
    res.send(room);
  })
});

router.put('/:roomId/addItem/:itemId', function(req, res) {
  Room.findById(req.params.roomId, function(err, room) {
    Item.findById(req.params.itemId, function(err, item) {
      room.items.push(item._id);
      room.save(function(err, room) {
        res.send(room);
      });
      
    });
  })
});

router.delete('/:id', function(req, res) {
  Room.findByIdAndRemove(req.params.id, function(err, room) {
    Room.find({}, function(err, rooms) {
    res.send(rooms);
  });
  })
});

router.post('/', function (req, res) {
  console.log(req.body);
  var room = new Room(req.body);
  room.save();
  res.send(room);

});

module.exports = router;