 var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
        +'   <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
        +'   <td class="song-item-title">' + songName + '</td>'
        +'   <td class="song-item-duration">' + songLength + '</td>'
        +'</tr>'
        ;
    var $row = $(template);
 
    var clickHandler = function() {
	    var songNumber = parseInt($(this).attr('data-song-number'));
    
    	if (currentlyPlayingSongNumber !== null) {
    	    var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    		currentlyPlayingCell.html(currentlyPlayingSongNumber);
    		    	}
    	if (currentlyPlayingSongNumber !== songNumber) {
    		$(this).html(pauseButtonTemplate);
    		currentlyPlayingSongNumber = songNumber;
    		currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    		updatePlayerBarSong();
    	} else if (currentlyPlayingSongNumber === songNumber) {
    		$(this).html(playButtonTemplate);
    		$('.main-controls .play-pause').html(playerBarPlayButton);
	    	currentlyPlayingSongNumber = null;
	    	currentSongFromAlbum = null;
	   	}
};
    var onHover = function(event) {
        if ($(this).parent('.album-view-song-item')) {
            var $songItem = $(this).find( '.song-item-number');
            var $songItemNumber = parseInt($songItem.attr('data-song-number'));
            if ($songItemNumber !== currentlyPlayingSongNumber) {
                $songItem.html(playButtonTemplate);
            };
        };
    };
    
    var offHover = function(event) {
        var $songItem = $(this).find('.song-item-number');
        var $songItemNumber = parseInt($songItem.attr('data-song-number'));
        if ($songItemNumber !== currentlyPlayingSongNumber) {
            $songItem.html($songItemNumber);
        }
        
        
    };
       
    $row.find('.song-item-number').click(clickHandler);
    
    $row.hover(onHover, offHover);
    
    return $row
 };
 
var updatePlayerBarSong = function() {
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + ' - ' + currentAlbum.artist);
    $('.currently-playing .artist-name').html(currentAlbum.artist);
    $('.currently-playing .song-name').html(currentSongFromAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
};

var nextSong = function() {
    // if no song is playing, set current song number to zero
    if (currentlyPlayingSongNumber == null) {
       currentlyPlayingSongNumber = 0;
   }
   // if last song in album is playing, set current song number to zero and set last song in album back to song number in table
   else if (currentlyPlayingSongNumber == currentAlbum.songs.length) {
       currentlyPlayingSongNumber = 0;
       var $previousPlayingCell = $('.song-item-number[data-song-number="' + currentAlbum.songs.length + '"]');
       $previousPlayingCell.html(currentAlbum.songs.length);
   }
   // otherwise, set previous song in album back to song number in table
    else {
    $previousPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    $previousPlayingCell.html(currentlyPlayingSongNumber);
   }
   // increment currentlyPlayingSongNumber and CurrentSongFromAlbum
    currentlyPlayingSongNumber ++;
    currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber - 1];
    // update info in player bar
    updatePlayerBarSong();
    // change currently playing song to pause button in table
    var $currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    $currentlyPlayingCell.html(pauseButtonTemplate);
  }
  
var previousSong = function() {
    //if no song is playing, play last song
    if (currentlyPlayingSongNumber == null) {
        currentlyPlayingSongNumber = currentAlbum.songs.length;
    }
    //if first song in album is playing, play last song and set first song back to song number in table
    else if (currentlyPlayingSongNumber == 1) {
        currentlyPlayingSongNumber = currentAlbum.songs.length;
        var $nextPlayingCell = $('.song-item-number[data-song-number="1"]');
        $nextPlayingCell.html("1");
    }
    //otherwise, play previous song and set next song in album back to song number in table
    else {
        $nextPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
        $nextPlayingCell.html(currentlyPlayingSongNumber);
        currentlyPlayingSongNumber --;
    }
    //increment CurrentSongFromAlbum
    currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber - 1]
    // update info in player bar
    updatePlayerBarSong();
    var $currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    $currentlyPlayingCell.html(pauseButtonTemplate);
}

 var setCurrentAlbum = function(album) {
     currentAlbum = album;
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
     
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
     $albumSongList.empty();
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
          }
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
}


var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
 });
