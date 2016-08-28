// function to create x number of decks full standard decks in order
function createDeck(x) {
    var deck = {},
        cardFace = ["c", "d", "h", "s"],
        cardValue = [2,3,4,5,6,7,8,9,10,"J","Q","K","A"],
        i = 1;
    
    for (var noOfDeck = 1; noOfDeck <=x; noOfDeck++) {
        for (var j in cardValue) {
            for (var k in cardFace) {
                deck["card"+i] = 
                {value: cardValue[j], face: cardFace[k]};
                i += 1;
            };
        };
    };
    
    //create count property
		deck["count"] = 52*x;
		deck["total"] = 52*x;
    
    return deck;
}


// function to draw x no of cards from a deck size y, and updating the deck =>removing cards that has already been drawn
function drawCard(xCards, deck) {
	// function to pick a random card from x no of cards
		function randCard(x) {
			return Math.floor(Math.random()*x +1);
		};

	var cardsDrawn = {},
		tmpCard;

	// count cards in deck	
		for (var i=1; i <= xCards; i++) {
			tmpCard = "card"+randCard(deck["total"]); // ramdom number from card1 to card"total" ==> 52*no of decks

			// if card has already been drawn
				while (deck[tmpCard] === undefined) {
					tmpCard = "card"+randCard(deck["total"]);   
				}

			// add card
				cardsDrawn[tmpCard] = deck[tmpCard];
			// remove card from deck
				delete deck[tmpCard];
			// update yDecksize
				deck["count"] -= 1;

			// check if tmpCard has been removed from deck
				if (deck[tmpCard] !== undefined) {
					return console.log("Error");
				};
		};
    return cardsDrawn;
}


//deal first hand to all players
function initialHand(userName, noOfAI) {
	if (noOfAI === undefined) {
		noOfAI = 0;
	}

	// initialize variables
		var players = {};

/////////////deal to each player including dealer => initial hand/////////////
	for (var round=1; round<=2; round++) {
		for (var i=1; i<=noOfAI+1; i++) {
			//first player is always the user
				if (i === 1) { //FIRST
					if (round === 1) {
						players[userName] = [];
					};
					//if there are <= 0 cards in deck then make new deck
						if (game_deck["count"] === 0) {
							game_deck = createDeck(deck_no);
						};
						
					players[userName].push(drawCard(1, game_deck));

				} else { // AI
					if (round === 1) {
						players["AI"+i] = [];
					};
					//if there are <= 0 cards in deck then make new deck
						if (game_deck["count"] === 0) {
							game_deck = createDeck(deck_no);
						};
					
					players["AI"+i].push(drawCard(1, game_deck));
	
				};
		};
	};
		
	// if there are <= 0 cards in deck then make new deck
		if (game_deck["count"] === 0) {
			game_deck = createDeck(deck_no);
		};
	// deal to dealer
		players["dealer"] = [];
	
	players["dealer"].push(drawCard(1, game_deck));
	
	// if there are <= 0 cards in deck then make new deck
		if (game_deck["count"] === 0) {
			game_deck = createDeck(deck_no);
		};

	players["dealer"].push(drawCard(1, game_deck));
		
//////////////////////////////////////////////////////////////////////////////
	return [game_deck, players];
}



//changing card into png file names
function makeCardName(players_raw) {
	var i = 0, fullName = {};
	for (var username in players_raw) {
	    fullName[username] = [];
	    for (var rounds=0; rounds < players_raw[username].length; rounds++) {
		    var value, face;
		    for (var cardID in players_raw[username][rounds]) {
			    if (players_raw[username][rounds][cardID]["value"].constructor === String) {
				    value = players_raw[username][rounds][cardID]["value"].toLowerCase();
			    } else {
				    value = players_raw[username][rounds][cardID]["value"];
			    };
			    fullName[username].push("cards/" + value + "_" + players_raw[username][rounds][cardID]["face"] + ".png");
				
			    i+=1;
		    };
	    };
	};
	return fullName;
}



//summarizes card value of each player into readable format
function cardValueSummary(players_raw) { //use raw player object from initial hand
    //calculate card value
		function calculateCardValue(cardValue) {
			// if card is a number or a string
				if (cardValue.constructor === Number) {
					cardValue = cardValue.toString()
				} else if (cardValue.constructor === String) {
					cardValue = cardValue.toLowerCase();
				};
	
			// convert to numerical value
				if (cardValue === "j" || cardValue === "q" || cardValue === "k") {
					cardValue = 10;
				} else if (cardValue === "a") {
					cardValue = [1,11];
				} else {
					cardValue = Number(cardValue);
				};
	
			return cardValue;
		}
		
    var cardValAll = {};
    
    //calculate values
		for (var nameOfUser in players_raw) {
			cardValAll[nameOfUser] = [];
			for (var roundNo=0; roundNo < players_raw[nameOfUser].length; roundNo++) {
				for (var cardNo in players_raw[nameOfUser][roundNo]) {
					cardValAll[nameOfUser].push(calculateCardValue(players_raw[nameOfUser][roundNo][cardNo]["value"]));
				};
			};
		};
    
    return cardValAll;
}



//add up all open cards for each player to give all possible sum
function addUpCards(players) { // use output from cardValueSummary
    var totalValue = {};
    for (var py in players) {
        totalValue[py] = [];
        
        var numOfA = 0,
            sumOfOthers = 0;
        
        for (var i=0; i < players[py].length; i++) {
            if (players[py][i].constructor === Array) { // if ace
                numOfA += 1;
            } else {
                sumOfOthers += players[py][i];
            };
        };
        
        for (var i=0; i <= numOfA; i++) {
            totalValue[py].push(i*1 + (numOfA-i)*11 + sumOfOthers);
        };
    };
    return totalValue;
}



//check if has blackhjack or busts
function checkStatus(totalValue) { // use output from addUpcards
    var status = {};
    for (var py in totalValue) {
        if (totalValue[py].length === 1) { // no aces
            if (totalValue[py] > 21) {
                status[py] = "bust";
            } else if (totalValue[py] === 21) {
                status[py] = "bj";
            } else {
                status[py] = "nth";
            };
        } else { // >= 1 ace
            for (var i=0; i<totalValue[py].length; i++) {
                if (totalValue[py][i] === 21) { // if has bj
                    status[py] = "bj";
                    break;
                } else {
                    if (status[py] === undefined) {
                        if (totalValue[py][i] > 21) {
                            status[py] = "bust";
                        } else {
                            status[py] = "nth";
                        };
                    } else if (status[py] === "bust" && totalValue[py][i] > 21) {
                        status[py] = "bust";
                    } else {
                        status[py] = "nth";
                    };
                };
            };
        };
    };
    return status;
}



//HITTING ==> adding one card to a player
function hit(players_raw, username, deck) {
    var count = players_raw[username].length;
	    
    //draw card and put in curr player ==> adjusting curr player as a side effect
    	players_raw[username].push(drawCard(1, deck));
    
    
    //return values
		var card_array = cardValueSummary(players_raw),
			status_summary = checkStatus(addUpCards(card_array));
    
    return [card_array, status_summary];
}


/*
//strategy function => function to recommend what to do based on basic strategy
function basicStrategy() {
	if (cardSummary["dealer"][0] === 2) {
		if (currTotals[user] >= 4 && currTotals[user] <= 8) {
		
		}
	} else if (cardSummary["dealer"][0] === 3) {
	
	} else if (cardSummary["dealer"][0] === 4) {
	
	} else if (cardSummary["dealer"][0] === 5) {
	
	} else if (cardSummary["dealer"][0] === 6) {
	
	} else if (cardSummary["dealer"][0] === 7) {
	
	} else if (cardSummary["dealer"][0] === 8) {
	
	} else if (cardSummary["dealer"][0] === 9) {
	
	} else if (cardSummary["dealer"][0] === 10) {
	
	} else if (cardSummary["dealer"][0].constructor === Array) {
	
	} else {
		console.log("Error: basicStrategy() => " + cardSummary["dealer"][0]);
	};	
	return;	
}
*/

/* 
//reducing numbers arrays
//function reduce_(ob, f) {
//	if (ob.constructor === Array) {
		var tmp = ob[0];
		for (var i=1; i<ob.length; i++) {
			tmp = f(tmp, ob[i])
		};
	};
	return tmp;
}

//add
function add_(a,b) {
	return a+b;
} 
*/