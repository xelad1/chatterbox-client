var displayChat = function(results) {
    for(var i = 0; i < results.length; i ++) {
      var htmlString = "";
      htmlString += "<p>"+ results[i].username + ":" + results[i].createdAt + "</p>";
      $('#chatter').append(htmlString);
    }
}

var checkMessages = [];

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
  $.get('https://api.parse.com/1/classes/chatterbox', function(x){
    var newMessages = diff(x.results, checkMessages, function(y) {
      return y.createdAt;
    });
    displayChat(newMessages);
    checkMessages = checkMessages.concat(newMessages);
  });
}, 2000);
