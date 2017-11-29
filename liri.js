var twitter = require('twitter');
var request = require('request');
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var spotifyKeys = {
	id: '6b914e9ddf3b43f7b66be77ff6dfb626',
	secret: '4a5194bfda694ac5bdb220eb74a2a317'
}
var fs = require("fs");

var command = process.argv[2];

var input = process.argv.slice(3).join(' ');

var twitterCommand = function(){

	var client = new twitter(keys);
	client.get('search/tweets', {q: 'BootcampLeo'}, function(error, tweets, response) {
   		if(error){
   			console.log(error);
   			return;
   		}


   		for (i=0;i<tweets.statuses.length;i++){
   			console.log('-----------------');
   			console.log('Tweet Contents: ' + tweets.statuses[i].text);
   			console.log('Created: ' + tweets.statuses[i].created_at);
   			
   		}

	});

}

var spotifyCommand = function(song){

	var client = new Spotify(spotifyKeys);
 	if(song == ''){
 		song = 'the sign ace of base';
 	}
	client.search({ type: 'track', query: song }, function(err, data) {
  		if (err) {
    		return console.log('Error occurred: ' + err);
  		}
 
	var title = data.tracks.items[0].name; 
	var album = data.tracks.items[0].album.name; 
	var artist = data.tracks.items[0].artists[0].name; 
	var preview = data.tracks.items[0].preview_url; 
	if (preview == null){
		preview = 'Not Available';
	}
	console.log('-----------------');
	console.log('Title: ' + title);
	console.log('Album: ' + album);
	console.log('Artist: ' + artist);
	console.log('Preview Link: ' + preview);

	});


}

var movieCommand = function(movie){

	if(movie == ''){
		movie = 'Mr Nobody';
	}
	var url = 'http://www.omdbapi.com/?apikey=6e987347&t=' + movie;
	request(url, function (error, response, body) {
	  if(error){
	  	console.log('error:', error); // Print the error if one occurred
	  }
	  body = JSON.parse(body);
	  var imdbRating = 'unknown';
	  var rottenRating = 'unkown';
	  var ratings = body.Ratings;

	  for(i=0; i<ratings.length;i++){
	  	if (ratings[i].Source == 'Internet Movie Database'){
	  		imdbRating = ratings[i].Value;
	  	}
	  	else if(ratings[i].Source == 'Rotten Tomatoes'){
	  		rottenRating = ratings[i].Value;

	  	}
	  }
	  console.log('-----------------');
	  console.log('Title: ', body.Title); 
	  console.log('Year: ', body.Year);
	  console.log('IMDB Rating: ', imdbRating); 
	  console.log('Rotten Tomatoes Rating: ', rottenRating); 
	  console.log('Language: ', body.Language); 
	  console.log('Plot: ', body.Plot); 
	  console.log('Actors: ', body.Actors); 


	});

}

var doWhatItSaysCommand = function(){
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
    		return console.log(error);
  		}
  	var dataArr = data.split(",");
  	commandRouting(dataArr[0],dataArr[1]);
	});

}


var commandRouting = function(command,input){
	switch (command) {
		case 'my-tweets':
			twitterCommand();
			break;
		case 'spotify-this-song':
			spotifyCommand(input); 
			break;
		case 'movie-this':
			movieCommand(input);
			break;
		case 'do-what-it-says':
			doWhatItSaysCommand();
			break;
		default:
			console.log('Command Not Found');

	}
}


var log = function(data){
	fs.appendFile('log.txt', data, function(err) {
  		if (err) {
  			console.log(err);
  		}					
	});
}


commandRouting(command,input);