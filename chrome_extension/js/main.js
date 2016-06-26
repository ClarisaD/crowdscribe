document.addEventListener('DOMContentLoaded', function () {
	chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
	    var hostname = tabs[0].url;
        loadData(hostname);
    })
});

var getJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};

function loadData(tabURL) {

	getJSON('http://localhost:8080/requests?url='+tabURL).then(function(data) {
		document.getElementById("numRequests").innerHTML = data.requests;
	}, function(status) { //error detection....
		alert('Something went wrong.');
	});

}