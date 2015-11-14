'use strict';

var PORT = 3000;

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/inventorylistapp');

var app = express();

app.set('view engine', 'jade');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded( {extended: true} ));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/items', require('./routes/items'));
app.use('/rooms', require('./routes/rooms'));
app.get('/', function(req, res) {
  res.render('index');
});

app.listen(PORT);