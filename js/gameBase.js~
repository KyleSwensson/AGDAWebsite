//TODO: fix doors,separate differences between mobile and desktop input into seperate file so the main js file will work for both and you dont need 2 huge js files
//velocity of player in y direction
var playerYVelocity = 0;
//vars to keep status of keys global
var leftArrPressed = false;
var rightArrPressed = false;
//vars for touch status if user is using a touch screen
var rightButtonClicked = false;
var leftButtonClicked = false;
//var that is true if player is on ground and false if player is not on the ground essentially
var canJump = false;

//urls for all the different pages that can be entered through doors
var barUrl = "barSite.html";
var helpUrl = "helpSite.html";
var mailUrl = "mailSite.html";
var artUrl = "artSite.html";
var mainUrl = "mainGame.html";

function attemptEnteringDoor(touchedDoor) {
	var player = $("#player");

	if (playerIntersectingDoor(touchedDoor)) {
	//TODO: cookies not owrking
		  //save the position of the player when leave the page, so when he returns through the door he will be in front of the door and not at starting point
		   document.cookie = "playerPosition=" + player.position().left;

		   //Determines the type of door, uses to decide where to move player to
		   if ($(this).attr('id') == "barDoor") { 
		   	location = barUrl;
		   } else if ($(this).attr('id') == "helpDoor") {
			location = helpUrl;
		   }  else if ($(this).attr('id') == "mailDoor") {
			location = mailUrl;
		   }  else if ($(this).attr('id') == "artDoor") {
			location = artUrl;
		   } else if ($(this).attr('id') == "exitDoor") {
			location = mainUrl;
		   }
	}
}


$(document).ready(function() {
		console.log(getCookie("playerPosition"));

	//TODO: cookie stuff doesn't work rn fix it
	//gets player position if stored when entered a door previously and sets player to most recent position when left
	//if playerPosition cookie is null then they haven't been on the page before so leave player at start position
	if (getCookie("playerPosition") != null) {
		$("#player").css({
			left: getCookie("playerPosition")
		});
	}

	//set update function to run every 50 ms
	setInterval(updateFunc, 50);

	$("#leftMoveButton").on('touchstart', function() {
		leftButtonClicked = true;
	});
	$("#leftMoveButton").on('touchend', function() {
		leftButtonClicked = false;
	});	
	$("#rightMoveButton").on('touchstart', function() {
		rightButtonClicked = true;
	});

	$("#rightMoveButton").on('touchend', function() {
		rightButtonClicked = false;
	});
	
	$(".door").on('touchstart', function() {
		attemptEnteringDoor(this);
	});

});


//if player is lower than ground let him jump again, reset his position to be on the top of the ground, set y velocity to 0
function checkPlayerIntersectingGround(player, ground) {
	if (player.position().top + player.height() > ground.position().top) {
		canJump = true;
		player.css({
			top: ground.position().top - player.height()
		});
		playerYVelocity = 0;
	}
}

// moves player the direction of pressed arrow if only 1 arrow is pressed, does nothing otherwise
// also checks for the button clicks the same way in the case of mobile users
function movePlayer(player, ground) {
	if ((leftArrPressed && !rightArrPressed) || (leftButtonClicked && !rightButtonClicked)) {
		//if ground is moving too far left that the start of it is coming on screen, or if player is farther right than the middle of the screen move player instead of moving all background items
		if (ground.position().left >= 0 || player.position().left > ($("html").width() * .45)) {
			//move player left if he is not going to go off screen, block him at left = 0 otherwise
			if (player.position().left >= 20) {
				player.css({
					left: "-=20"
				});
			} else {
				player.css({
					left: "0"
				});
			}
		} else { // if neither of those things are true, move all background objects the opposite direction player would move and dont move player, to give the illusion of camera following the player
			$(".nonPlayer").css({
				left: "+=20"
			});
		}
	} else if ((rightArrPressed && !leftArrPressed) || (rightButtonClicked && !leftButtonClicked)) {
		// Symmetrical to above but for moving right instead of moving left
		if (ground.position().left + ground.width() <= $("html").width() || player.position().left < ($("html").width() * .45)) {
			//move player right if he is not going to go off screen, block him otherwise
			if (player.position().left <= ($("html").width() - player.width()) - 20) {
				player.css({
					left: "+=20"
				});
			} else {
				player.css({
					left: $("html").width() - player.width()
				});
			}
		} else {
			$(".nonPlayer").css({
				left: "-=20"
			});
		}
	}
}

function updateFunc() {
	var player = $("#player");
	var ground = $("#ground");

	//move player down according to y velocity
	player.css({
		top: "+=" + playerYVelocity.toString()
	});

	// update velocity to make player move towards downwards velocity over time  (gravity basically)
	if (playerYVelocity < 10) {
		playerYVelocity += 1;
	}

	checkPlayerIntersectingGround(player, ground);

	
	movePlayer(player, ground);

}



//checks if at lest half of player is in door
function playerIntersectingDoor(doorObj) {
	var player = $("#player");
	return (doorObj.offset().left < player.offset().left + (player.width() / 2) && doorObj.offset().left + doorObj.width() > player.offset().left + (player.width() / 2));
}



//sets variables for keys to true if they are pressed down
$(document).keydown(function(e) {
	var player = $("#player");
	console.log(e.which);
	e.preventDefault();// makes it so firefox doesnt scroll when arrow keys pressed
	if (e.which == 39) {
		rightArrPressed = true;
	} else if (e.which == 37) {
		leftArrPressed = true;
	}


	//code for going into doors and for jumping
	 if (e.which == 13) {
	    console.log("pressed enter");
	   $(".door").each(function(index) {
		   if (playerIntersectingDoor($(this))) {

			   //TODO: cookies not owrking
			   //save the position of the player when leave the page, so when he returns through the door he will be in front of the door and not at starting point
			   document.cookie = "playerPosition=" + player.position().left;

			   //Determines the type of door, uses to decide where to move player to
			   if ($(this).attr('id') == "barDoor") { 
			   	location = barUrl;
			   } else if ($(this).attr('id') == "helpDoor") {
				location = helpUrl;
			   }  else if ($(this).attr('id') == "mailDoor") {
				location = mailUrl;
			   }  else if ($(this).attr('id') == "artDoor") {
				location = artUrl;
			   } else if ($(this).attr('id') == "exitDoor") {
				location = mainUrl;
			   }
		    }
	   });
	  
        } else if (e.which == 32) {
	    //if pressing space and canJump jump and set canjump to false
	   if (canJump) {
	   	playerYVelocity = -10;
		canJump = false;
	   }
    }
});
//sets variables for keys to false
$(document).keyup(function(e) {
	if (e.which == 39) {
		rightArrPressed = false;
	} else if (e.which == 37) {
		leftArrPressed = false;
	}
});

//function taken from stackoverflow
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
} 
