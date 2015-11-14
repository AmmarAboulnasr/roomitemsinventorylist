'use strict';

var itemIdToChange, roomIdToChange;

$(document).ready(init);

function init() {
  generateRooms();
  generateItems();
  $('#addRoom').click(addRoomClicked);
  $('#addItem').click(addItemClicked);
  $('#roomsTable').on('click', 'i', deleteRoom);
  $('#itemsTable').on('click', 'i', deleteItem);
  $('#itemsListAITAR').on('click', 'tbody', itemClickedAITAR);
  $('#roomsListAITAR').on('click', 'tbody', roomClickedAITAR);

}

function itemClickedAITAR(e) {
  itemIdToChange = $(e.target).parent().attr('class');
  $(e.target).parent().css('color','red');
  $(e.target).parent().css('font-weight', 'bold');
  $('#roomsListAITAR').slideDown();
  
}

function roomClickedAITAR(e) {
  roomIdToChange = $(e.target).parent().attr('class');
  $(e.target).parent().css('color','red');
  $(e.target).parent().css('font-weight', 'bold');
  $.ajax({
    url: 'items/' + itemIdToChange,
    type: 'put',
    data: {inRoom: true}

  })
  .done(function(){
    generateRooms();
    generateItems();
  });
  $.ajax({
    url: 'rooms/' + roomIdToChange + '/addItem/' + itemIdToChange,
    type: 'put'
  })
  .done(function() {
    generateRooms();
    generateItems();
  });
  
}

function deleteRoom(e) {
  var id = $(e.target).parent().parent().attr('class');
  $.ajax({
    url: '/rooms/' + id,
    type: 'delete',
  })
  .done(function() {
    generateRooms();
  });
}

function deleteItem(e) {
  var id = $(e.target).parent().parent().attr('class');
  
  $.ajax({
    url: '/items/' + id,
    type: 'delete',
  })
  .done(function() {
    generateItems();
  });
}

function addItemClicked() {
  var item = {
    name: $('#itemName').val(),
    value: $('#itemValue').val(),
    description: $('#itemDescription').val()
  }
  $.post('/items', item)
  .done(function(data) {
    $('#itemName').val('');
    $('#itemValue').val('');
    $('#itemDescription').val('');
    generateItems();
  });
}

function addRoomClicked() {
  var room = {
    name: $('#roomName').val()
  };
  $.post('/rooms', room)
  .done(function(data) {
    $('#roomName').val('');
    generateRooms();
  });
}

function generateRooms() {
  $('#roomsListAITAR tbody').empty();
  $('#roomsListAITAR').hide();
  $('#roomsTable tbody').empty();
  $('#roomsTable').hide();
  $.get('/rooms')
  .done(function(data) {
    $('#roomsCount').text(data.length);
    if(data.length > 0) {
      $('.noRoom').remove();
      $('.roomsTable').fadeIn();
      // $('#roomsListAITAR').fadeIn();
      var $tbody = $('<tbody>');
      var $tbodyAITAR = $('<tbody>');
      for(var i = 0; i < data.length; i++) {
        var $tr = $('<tr>');
        $tr.addClass(data[i]._id);
        var $td1 = $('<td>');
        var $td2 = $('<td>');
        var $td3 = $('<td>').addClass('deleteRoomCell').append($('<i>').addClass('fa fa-times'));
        $td1.text(data[i].name);
        var itemsInRoom = '';
        for(var x = 0; x < data[i].items.length; x++) {
          itemsInRoom += data[i].items[x].name;
          if((x+1) < data[i].items.length) {
            itemsInRoom += ', ';
          }
        }
        $td2.text(itemsInRoom);
        $tbodyAITAR.append($('<tr>').addClass(data[i]._id).append($('<td>').text(data[i].name)));
        $tbody.append($tr.append($td1, $td2, $td3));
      }
      $('#roomsTable').append($tbody);
      $('#roomsListAITAR').append($tbodyAITAR);
    } else {
      $('#roomsContainer').append($('<div>').addClass('noRoom').text('There are no rooms!'));
      $('.noRoom').fadeIn();
      $('#addItemToARoom').append($('<div>').addClass('noRoom').text('There are no rooms!'));
      $('.noRoom').fadeIn();
    }
  });
}

function generateItems() {
  $('#itemsListAITAR tbody').empty();
  $('#itemsListAITAR').hide();
  $('#itemsTable tbody').empty();
  $('#itemsTable').hide();
  $.get('/items')
  .done(function(data) {
    $('#itemsCount').text(data.length);
    if(data.length > 0) {
      $('.noItem').empty();
      $('.itemsTable').fadeIn();
      $('#itemsListAITAR').fadeIn();
      var $tbody = $('<tbody>');
      var $tbodyAITAR = $('<tbody>');
      for(var i = 0; i < data.length; i++) {
        var $tr = $('<tr>');
        $tr.addClass(data[i]._id);
        var $td1 = $('<td>').text(data[i].name);
        var $td2 = $('<td>').text(data[i].value);
        var $td3 = $('<td>').text(data[i].description);
        var $td4 = $('<td>').addClass('deleteItemCell').append($('<i>').addClass('fa fa-times'));
        $tbody.append($tr.append($td1, $td2, $td3, $td4));
        // Code below to handle generating available items list for the ADD ITEMS TO A ROOM section.
        if(!data[i].inRoom) {
          $tbodyAITAR.append($('<tr>').addClass(data[i]._id).append($('<td>').text(data[i].name),$('<td>').text(data[i].value),$('<td>').text(data[i].description)));
        }
      }
      $('#itemsTable').append($tbody);
      $('#itemsListAITAR').append($tbodyAITAR);

    } else {
      $('#itemsContainer').append($('<div>').addClass('noItem').text('There are no items!'));
      $('.noItem').fadeIn();
      $('#addItemToARoom').append($('<div>').addClass('noItem').text('There are no items available!'));
      $('.noItem').fadeIn();
      $('#roomsListAITAR').fadeOut();
    }


  });

}