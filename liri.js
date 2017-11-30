var twitter = require('twitter');  //twitter module
var request = require('request');  //request module
var keys = require('./keys.js');   //twitter key
var Spotify = require('node-spotify-api'); //spotify module
var fs = require("fs");  //file system module
var spotifyKeys = {  
	id: '6b914e9ddf3b43f7b66be77ff6dfb626',
	secret: '4a5194bfda694ac5bdb220eb74a2a317'
}


var command = process.argv[2];  //command argument  (spotify,twitter, etc)

var input = process.argv.slice(3).join(' '); //build all arguments after command argument into a string

var twitterCommand = function(){

	var client = new twitter(keys);  //pass in keys object
	client.get('search/tweets', {q: 'BootcampLeo'}, function(error, tweets, response) {  //I'd imagine you could do this for a specifc twitter id, but search is working so I left it
   		if(error){
   			return console.log(error);
   		}

   		for (i=0;i<tweets.statuses.length;i++){

   			var logString = '\n-----------------';
   			logString +=  '\nTweet Contents: ' + tweets.statuses[i].text;
   			logString += '\nCreated: ' + tweets.statuses[i].created_at;
   			log(logString);
   			
   		}

	});

}

var spotifyCommand = function(song){

	var client = new Spotify(spotifyKeys);//pass in keys object
 	if(song == ''){
 		song = 'the sign ace of base';
 	}
	client.search({ type: 'track', query: song }, function(err, data) {
  		if (err) {
    		return console.log('Error occurred: ' + err);
  		}
  		//seemed like it was just returning an empty-ish response if no song found, not necessarily an error.  this handles that. 
  		else if(data.tracks.total == 0){  
  			return console.log('\nSong Not Found!');
  		}
  		else {
		 	console.log(data);
			var title = data.tracks.items[0].name; 
			var album = data.tracks.items[0].album.name; 
			var artist = data.tracks.items[0].artists[0].name; 
			var preview = data.tracks.items[0].preview_url; 
			if (preview == null){
				preview = 'Not Available';
			}
			var logString = '\n-----------------';
			logString += '\nTitle: ' + title + '\nAlbum: ' + album;
			logString += '\nArtist: ' + artist + '\nPreview Link: ' + preview;
			log(logString);
		}
	});


}

var movieCommand = function(movie){

	if(movie == ''){
		movie = 'Mr Nobody';
	}
	var url = 'http://www.omdbapi.com/?apikey=6e987347&t=' + movie;
	request(url, function (error, response, body) {
		body = JSON.parse(body);
		if(error){
			console.log('error:', error); // Print the error if one occurred
		}
		else if(body.Response == 'False'){
	  		console.log('\n' + body.Error);
		}

		else {
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

			var logString = '\n-----------------';
			logString += '\nTitle: ' +  body.Title + '\nYear: ' + body.Year + '\nIMDB Rating: ' +  imdbRating;
			logString += '\nRotten Tomatoes Rating: ' + rottenRating + '\nLanguage: ' + body.Language;
			logString += '\nPlot: ' + body.Plot + '\nActors: ' + body.Actors;
			
			log(logString);
		}

	});

}

var doWhatItSaysCommand = function(){
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
    		return console.log(error);
  		}
  	var dataArr = data.split(",");//split the contents of random.txt on the commas, result is array
  	commandRouting(dataArr[0],dataArr[1]);  //send back to routing function with command and input arguments from .txt file
	});

}

//determine what to do based on command string, use input as argument where necessary
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
			console.log('\nCommand Not Found');

	}
}

//log result data to console and to log.txt file.  appendFile will create file if it doesn't exist. 
var log = function(data){
	console.log(data);
	fs.appendFile('log.txt', data, function(err) {
  		if (err) {
  			console.log(err);
  		}	

	});
}

//this executes first when the app is ran
commandRouting(command,input);