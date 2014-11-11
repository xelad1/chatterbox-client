


var displayChat = function(results) {
    for(var i = 0; i < results.length; i ++) {
      var htmlString = "";

      var displayText = results[i].text;

      if(results[i].text === undefined) {
        displayText = '';
      }

      htmlString +=  "<p>" + "<a href=''>" + results[i].username + "</a>" + ": " +  escapeHTML(displayText) + "</p>";
      $('#chatter').append(htmlString);


    }
}

var checkMessages = [];

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
    displayChat(newMessages);
    checkMessages = checkMessages.concat(newMessages);
  });
}, 2000);
