var requestButton = document.getElementById("request-button"),
	summaryButton = document.getElementById("summary-button"),
	editButton = document.getElementById("edit-button"),
	endorseButton = document.getElementById("endorse-button");

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

	getJSON('http://localhost:8080/media/json?url='+tabURL).then(function(data) {
		document.getElementById("numRequests").innerHTML = data.numRequests;
		document.getElementById("transcript").innerHTML = data.transcriptText;
		document.getElementById("hidden-request-button").value = tabURL;
	}, function(status) { //error detection....
		alert('Something went wrong.');
	});

	summaryButton.addEventListener('click', function() {
		chrome.tabs.create({ url: 'http://localhost:8080/media?url='+tabURL });
	})

}