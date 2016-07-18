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


//var that tells whether player needs arrow key instructions displayed
var needArrInstr = true;
//var that tells whether player needs enter instruction displayed when in front of door
var needEnterInstr = true;
//var that tells whether the enter instructions are currently visible or not
var enterInstructionsVisible = false;

//var that holds current npc player is talking to, null if player not talking
var activeNPC = null;
//var that tells you which number text box should pop up next in your conversation with an NPC, starting text for NPC is always 0
var currentTextNum = 0;

//urls for all the different pages that can be entered through doors
var barUrl = "barSite.html";
var helpUrl = "helpSite.html";
var mailUrl = "mailSite.html";
var artUrl = "artSite.html";
var mainUrl = "mainGame.html";

function addArrowInstructions() {
	var player = $("#player");
	var instructions = '<div id="arrowKeyInstructions"></div>';
	$("#gameHolder").append(instructions);
	$("#arrowKeyInstructions").css({
		opacity: "0",
		left: player.position().left - ($("#arrowKeyInstructions").width()/2) + (player.width() / 2),
		top: "0",
	});
	$("#arrowKeyInstructions").animate({
		top: player.position().top  - $("#arrowKeyInstructions").height() ,
		opacity: "1"
	}, 1000);
}	

function addEnterInstructions() {
	var player = $("#player");
	var instructions = '<div id="enterInstructions"></div>';
	$("#gameHolder").append(instructions);
	$("#enterInstructions").css({
		opacity: "0",
		left: player.position().left - ($("#enterInstructions").width()/2) + (player.width() / 2),
		top: "0",
	});
	$("#enterInstructions").animate({
		top: player.position().top  - $("#enterInstructions").height() ,
		opacity: "1"
	}, 1000);
}	



function removeArrowInstructions() {
	$("#arrowKeyInstructions").animate({
		top: "-=200",
		opacity: "0"
	}, 1000, function() {
		$("#arrowKeyInstructions").remove();
	});
}



function removeEnterInstructions() {
	$("#enterInstructions").animate({
		top: "-=200",
		opacity: "0"
	}, 1000, function() {
		$("#enterInstructions").remove();
	});
}


function addTextAboveChar(characterId, textToAdd, textBoxId) {
	var character = $(characterId);
	var displayDiv ='<div id=' + textBoxId + ' class="textBox"><p>' + textToAdd + '</p></div>';
	$("#gameHolder").append(displayDiv);
	$("#"+textBoxId).css({
		opacity: "0",
		left: character.position().left,
		top: character.position().top + character.width() 
	});
	$("#"+textBoxId).animate({
		top: character.position().top - $("#"+textBoxId).height(),
		opacity: "1",

	}, 1000);
}


function removeTextAboveChar(textBoxId) {
	$("#" + textBoxId).animate({
		top: "-=200",
		opacity: "0"
	}, 1000, function() {
		$(textBoxId).remove();
	});

}


function attemptEnteringDoor(touchedDoor) {
	if (playerIntersectingObj($(touchedDoor))) {
	 switch ($(touchedDoor).attr('id')) {
		case 'barDoor':
			setMainCookie();
			location = barUrl;
			break;
		case 'helpDoor':
			setMainCookie();
			location = helpUrl;
			break;
		case 'mailDoor':
			setMainCookie();
			location = mailUrl;
			break;
		case 'artDoor':
			setMainCookie();
			location = artUrl;
			break;
		default:
			location = mainUrl;
			break;
		}
	}
}

function getNPCText(givenNPC, textNum) {
	
	console.log($(givenNPC).attr('id'));
	switch ($(givenNPC).attr('id')) {
		case 'bartender':
			switch (textNum) {
				case 0: return 'First text';
				case 1: return 'second text';
				case 2: return 'third text';
				default: return null;
			}
			break;
		case 'welcomePerson':
		      	switch (textNum) {
				case 0: return 'welcome!';
				case 1: return 'second welcome!';
				default: return null;
			}
		      	break;

		default: 
		     	return null;
		    	break;
	}

	return null;
}

function getNPCTextID(givenNPC, textNum) {
	return $(givenNPC).attr('id') + textNum.toString() + "ID";
}

function attemptTalkingNPC(attemptedNPC) {
	var player = $("#player");

	if (playerIntersectingObj($(attemptedNPC))) {

		if (activeNPC == null) {
			//start talking to this npc
			activeNPC = attemptedNPC;
			addTextAboveChar(activeNPC, getNPCText(activeNPC,currentTextNum) , getNPCTextID(activeNPC,currentTextNum));
			currentTextNum++;
		} else {
			removeTextAboveChar(getNPCTextID(activeNPC, currentTextNum - 1));
			if (getNPCText(activeNPC, currentTextNum) != null) {
				addTextAboveChar(activeNPC, getNPCText(activeNPC,currentTextNum), getNPCTextID(activeNPC,currentTextNum));
				currentTextNum++;
			} else {
				currentTextNum = 0;
				activeNPC = null;
			}
		}

	
	}
}


$(document).ready(function() {
		console.log(getCookie("playerPosition"));
		addArrowInstructions();

		
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
	
	//attempt to enter a door if a door is tapped
	$(".door").on('touchstart', function() {
		attemptEnteringDoor(this);
	});

	//attempt to enter all doors (see if player is in front of any of them) if player is tapped
	$("#player").on('touchstart', function() {
		$(".door").each(function(index) {
			attemptEnteringDoor(this);
		});
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

function tryShowingEnterInstr() {
	playerCanEnter = false;
	$(".door").each( function() {
		if (playerIntersectingObj($(this))) {
			playerCanEnter = true;
		}
	});

	if (playerCanEnter && !enterInstructionsVisible && needEnterInstr) {
		//make enter instructions pop up if they havent already 
		addEnterInstructions();
		enterInstructionsVisible = true;
	} else if (!playerCanEnter && enterInstructionsVisible) {
		removeEnterInstructions();
		enterInstructionsVisible = false;
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


	tryShowingEnterInstr();


}



//checks if at lest half of player is in door
function playerIntersectingObj(givenObject) {
	var player = $("#player");
	return (givenObject.offset().left < player.offset().left + (player.width() / 2) && givenObject.offset().left + givenObject.width() > player.offset().left + (player.width() / 2));
}



//sets variables for keys to true if they are pressed down
$(document).keydown(function(e) {
	var player = $("#player");
	console.log(e.which);
	e.preventDefault();// makes it so firefox doesnt scroll when arrow keys pressed
	if (e.which == 39) {
		removeArrowInstructions();
		rightArrPressed = true;
	} else if (e.which == 37) {
		leftArrPressed = true;
	}


	//code for going into doors and for jumping
	 if (e.which == 13) {
	    console.log("pressed enter");
	   $(".door").each(function(index) {
		attemptEnteringDoor(this);	
	   });

	   $(".npc").each(function(index) {
		   attemptTalkingNPC(this);
	   });
	  
        } else if (e.which == 32 || e.which == 38) {
	    //if pressing space or up arrow and canJump jump and set canjump to false
	   if (canJump) {
	   	playerYVelocity = -10;
		canJump = false;
	   }
    }
});
//sets variables for keys to false if they are released
$(document).keyup(function(e) {
	if (e.which == 39) {
		rightArrPressed = false;
	} else if (e.which == 37) {
		leftArrPressed = false;
	}
});

//sets a cookie holding the player's position so when they exit a building
//they come back where they left
function setMainCookie() {
  document.cookie = 'playerPosition' + $('#player').position();
}

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

//also taken from stackoverflow
function setCookie(name, value, days)
{
  if (days)
  {
    var date = new Date();
    date.setTime(date.getTime()+days*24*60*60*1000); // ) removed
    var expires = "; expires=" + date.toGMTString(); // + added
  }
  else
    var expires = "";
  document.cookie = name+"=" + value+expires + ";path=/"; // + and " added
}
