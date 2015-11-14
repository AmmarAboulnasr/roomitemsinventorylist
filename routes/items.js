'use strict';

var express = require('express');
var router = express.Router();

var Item = require('../models/item');

router.get('/', function(req, res) {
  Item.find({}, function(err, items) {
    res.send(items);
  });
  
});

router.get('/:id', function(req, res) {
  Item.findById(req.params.id, function(err, item) {
    res.send(item);
  })
});

router.put('/:id', function(req, res) {
  Item.findByIdAndUpdate(req.params.id, { $set: req.body }, function(err, item) {
    res.send(item);
  })
});

router.delete('/:id', function(req, res) {
  Item.findByIdAndRemove(req.params.id, function(err, item) {
    Item.find({}, function(err, items) {
    res.send(items);
  });
  })
});

router.post('/', function (req, res) {
  var item = new Item(req.body);
  item.save();
  res.send(item);

});

module.exports = router;