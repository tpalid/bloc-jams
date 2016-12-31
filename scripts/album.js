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
    	    var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
    		currentlyPlayingCell.html(currentlyPlayingSongNumber);
    		    	}
    	if (currentlyPlayingSongNumber !== songNumber) {
    		setSong(songNumber);
    		currentSoundFile.play();
    		updateSeekBarWhileSongPlays();
    		var $volumeFill = $('.volume .fill');
    		var $volumethumb = $('.volume .thumb');
    		$volumeFill.width(currentVolume + '%');
    		$volumethumb.css({left: currentVolume + '%'});
    		$(this).html(pauseButtonTemplate);
    		updatePlayerBarSong();
    	} else if (currentlyPlayingSongNumber === songNumber) {
	        if (currentSoundFile.isPaused()) {
	 	        $(this).html(pauseButtonTemplate);
	            $('.main-controls .play-pause').html(playerBarPauseButton);
	            currentSoundFile.play();
	        }
	        else {
	            $(this).html(playButtonTemplate);
	            $('.main-controls .play-pause').html(playerBarPlayButton);
	            currentSoundFile.pause();
	        }
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
       var $previousPlayingCell = getSongNumberCell(currentAlbum.songs.length);
       $previousPlayingCell.html(currentAlbum.songs.length);
   }
   // otherwise, set previous song in album back to song number in table
    else {
    $previousPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
    $previousPlayingCell.html(currentlyPlayingSongNumber);
   }
   // increment currentlyPlayingSongNumber and CurrentSongFromAlbum
   setSong(currentlyPlayingSongNumber + 1);
     // update info in player bar
    updatePlayerBarSong();
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    // change currently playing song to pause button in table
    var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
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
        var $nextPlayingCell = getSongNumberCell("1");
        $nextPlayingCell.html("1");
    }
    //otherwise, play previous song and set next song in album back to song number in table
    else {
        $nextPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
        $nextPlayingCell.html(currentlyPlayingSongNumber);
        currentlyPlayingSongNumber --;
    }
    //increment CurrentSongFromAlbum
    currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber - 1];
    setSong(currentlyPlayingSongNumber);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    
    // update info in player bar
    updatePlayerBarSong();
    var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
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

var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {
        currentSoundFile.bind('timeupdate', function(event) {
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
        })
    }
}

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    //convert to percentage
    var offsetXPercent = seekBarFillRatio * 100;
    //test to be sure percent is between 0 and 100
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    //convert percentage to string for CSS
    var percentageString = offsetXPercent + '%';
    //set CSS properties
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
    };

var setupSeekBars = function() {
    //grab seek bar element
    var $seekBars = $('.player-bar .seek-bar');
   

    $seekBars.click(function(event) {
        //find length from beginning of seek bar
        var offsetX = event.pageX - $(this).offset().left;
        //find width of entire bar
        var barWidth = $(this).width();
        //divide to find ratio of seek bar to be filled
        var seekBarFillRatio = offsetX / barWidth;
        if ($(this)/parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);
        }
        //call method to update seek percentage using seekBarFillRatio
        updateSeekPercentage($(this), seekBarFillRatio);
    });
    
    $seekBars.find('.thumb').mousedown(function(event) {
        var $seekBar = $(this).parent();
        // console.log('mousedown');
        // console.log(event.target);
        
        $(document).bind('mousemove.thumb', function(event) {
            console.log('move');
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
        })
        
        $(document).bind('mouseup.thumb', function() {
            // console.log('up');
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });
};


var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

var setSong = function(songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: ['mp3'],
        preload: true
    });
    
    setVolume(currentVolume);
};

// var seek = function(time) {
//     if (currentSoundFile) {
//         currentSoundFile.setTime(time);
//     }
// };

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var togglePlayFromPlayerBar = function() {
    if (currentSoundFile.isPaused()) {
        $mainPlayPause.html(playerBarPauseButton)
        getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
        currentSoundFile.play();
    }
    else {
        $mainPlayPause.html(playerBarPlayButton);
        getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate);
        currentSoundFile.pause();
    }
}


var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $mainPlayPause = $('.main-controls .play-pause');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $mainPlayPause.click(togglePlayFromPlayerBar);
    setupSeekBars();
 });
