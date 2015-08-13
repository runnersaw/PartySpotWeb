var myFirebaseRef = new Firebase("https://partyspot.firebaseio.com/");

var playlist = "dabess"

var playlistRef = myFirebaseRef.child(playlist);
var suggestionsRef = playlistRef.child("suggestions");

var spotifyEndpoint = "https://api.spotify.com/v1"
var trackEndpoint = "/tracks/"

function updatePlaylist() {
	playlist = $("input[name=playlist]").val();
	playlistRef = myFirebaseRef.child(playlist);
	getNowPlaying();
}

function addSuggestion() {
	suggestionsRef.update({
	  "ho": {"artist":"hi", "uri":"hi"}
	});
	alert("Updated suggestions");
}

function getNowPlaying() {
	playlistRef.on("value", function(snapshot) {
	  	updateAllInfo(snapshot.val());
	}, function (errorObject) {
	  	console.log("The read failed: " + errorObject.code);
	});
}

function updateAllInfo(dict) { // return data will be [title, artist, img url]
  	var uri = dict["currentlyPlaying"];
  	uri = uri.split(":")[2];

	$.get(spotifyEndpoint+trackEndpoint+uri, function( data ) {
		var title = data["name"];
		var artist = data["artists"][0]["name"];
		var url = data["album"]["images"][0]["url"];

	  	$("#now-playing-song").html(title);
	  	$("#now-playing-artist").html(artist);
		$( "#now-playing-pic" ).attr("src", url);
	});
}

function addChildChangedCallback() {
	playlistRef.on("child_changed", function(snapshot) {
		updateAllInfo(snapshot.val());
	});
}

function createSuggestionsList(array) {
	var beginning = "<li class='suggestions-list'>"
	var end = "</li>"

	var arrayLength = array.length;
	for (var i = 0; i < arrayLength; i++) {
	    $("#suggestions-container").append(beginning+array[i]+end);
	}

	$( ".suggestions-list" ).click(function() {
	  	alert($(this).html());
	});
}

function createSearchList(array) {
	var beginning = "<li class='search-list'>"
	var end = "</li>"

	var arrayLength = array.length;
	for (var i = 0; i < arrayLength; i++) {
	    $("#search-container").append(beginning+array[i]+end);
	}

  $(".search-list").click(function(e) {
    $("#dialog").dialog("open");
  });
}

$( document ).ready(function() {
	// setup confirm
	$("#dialog").dialog({
		autoOpen: false,
		modal: true,
		buttons : {
			"Confirm" : function() {
				alert("You have confirmed!");            
			},
			"Cancel" : function() {
				$(this).dialog("close");
			}
		}
	});

	addChildChangedCallback();

	$( "#clicky" ).click(function() {
	  	getNowPlaying();
	});
	
	createSuggestionsList(["hi", "hello", "ho"]);
	createSearchList(["hi", "hello", "ho"]);

});
