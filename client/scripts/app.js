
$(document).ready(function() {
  $('#button').click(function(e) {
  console.log("clicked");
  e.preventDefault();
  var text = $('input').text();
  sendMessage(text, userName, "Xelandlerb");
  });
});


var sendMessage = function(text, username, roomname) {
  var message = {
  'username' : username,
  'text': text,
  'roomname': roomname
};


  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
}


var idGenMaker = function() {
  var count = 0;
  return function() {
    count++;
    return "chatID" + count;
  }
}

var idGen = idGenMaker();

var displayChat = function(results) {
    for(var i = 0; i < results.length; i ++) {
      var htmlString = "";

      var displayText = results[i].text;

      if(results[i].text === undefined) {
        displayText = '';
      }
      var niceID = idGen();

      htmlString +=  "<p>" + "<a href ='' id='" + niceID + "'>" + results[i].username + "</a>" + ": " +  escapeHTML(displayText) + "</p>";

      $('#chatter').append(htmlString);
      (function(){
        var mObj = results[i];
        $('#' + niceID).click(function(e) {
        filtered = mObj;
        e.preventDefault();
      });

      })()

    }
}

var allMessages = [];
var checkMessages = [];
var filtered = false;

/*
 & --> &amp;
 < --> &lt;
 > --> &gt;
 " --> &quot;
 ' --> &#x27;
 / --> &#x2F;
 */

var escapeHTML = function(htmlStr) {
  htmlStr = htmlStr.replace(/\&/g, "&amp");
  htmlStr = htmlStr.replace(/\</g, "&lt");
  htmlStr = htmlStr.replace(/\>/g, "&gt");
  htmlStr = htmlStr.replace(/\"/g, "&quot");
  htmlStr = htmlStr.replace(/\'/g, "&#x27");
  htmlStr = htmlStr.replace(/\//g, "&#x2F");

  return htmlStr;
}

var diff = function(arr1, arr2, iteratee) {
  var results = [];
  var iterateeArr2 = _.map(arr2, iteratee);
  _.each(arr1, function(x) {
    if(iterateeArr2.indexOf(iteratee(x)) === -1) {
      results.push(x);
    }
  });
  return results;
}

setInterval(function() {
  $.get('https://api.parse.com/1/classes/chatterbox',{limit: 20, order: "-createdAt"}, function(x){
    var newMessages = diff(x.results, checkMessages, function(y) {
      return y.createdAt;
    });
    checkMessages = checkMessages.concat(newMessages);
    if(filtered) {
        newMessages = _.filter(newMessages, function(messageObj) { return messageObj.username === filtered.username});
        console.log(filtered);
        allMessages = checkMessages;
        checkMessages = _.filter(checkMessages, function(messageObj) { return messageObj.username === filtered.username});
        $('#chatter').empty();
        displayChat(checkMessages);
      }
    displayChat(newMessages);
  });
}, 500);
