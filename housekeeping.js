// set the game at closed cards stage
function playagain() {
	// set card stack for single hand
		// clear existing table
			document.getElementById("userCardTable").innerHTML = "";
		
			var elem1 = document.createElement("tr");
			elem1.setAttribute("id", "userStack");
			document.getElementById("userCardTable").appendChild(elem1);
			document.getElementById("userCardTable").removeAttribute("class");
			
	resetCards();
	
	// reset pot
		board.bet.pot = 0;
	
	//reset status
		document.getElementById("gameStatus").innerHTML = "";
		document.getElementById("dealerStatusText").innerHTML = "";
		document.getElementById("dealerS").innerHTML = "";
		document.getElementById("userStatusText").innerHTML = "";
		document.getElementById("userStatus").innerHTML = "";
		document.getElementById("betStatus").innerHTML = "";
	
	// to show the size of deck and that no cards has been drawn
		document.getElementById("card_count").innerHTML = game_deck["count"];
		document.getElementById("deck_total").innerHTML = (board.gameplay.deck_no)*52;
	
	// insurance button and text
		document.getElementById("insuranceText").innerHTML = "";
		document.getElementById("insuranceBet").innerHTML = "";

	//add insurance button
		var elem2 = document.createElement("input");
		elem2.setAttribute("id", "insuranceButton");
		elem2.setAttribute("class", "otherButton");
		elem2.setAttribute("title", "Insurance bet equal to half of the original bet");
		elem2.setAttribute("alt", "Insurance bet equal to half of the original bet");
		elem2.setAttribute("type", "button");
		elem2.setAttribute("value", "INSURANCE");
		elem2.setAttribute("onclick", "insuranceBet();");
		
		document.getElementById("insuranceText").appendChild(elem2);

//disable buttons
	//disable action buttons
		enableButtons("action", true);
	//disable bet buttons
		enableButtons("bet", true);
	//disable other buttons
		enableButtons("other", true);
	//disalbe hint button
		document.getElementById("hintButton").disabled = true;
}


//pick the number of deck used
function changeDeckNo(x) {
	
	if (x === 8) {
		board.gameplay.deck_no = 8;
		board.gameplay.deck_chosen = "eightDecks";
		enableButtons("deck", false, "eightDecks");
	} else if (x === 6) {
		board.gameplay.deck_no = 6;
		board.gameplay.deck_chosen = "sixDecks";
		enableButtons("deck", false, "sixDecks");
	} else if (x === 4) {
		board.gameplay.deck_no = 4;
		board.gameplay.deck_chosen = "fourDecks";
		enableButtons("deck", false, "fourDecks");
	} else if (x === 2) {
		board.gameplay.deck_no = 2;
		board.gameplay.deck_chosen = "twoDecks";
		enableButtons("deck", false, "twoDecks");
	} else if (x === 1) {
		board.gameplay.deck_no = 1;
		board.gameplay.deck_chosen = "oneDecks";
		enableButtons("deck", false, "oneDecks");
	};
	
	game_deck = createDeck(board.gameplay.deck_no); // make a "big" deck
	playagain();
	
	//enable bets
		if (board.bet.bet_chosen === undefined) { // if no bet from previous round => disable bet button
			enableButtons("bet", false, "bet_Button");
		} else {
			enableButtons("bet", false);
		}
		
	// update bet when change decks
		if (board.gameplay.deck_var === true && board.bet.bet_chosen !== undefined) {
			document.getElementById("betStatus").innerHTML = "$ " + board.bet.curr_bet;
			document.getElementById(board.bet.bet_chosen).disabled = true;
		}
	
	board.gameplay.deck_var = true;
}



// confirming the bet and placing it after picking a desired bet for the round ==> then deal
function confirmBet() {
	if (document.getElementById("bet_Button").disabled === false) {
			// removing key binding
				document.removeEventListener('keyup', doc_keyUp);
				
			//disble bet for the round
				enableButtons("bet", true);
			//disable deck for the round
				enableButtons("deck", true);
	
			// update pot only when a bet is confirmed to be placed
				board.bet.pot = board.bet.curr_bet;
		
			//deal
			var tmp_js = document.createElement("script");

			tmp_js.type = "text/javascript";
			tmp_js.src = "gameplay.js";

			document.body.appendChild(tmp_js);
	};
};



//check playerName for blackjack ===> never used directly ====> user checkWinner()
function checkBJ(playerName) {
	var bj;
	if (board.cardsinfo.bjStatus[playerName] === "bj" && board.cardsinfo.noCards[playerName] === 2) {
		bj = true;
	} else {
		bj = false;
	};
	return bj; // return true if playerName has BJ
}



//function to DETERMINE WINNER and return winner
function checkWinner() {
	var winner = howClose(),
		internal_ins_lose = true,
		names = [];
	
	if ((board.gameplay.split_var).length === 1) { // NOT split
	
			if (checkBJ(user) === true && board.gameplay.dealer_rev === true) { // if user has blackjack
	
				if (checkBJ("dealer") === true) { // both has blackjack
					board.gameplay.win_var[0] = "DRAW";
					bjOutcome(board.gameplay.win_var[0]);
					console.log("draw ===> both has BJ");
				} else if (checkBJ("dealer") === false) { // user has blackjack and so wins
					board.gameplay.win_var[0] = "WIN";
					bjOutcome("BJ");
					console.log("user wins ===> user has BJ");
				};
		
			} else {
	
				if (checkBJ("dealer") === true) { // dealer has blackjack but user does NOT
					board.gameplay.win_var[0] = "LOSE";
					bjOutcome(board.gameplay.win_var[0]);
			
					if (board.gameplay.ins_var === true) { // pays insurance bet
						document.getElementById("insuranceBet").innerHTML = " + $" + board.bet.ins_pot + " + $" + board.bet.ins_pot*2;
						board.bet.userStartCash += board.bet.ins_pot*3;
						document.getElementById("userCash").innerHTML = board.bet.userStartCash;
						internal_ins_lose = false;
						console.log("pay ins bet ===> insurance pot = " + board.bet.ins_pot*3);
					};
				
					console.log("user loses ===> dealer has BJ");
				} else if (board.cardsinfo.bjStatus[user] === "bust" && board.cardsinfo.bjStatus["dealer"] === "bust") { // if both busts
					board.gameplay.win_var[0] = "LOSE";
					bjOutcome(board.gameplay.win_var[0]);
					console.log("lose ===> both busts");
	
		///////////////////// from here on there are no BJ and there is no case where both busts //////////////////////////

				} else if (winner[user] < winner["dealer"]) { // user has number closer to 21 without busting
					board.gameplay.win_var[0] = "WIN";
					bjOutcome(board.gameplay.win_var[0]); // user wins
					console.log("user wins");
				} else if (winner["dealer"] < winner[user]) { // dealer has number lose to 21 without busting
					board.gameplay.win_var[0] = "LOSE";
					bjOutcome(board.gameplay.win_var[0]); // user loses
					console.log("user loses");
				} else if (winner["dealer"] === winner[user]) { // both just as close to 21 without busting
					board.gameplay.win_var[0] = "DRAW";
					bjOutcome(board.gameplay.win_var[0]); // draws
					console.log("draws ===> get same score");
				};
			};
			
	} else { // split
		// making arrays of user's hand's names
			for (var i in board.cardsinfo.players_raw) {
				if (i !== "dealer" && i !== undefined) {
					names.push(i);
				};
			};
			
			// check for winner of each hand
				if (checkBJ("dealer") === true) { // dealer has blackjack
				
					for (var i = 0; i <= board.gameplay.split_times; i++) { // all split hand loses
						board.gameplay.win_var[i] = "LOSE";
					};
				
					if (board.gameplay.ins_var === true) { // pays insurance bet
						document.getElementById("insuranceBet").innerHTML = " + $" + board.bet.ins_pot + " + $" + board.bet.ins_pot*2;
						board.bet.userStartCash += board.bet.ins_pot*3;
						document.getElementById("userCash").innerHTML = board.bet.userStartCash;
						internal_ins_lose = false;
					};
				
				} else {
			
					for (var i = 0; i <= board.gameplay.split_times; i++) {
						if (board.cardsinfo.bjStatus[names[i]] === "bust" && board.cardsinfo.bjStatus["dealer"] === "bust") { // dealer and current hand busts
							board.gameplay.win_var[i] = "LOSE";
						} else if (winner[names[i]] < winner["dealer"]) { // hand has number closer to 21 than dealer without busting
							board.gameplay.win_var[i] = "WIN";
						} else if (winner["dealer"] < winner[names[i]]) { // dealer has number close to 21 than hand without busting
							board.gameplay.win_var[i] = "LOSE";
						} else if (winner["dealer"] === winner[names[i]]) { // both just as close to 21 without busting
							board.gameplay.win_var[i] = "DRAW";
						};	
					};
				};
				bjOutcome(board.gameplay.win_var);
	};
	
	if (internal_ins_lose === true) {
		setTimeout(function() {document.getElementById("insuranceBet").innerHTML = "";}, 500);
	};
	
}



//reveal dealer card
function revealDealerCard() {
	if (board.gameplay.dealer_rev === false) {
		//delete first if not yet
			document.getElementById("dealerStack").deleteCell(1);
		
		//reveal hand
			var addcard1 = document.createElement("td");
			document.getElementById("dealerStack").appendChild(addcard1);
		
			var addcard2 = document.createElement("img");
			addcard2.setAttribute("src", board.cardsinfo.cardName["dealer"][(board.cardsinfo.noCards["dealer"] -1)]);
			addcard2.setAttribute("class", "default");
			addcard1.appendChild(addcard2);
	
		board.gameplay.dealer_rev = true;
	};
}



//win lose status ==> print win status
function bjOutcome(stats) {

		if (board.gameplay.hint_var === true) {
			status_html(user);
		};
		board.gameplay.end_var = true;

	document.getElementById("gameStatus").innerHTML = "";
	
	if ((board.gameplay.split_var).length === 1) { // not split
		
		board.gameplay.round_count += 1;
		
		if (stats === "LOSE") {
			setTimeout(function() {document.getElementById("betStatus").innerHTML = "";}, 500);

		} else if (stats === "WIN") {
			board.gameplay.win_count += 1;

			board.bet.userStartCash += board.bet.pot*2;
			document.getElementById("userCash").innerHTML = board.bet.userStartCash;
			document.getElementById("betStatus").innerHTML = "+ $ " + board.bet.pot + " + $ " + board.bet.pot;
	
		} else if (stats === "DRAW") {
			board.gameplay.win_count += 0.5;
			
			board.bet.userStartCash += board.bet.pot;
			document.getElementById("userCash").innerHTML = board.bet.userStartCash;
			document.getElementById("betStatus").innerHTML = "+ $ " + board.bet.pot;

		} else if (stats === "BJ") { // user has blackjack and wins
			board.gameplay.win_count += 1;
		
			// change  text display for having blackjack
				stats = "have a Blackjack";
				
			board.bet.userStartCash += board.bet.pot*2.5;
			document.getElementById("userCash").innerHTML = board.bet.userStartCash;
			document.getElementById("betStatus").innerHTML = "+ $ " + board.bet.pot + " + $ " + board.bet.pot*(1.5);
		};
	
		document.getElementById("gameStatus").appendChild(document.createElement("td")).innerHTML = "You " + stats + "!";
	
	} else { // split
		
		// clear current betStatus
			document.getElementById("betStatus").innerHTML = "";
			
		var total_winnings = 0;
		
		for (var i = 0; i < stats.length; i ++) {
			board.gameplay.round_count += 1;
			
			// update game win/lose Status
				document.getElementById("userSplitGameText" + (i+1)).innerHTML = stats[i] + "!";
			
			if (stats[i] === "WIN") {
				board.gameplay.win_count += 1;
				
				if (board.gameplay.dd_var[i] === true) { // if a hand win and double down
				
					board.bet.userStartCash += board.bet.curr_bet*4;
					total_winnings += board.bet.curr_bet*4;
					document.getElementById("userCash").innerHTML = board.bet.userStartCash;
					document.getElementById("userSplitBet" + (i+1)).innerHTML = " + $ " + board.bet.curr_bet*2 + " + $ " + board.bet.curr_bet*2;
					
				} else if (board.gameplay.dd_var[i] === false) { // a hand win
					
					board.bet.userStartCash += board.bet.curr_bet*2;
					total_winnings += board.bet.curr_bet*2;
					document.getElementById("userCash").innerHTML = board.bet.userStartCash;
					document.getElementById("userSplitBet" + (i+1)).innerHTML = " + $ " + board.bet.curr_bet + " + $ " + board.bet.curr_bet;
				
				};
				
			} else if (stats[i] === "DRAW") {
				board.gameplay.win_count += 0.5;

				if (board.gameplay.dd_var[i] === true) {
				
					board.bet.userStartCash += board.bet.curr_bet*2;
					total_winnings += board.bet.curr_bet*2;
					document.getElementById("userCash").innerHTML = board.bet.userStartCash;
					document.getElementById("userSplitBet" + (i+1)).innerHTML = " + $ " + board.bet.curr_bet*2;

				} else if (board.gameplay.dd_var[i] === false) {
				
					board.bet.userStartCash += board.bet.curr_bet;
					total_winnings += board.bet.curr_bet;
					document.getElementById("userCash").innerHTML = board.bet.userStartCash;
					document.getElementById("userSplitBet" + (i+1)).innerHTML = " + $ " + board.bet.curr_bet;
					
				};
			} else if (stats[i] === "LOSE") {
				
				document.getElementById("userSplitBet" + (i+1)).innerHTML = "";
				
				console.log("lose => clear text");
			};
		};
		
		document.getElementById("betStatus").innerHTML = "+ $ " + total_winnings;
		// document.getElementById("gameStatus").appendChild(document.createElement("td")).innerHTML = "You " + stats;
	}
	
	
	// update betsWon and winPercent
		//betsWon
			document.getElementById("betsWon").innerHTML = "$" + (board.bet.userStartCash - 500);
		//winPercent
			document.getElementById("winPercent").innerHTML = ((board.gameplay.win_count*100)/board.gameplay.round_count).toFixed(2) + "%";
	return;
}




// check how close to 21
function howClose() {
	var closestOb = {};
		
	// find how much less than 21 for each playerName
	for (var name in board.cardsinfo.currTotals) {	
		closestOb[name] = 99999; // value will be 99999 if all busts
		for (var i=0; i < board.cardsinfo.currTotals[name].length; i ++) {
			var tmp_hold = 21 - board.cardsinfo.currTotals[name][i];
			if (tmp_hold >= 0) {
				if (closestOb[name] > tmp_hold) {
					closestOb[name] = tmp_hold;			
				};
			};
		};
	};
	return closestOb; // distance away from 21 for each playerName
}



//function to check whether to continue hitting
function dealerHitCheck(limit) {
	var hitLimit = false;
	for (var i=0; i < (board.cardsinfo.currTotals["dealer"]).length; i++) {
		if (board.cardsinfo.currTotals["dealer"][i] >= limit && board.cardsinfo.currTotals["dealer"][i] <= 21) {
			hitLimit = true;
			break;
		};
	};
	return hitLimit;
}	





// pressing the bet button
function placeBet(x) {
	if (!(document.getElementById("fiveDol").disabled === true &&
		document.getElementById("tenDol").disabled === true &&
		document.getElementById("fifteenDol").disabled === true &&
		document.getElementById("twentyDol").disabled === true &&
		document.getElementById("fiftyDol").disabled === true &&
		document.getElementById("seventyfiveDol").disabled === true &&
		document.getElementById("onehundredDol").disabled === true &&
		document.getElementById("onehundredfiftyDol").disabled === true &&
		document.getElementById("twohundredDol").disabled === true)) {

		document.getElementById("bet_Button").disabled = false;

			if (board.gameplay.deck_var === true) {
				board.bet.userStartCash += board.bet.curr_bet;
			};

			if (x === 5) {
				board.bet.curr_bet = 5;
				board.bet.bet_chosen = "fiveDol";
				enableButtons("bet", false, "fiveDol");
			} else if (x===10) {
				board.bet.curr_bet = 10;
				board.bet.bet_chosen = "tenDol";
				enableButtons("bet", false, "tenDol");
			} else if (x===15) {
				board.bet.curr_bet = 15;
				board.bet.bet_chosen = "fifteenDol";
				enableButtons("bet", false, "fifteenDol");
			} else if (x===20) {
				board.bet.curr_bet = 20;
				board.bet.bet_chosen = "twentyDol";
				enableButtons("bet", false, "twentyDol");
			} else if (x===50) {
				board.bet.curr_bet = 50;
				board.bet.bet_chosen = "fiftyDol";
				enableButtons("bet", false, "fiftyDol");
			} else if (x===75) {
				board.bet.curr_bet = 75;
				board.bet.bet_chosen = "seventyfiveDol";
				enableButtons("bet", false, "seventyfiveDol");
			} else if (x===100) {
				board.bet.curr_bet = 100;
				board.bet.bet_chosen = "onehundredDol";
				enableButtons("bet", false, "onehundredDol");
			} else if (x===150) {
				board.bet.curr_bet = 150;
				board.bet.bet_chosen = "onehundredfiftyDol";
				enableButtons("bet", false, "onehundredfiftyDol");
			} else if (x===200) {
				board.bet.curr_bet = 200;
				board.bet.bet_chosen = "twohundredDol";
				enableButtons("bet", false, "twohundredDol");
			};

			document.getElementById("betStatus").innerHTML = "$ " + board.bet.curr_bet;
			board.bet.userStartCash -= board.bet.curr_bet;
			document.getElementById("userCash").innerHTML = board.bet.userStartCash;
	};
}
               

// hit in html function
function hit_html(playerName) {
	
		// disable insurance and surrender
			enableButtons("other", true);
			
	
		// make new deck if there are 0 or less cards in deck
			if (game_deck["count"] === 0) {
				game_deck = createDeck(board.gameplay.deck_no);
			};
	
		// draw card
			hit(board.cardsinfo.players_raw, playerName, game_deck);
		
		deck_count_html();
	
		//re-calculate values
			board.cardsinfo.cardSummary = cardValueSummary(board.cardsinfo.players_raw);
			board.cardsinfo.currTotals = addUpCards(board.cardsinfo.cardSummary);
			board.cardsinfo.bjStatus = checkStatus(board.cardsinfo.currTotals);
			board.cardsinfo.cardName = makeCardName(board.cardsinfo.players_raw);
			board.cardsinfo.noCards[playerName] = board.cardsinfo.cardName[playerName].length;
	
		
		if (board.cardsinfo.noCards[findSplitName()[0]] > 2 ) { //already hit once
			// cannot double down after hit once
				document.getElementById("ddButton").disabled = true;
			// canot split after hit once
				document.getElementById("splitButton").disabled = true;
		}
		
		// add card to display
			var addcard2 = document.createElement("img");
			addcard2.setAttribute("src", board.cardsinfo.cardName[playerName][(board.cardsinfo.noCards[playerName] -1)]);

			if (playerName === "dealer") {
				//adding a card to the display
				var addcard1 = document.createElement("td");
				document.getElementById("dealerStack").appendChild(addcard1);
			
				addcard2.setAttribute("class", "default");
				
				// adding img to td child
					addcard1.appendChild(addcard2);
					
			} else {
				if (board.gameplay.split_var.length === 1) { // NOT split
					// cannot double down after hit once
						document.getElementById("ddButton").disabled = true;
						
					//adding a card to the display
						var addcard1 = document.createElement("td");
						document.getElementById("userStack").appendChild(addcard1);
						
						if (board.gameplay.dd_var[0] === true) {
							addcard2.setAttribute("class", "defRotate");
						} else {
							addcard2.setAttribute("class", "default");
						};
					
					// adding img to td child
						addcard1.appendChild(addcard2);
						
					// check if busts
					if (board.cardsinfo.bjStatus[user] === "bust") {
						bjOutcome("LOSE");
				
						// disable hit and stand button
							enableButtons("action", true, "newHandButton");
						// dealer hand
							revealDealerCard()
				
						//	update dealer status if hint is toggled
							if (board.gameplay.hint_var === true) {
								status_html("dealer");
							};
					};
				} else if (board.gameplay.split_var[board.gameplay.curr_hand] === true) {
					//adding a card to the display
						var addcard1 = document.createElement("td");
						document.getElementById(findSplitName()[1]).appendChild(addcard1);
					
					if (board.gameplay.dd_var[board.gameplay.curr_hand] === true) {
						addcard2.setAttribute("class", "defRotate");
					} else {
						addcard2.setAttribute("class", "default");
					};
					
					// adding img to td child
						addcard1.appendChild(addcard2);
						
					// check if busts
					if (board.cardsinfo.bjStatus[findSplitName()[0]] === "bust") {
						//update split hand status
							document.getElementById(findSplitName()[2]).innerHTML = "BUST!";
						if (board.gameplay.curr_hand < board.gameplay.split_times) { // split not last hand
							// change active hand
								cycleSplitHand();
							console.log("cycle-HIT");
						} else if (board.gameplay.curr_hand === board.gameplay.split_times) { // split last hand
							// stand
								stand_html();
						};
					};
				};
				
			};
	
		// if hint is toggled then update status
			if (board.gameplay.hint_var === true) {
				status_html(playerName);
			};
	
/*	} else if (split_var === true) { // split rounds
			
		// if only 1 card in hand
			if (noCards[findSplitName()[0]] > 2 ) { //already hit once
				// cannot double down after hit once
					document.getElementById("ddButton").disabled = true;
	
				// disable insurance
					enableButtons("other", true);
			} else {
				
			};
	}; */		
}



// determind players_raw name from curr_hand
function findSplitName() {
	if ((board.gameplay.split_var).length > 1) {
		var player_name,
			split_table_name,
			split_bet_name,
			split_td;
	
		if (board.gameplay.curr_hand === 0) {
	
			player_name = user;	
			split_table_name = "userSplit1";
			split_bet_name = "userSplitBet1";
			split_td = "splitTD1";
			split_game_text = "userSplitGameText1";
		
		} else {
		
			player_name = "split" + board.gameplay.curr_hand;
			split_table_name = "userSplit" + (board.gameplay.curr_hand+1);
			split_bet_name = "userSplitBet" + (board.gameplay.curr_hand+1);
			split_td = "splitTD" + (board.gameplay.curr_hand+1);
			split_game_text = "userSplitGameText" + (board.gameplay.curr_hand+1);
	
		};
		return [player_name, split_table_name, split_bet_name, split_td, split_game_text];
	} else {
		return [user]
	}

};


// stand function
function stand_html() {
	
	if (board.gameplay.split_var[board.gameplay.curr_hand] === true && (board.gameplay.curr_hand < board.gameplay.split_times)) { // split not last split
		// disable insurance
			enableButtons("other", true, "strategyButton");
	
		// change active hand
			cycleSplitHand();

		// if next hand does NOT have double
			if (checkDouble(findSplitName()[0]) === false) {
				// disable split
					document.getElementById("splitButton").disabled = true;
			} else if (checkDouble(findSplitName()[0]) === true && board.gameplay.split_times < 3) { // has double and has less than 4 total hands
				// enable split
					document.getElementById("splitButton").disabled = false;
			};
			
		console.log("cycle - stand");
	} else if ((board.gameplay.split_var[board.gameplay.curr_hand] === true && (board.gameplay.curr_hand === board.gameplay.split_times)) || (board.gameplay.split_var.length === 1)) { // split and last hand			
		// disable insurance
			enableButtons("other", true, "strategyButton");
		//buttons
			enableButtons("action", true, "newHandButton");
	
		// reveal dealer's card
			revealDealerCard();

		//dealer action stands at 17
			while (dealerHitCheck(17) === false) {
				if (board.cardsinfo.bjStatus["dealer"] === "bust" || board.cardsinfo.bjStatus["dealer"] === "bj") {
					break;
				} else {
					// make new deck if there are 0 or less cards in deck
						if (game_deck["count"] === 0) {
							game_deck = createDeck(deck_no);
						};
		
					hit_html("dealer");
					if (board.gameplay.hint_var === true) {
						status_html("dealer");
					};
				};
			};

		//check for winner
			checkWinner();
			if (board.gameplay.hint_var === true) {
				status_html("dealer");
			};

		console.log("stand2");
	};
}



//double down function
function dd_html() {

			// can only double down once
				document.getElementById("ddButton").disabled = true;
			// disable insurance
				enableButtons("other", true);
	
			// reducing funds to increase bet and pot
				board.bet.userStartCash -= board.bet.curr_bet;
				board.bet.pot += board.bet.curr_bet;
	
			document.getElementById("userCash").innerHTML = board.bet.userStartCash;
			document.getElementById("betStatus").innerHTML = "$ " + board.bet.pot;
	
	
			board.gameplay.dd_var[board.gameplay.curr_hand] = true;
	
				// make new deck if there are 0 or less cards in deck
					if (game_deck["count"] === 0) {
						game_deck = createDeck(board.gameplay.deck_no);
					};
			
				hit_html(findSplitName()[0]);

			// case for split
			if (board.gameplay.split_var.length === 1) { // NOT split
	
				// end hand
					if (board.cardsinfo.bjStatus[user] !== "bust") {
						stand_html();
					};
			
			} else if (board.gameplay.split_var[board.gameplay.curr_hand] === true) { // split
				// update split bet
					document.getElementById(findSplitName()[2]).innerHTML = "$ " + board.bet.curr_bet*2;
		
				// check for bust ===> adjust bjStatus
					if (board.cardsinfo.bjStatus[findSplitName()[0]] === "bust") {
						document.getElementById(findSplitName()[2]).innerHTML = "BUST!";
					}
			
				if (board.gameplay.curr_hand < board.gameplay.split_times) { // split NOT last hand
			
					// change active hand
						cycleSplitHand();
			
					// enable dd after cycled to new hand
						document.getElementById("ddButton").disabled = false;
				
					console.log("cycle - dd1");
				} else if (board.gameplay.curr_hand === board.gameplay.split_times) { // split last hand
					// stand
						stand_html();
				
					console.log("dd2");
				};
			};
	
			return;
}



// cycle to next active hand
function cycleSplitHand() {
	var splitNames = findSplitName(),
		one = splitNames[1];
		three = splitNames[3];
		
	// minimize active hand
		var t_d_one = document.getElementById(one).getElementsByTagName("td");
			
			// looping to apply class to all td under tr
			for (var i = 0; i < t_d_one.length; i++) {
				
				if (board.gameplay.dd_var[board.gameplay.curr_hand] === true && i === (t_d_one.length - 1)) {
					// card size
						t_d_one[i].getElementsByTagName("img")[0].setAttribute("class", "splMinRotate");	
				} else {
					// card size
						t_d_one[i].getElementsByTagName("img")[0].setAttribute("class", "splitMin");
				};
				
   			}
   			// padding
				document.getElementById(three).setAttribute("class", "splitMinTD");

	// update hand #
		board.gameplay.curr_hand += 1;
			// updating dependent variables
				splitNames = findSplitName(),
				one = splitNames[1];
				three = splitNames[3];
	
	// maximize next hand
		var t_d_one = document.getElementById(one).getElementsByTagName("td");
			
			// looping to apply class to all td under tr
			for(var i = 0; i < t_d_one.length; i++) {
				// card size
					t_d_one[i].getElementsByTagName("img")[0].setAttribute("class", "default");
   			}
   			// padding
				document.getElementById(three).removeAttribute("class");
	
	// if only 1 card in new active hand =====> to make 2 cards in hand
		if (board.cardsinfo.noCards[splitNames[0]] === 1) {
			hit_html(splitNames[0]); // ==> hit and add card to display
			
			// user has another ace pair, cannot resplit
			// OR user just split ace, can only hit once
			// OR user does NOT have pair ===> disable split
				if ((board.cardsinfo.cardSummary[splitNames[0]][1].constructor === Array && board.gameplay.ace_var === true && checkDouble(splitNames[0]) === true)
					|| (board.cardsinfo.cardSummary[splitNames[0]][0].constructor === Array)
					|| (checkDouble(splitNames[0]) === false)) {
					
					// disable split
						document.getElementById("splitButton").disabled = true;
					
					if (board.cardsinfo.cardSummary[splitNames[0]][0].constructor === Array) {
						// update hint for user
							if (board.gameplay.hint_var === true) {
								status_html(findSplitName()[0]);
							};
						
						// stand
							stand_html();
					};
					console.log("disable split => cycleSplitHand");
				} else if (checkDouble(splitNames[0]) === true && board.gameplay.split_times < 3){
					// enable split
						document.getElementById("splitButton").disabled = false;
				};				
		};
	
	// update hint for user
	if (board.gameplay.hint_var === true) {
		status_html(findSplitName()[0]);
	};
	
	// enabling all relevatn buttons
		document.getElementById("hitButton").disabled = false;
		document.getElementById("standButton").disabled = false;
		document.getElementById("ddButton").disabled = false;
		document.getElementById("newHandButton").disabled = true;
}



//hint function
function toggleHint() {
	if (document.getElementById("hintButton").disabled === false) {
		if (board.gameplay.hint_var === true) { // now turn hint OFF
			document.getElementById("userStatusText").innerHTML = "";
			document.getElementById("userStatus").innerHTML = "";
	
			document.getElementById("dealerStatusText").innerHTML = "";
			document.getElementById("dealerS").innerHTML = "";
			board.gameplay.hint_var = false;
		} else if (board.gameplay.hint_var === false) { // now turn hint ON
			status_html(user);
			if (board.gameplay.dealer_rev === false) {
				document.getElementById("dealerStatusText").innerHTML = "Dealer has";
	
				document.getElementById("dealerS").innerHTML = board.cardsinfo.cardSummary["dealer"][0];
			} else if (board.gameplay.dealer_rev === true) {
				status_html("dealer");
			};
			board.gameplay.hint_var = true;
		};
	};

/*	
if (end_var === true) {
		document.getElementById("userStatusText").innerHTML = "";
		document.getElementById("userStatus").innerHTML = "";
		hint_var = false;
	} else if (end_var === false) {
		if (hint_var === true) { // now turn hint OFF
			document.getElementById("userStatusText").innerHTML = "";
			document.getElementById("userStatus").innerHTML = "";
		
			hint_var = false;
		} else if (hint_var === false) { // now turn hint ON
			status_html(user);
			hint_var = true;
		};
	};
*/
	return;
}



////new hand function
function newHand_html() {
				
			// placing bet
				board.bet.userStartCash -= board.bet.curr_bet;
				document.getElementById("userCash").innerHTML = board.bet.userStartCash;
	
			//reset cards
			playagain();
		
			document.getElementById("betStatus").innerHTML = "$ " + board.bet.curr_bet;
	
			//enable bets
				enableButtons("bet", false, board.bet.bet_chosen);
			//enable actions
				enableButtons("deck", false, board.bet.deck_chosen);
}



// insurance function
function insuranceBet() {
	board.bet.ins_var = true
	board.bet.ins_pot = (board.bet.pot)/2;
	
	// text showing insurance has been selected
		document.getElementById("insuranceText").innerHTML = "Your insurance bet: ";
		document.getElementById("insuranceBet").innerHTML = "$ " + board.bet.ins_pot;
	
	// update bet status and reduce from user funds
		board.bet.userStartCash -= board.bet.ins_pot;
		document.getElementById("userCash").innerHTML = board.bet.userStartCash;
};




//split function
function split_html(players_raw_name) {
	
	if (board.gameplay.split_times < 3) {
		board.gameplay.split_times += 1;

		// every time split make new dd var
			board.gameplay.dd_var[board.gameplay.split_times] = false;


		// ace pair
		if (checkAceDouble(user) === true) { // can only split aces once.
			board.gameplay.ace_var = true;
		};


		board.bet.userStartCash -= board.bet.curr_bet;
			// Update user bet
				document.getElementById("userCash").innerHTML = board.bet.userStartCash;

		board.bet.pot += board.bet.curr_bet;
			//updating pot
				document.getElementById("betStatus").innerHTML = "$ " + board.bet.pot;

		var newName = "split" + board.gameplay.split_times;
		// split players_raw
			// create new split stack
				board.cardsinfo.players_raw[newName] = [];

			// copy one card from a 2 cards hand called players_raw[players_raw_name] to players_raw["split"] + split_times
				for (var i =0; i < board.cardsinfo.players_raw[players_raw_name].length; i++) {
					// copy and delete second card from first hand
						if (i === 0) {
							// copy
								board.cardsinfo.players_raw[newName][i] = board.cardsinfo.players_raw[players_raw_name][i+1];
			
							// delete
								board.cardsinfo.players_raw[players_raw_name].pop();
						};
				};

		// re-calculate values
			board.cardsinfo.cardSummary = cardValueSummary(board.cardsinfo.players_raw);
			board.cardsinfo.currTotals = addUpCards(board.cardsinfo.cardSummary);
			board.cardsinfo.bjStatus = checkStatus(board.cardsinfo.currTotals);
			board.cardsinfo.cardName = makeCardName(board.cardsinfo.players_raw);
			board.cardsinfo.noCards[players_raw_name] = board.cardsinfo.cardName[players_raw_name].length;
			board.cardsinfo.noCards[newName] = board.cardsinfo.cardName[newName].length;


		// adding card to display
			if (board.gameplay.split_times === 1) { // splitting for the first time

		// setting up table format
				// clear existing table
					document.getElementById("userCardTable").innerHTML = "";

				document.getElementById("userCardTable").setAttribute("class", "userSplitCardStack");
				// win lose status row
					var cc1 = document.createElement("tr");
					cc1.setAttribute("id", "userSplitGameText");
					document.getElementById("userCardTable").appendChild(cc1);
			
						// win-lose game status 1
							var cc2 = document.createElement("td");
							cc2.setAttribute("id", "userSplitGameText1");
							cc2.setAttribute("class", "splitBetText");
					
							document.getElementById("userSplitGameText").appendChild(cc2);
					
						// win-lose game status 2
							var cc2 = document.createElement("td");
							cc2.setAttribute("id", "userSplitGameText2");
							cc2.setAttribute("class", "splitBetText");
			
							document.getElementById("userSplitGameText").appendChild(cc2);
		
				// bet row
					var aa1 = document.createElement("tr");
					aa1.setAttribute("id", "userSplitBet");
					document.getElementById("userCardTable").appendChild(aa1);
		
					// split bet text 1
						var aa2 = document.createElement("td");
						aa2.setAttribute("id", "userSplitBet1");
						aa2.setAttribute("class", "splitBetText");
			
						document.getElementById("userSplitBet").appendChild(aa2);
	
					// split bet text 2
						var aa2 = document.createElement("td");
						aa2.setAttribute("id", "userSplitBet2");
						aa2.setAttribute("class", "splitBetText");
			
						document.getElementById("userSplitBet").appendChild(aa2);

				// card row
					var bb1 = document.createElement("tr");
		
					bb1.setAttribute("id", "userSplitStack");
		
					document.getElementById("userCardTable").appendChild(bb1);
	
						// split hand 1
							var bb2 = document.createElement("td"),
								bb3 = document.createElement("table"),
								bb4 = document.createElement("tr");
									bb2.setAttribute("id", "splitTD1");
									bb4.setAttribute("id", "userSplit1");
		
							bb3.appendChild(bb4);
							bb2.appendChild(bb3);
							bb1.appendChild(bb2);
	
						// split hand 2	
							var bb2 = document.createElement("td"),
								bb3 = document.createElement("table"),
								bb4 = document.createElement("tr");
									bb2.setAttribute("id", "splitTD2");
									bb4.setAttribute("id", "userSplit2");
				
							bb3.appendChild(bb4);
							bb2.appendChild(bb3);
							bb1.appendChild(bb2);

		// displaying hand
				//user first hand
					//first card
						var elem1 = document.createElement("td");
						document.getElementById("userSplit1").appendChild(elem1);

						var elem2 = document.createElement("img");
						elem2.setAttribute("src", board.cardsinfo.cardName[players_raw_name][0]);
						elem2.setAttribute("class", "default");
						elem1.appendChild(elem2);
		
					document.getElementById("userSplitBet1").innerHTML = "$ " + board.bet.curr_bet;
				
				// user second hand => minimized
					//first card
						var elem1 = document.createElement("td");
						document.getElementById("userSplit2").appendChild(elem1);

						var elem2 = document.createElement("img");
						elem2.setAttribute("src", board.cardsinfo.cardName[newName][0]);
						elem2.setAttribute("class", "splitMin");
						elem1.appendChild(elem2);
		
					// setting padding-top to 0 by assigning a class
						document.getElementById("splitTD2").setAttribute("class", "splitMinTD");
		
					document.getElementById("userSplitBet2").innerHTML = "$ " + board.bet.curr_bet;
		
				// enable bet
	//				enableButtons("action", true, "hitButton");
			} else if (board.gameplay.split_times === 2) { // splitting for the second time

		// setting up table format

				// win lose status
					// win-lose game status 3
							var cc2 = document.createElement("td");
							cc2.setAttribute("id", "userSplitGameText3");
							cc2.setAttribute("class", "splitBetText");
					
							document.getElementById("userSplitGameText").appendChild(cc2);
		
				// bet row			
					// bet split text 3			
						var aa2 = document.createElement("td");
						aa2.setAttribute("id", "userSplitBet3");
						aa2.setAttribute("class", "splitBetText");
			
						document.getElementById("userSplitBet").appendChild(aa2);

				// card row	
					// split hand 3	
						var bb2 = document.createElement("td"),
							bb3 = document.createElement("table"),
							bb4 = document.createElement("tr");
								bb2.setAttribute("id", "splitTD3");		
								bb4.setAttribute("id", "userSplit3");
				
						bb3.appendChild(bb4);
						bb2.appendChild(bb3);
						document.getElementById("userSplitStack").appendChild(bb2);

		// displaying hand

				//user first hand
						// clear current card
							document.getElementById(findSplitName()[1]).innerHTML = "";
					//first card
						var elem1 = document.createElement("td");
						document.getElementById(findSplitName()[1]).appendChild(elem1);

						var elem2 = document.createElement("img");
						elem2.setAttribute("src", board.cardsinfo.cardName[players_raw_name][0]);
						elem2.setAttribute("class", "default");
						elem1.appendChild(elem2);

				// user second hand => minimized
					//first card
						var elem1 = document.createElement("td");
						document.getElementById("userSplit3").appendChild(elem1);

						var elem2 = document.createElement("img");
						elem2.setAttribute("src", board.cardsinfo.cardName[newName][0]);
						elem2.setAttribute("class", "splitMin");
						elem1.appendChild(elem2);
	
					// setting padding-top to 0 by assigning a class
						document.getElementById("splitTD3").setAttribute("class", "splitMinTD");
	
					document.getElementById("userSplitBet3").innerHTML = "$ " + board.bet.curr_bet; 
	
			} else if (board.gameplay.split_times === 3) { // splitting for the third and last time

		// setting up table format
		
				// win lose status
					// win-lose game status 3
							var cc2 = document.createElement("td");
							cc2.setAttribute("id", "userSplitGameText4");
							cc2.setAttribute("class", "splitBetText");
					
							document.getElementById("userSplitGameText").appendChild(cc2);
		
				// bet row
					// bet split text 4		
						var aa2 = document.createElement("td");
						aa2.setAttribute("id", "userSplitBet4");
						aa2.setAttribute("class", "splitBetText");
		
						document.getElementById("userSplitBet").appendChild(aa2);
	

				// card row	
					// split hand 4	
						var bb2 = document.createElement("td"),
							bb3 = document.createElement("table"),
							bb4 = document.createElement("tr");
								bb2.setAttribute("id", "splitTD4");
								bb4.setAttribute("id", "userSplit4");
				
						bb3.appendChild(bb4);
						bb2.appendChild(bb3);
						document.getElementById("userSplitStack").appendChild(bb2);

		// displaying hand	
	
				//user first hand
						// clear current card
							document.getElementById(findSplitName()[1]).innerHTML = "";
					//first card
						var elem1 = document.createElement("td");
						document.getElementById(findSplitName()[1]).appendChild(elem1);

						var elem2 = document.createElement("img");
						elem2.setAttribute("src", board.cardsinfo.cardName[players_raw_name][0]);
						elem2.setAttribute("class", "default");
						elem1.appendChild(elem2);

				// user second hand => minimized
					//first card
						var elem1 = document.createElement("td");
						document.getElementById("userSplit4").appendChild(elem1);

						var elem2 = document.createElement("img");
						elem2.setAttribute("src", board.cardsinfo.cardName[newName][0]);
						elem2.setAttribute("class", "splitMin");
						elem1.appendChild(elem2);
	
					// setting padding-top to 0 by assigning a class
						document.getElementById("splitTD4").setAttribute("class", "splitMinTD");
			
					// update hand's bet display
					document.getElementById("userSplitBet4").innerHTML = "$ " + board.bet.curr_bet;
			
					// disable split because has reached the max number of hands
						document.getElementById("splitButton").disabled = true;
			};

		// AFTER finish splitting then hit active hand to make 2 cards in hand
			hit_html(players_raw_name); // ==> hit and add card to display
	
			// if the drawn card IS an ace and ALREADY SPLIT ace   OR   the current hand is NOT a pair ====> disable split
				if ((board.gameplay.ace_var === true && board.cardsinfo.cardSummary[players_raw_name][1].constructor === Array) || (checkDouble(players_raw_name) === false)) {
					document.getElementById("splitButton").disabled = true; // disable split because cannot re split aces OR current hand is not pair
				};
	
			// if first card is ace then can only hit once.
				if (board.cardsinfo.cardSummary[players_raw_name][0].constructor === Array) {
					cycleSplitHand();
					console.log("only hit once after split aces");
				};
	} else {
		// disable split
			document.getElementById("splitButton").disabled = true;
	};
	return;
}


// check 2 card hand for a double
function checkDouble(playerName) {
	if (checkAceDouble(playerName) === true) {
		return true;
	} else if (board.cardsinfo.cardSummary[playerName][0] === board.cardsinfo.cardSummary[playerName][1]) {
		return true
	} else {
		return false;
	};
	
/*	for (var i in players_raw[playerName]["round1"]) {
		for (var j in players_raw[playerName]["round2"]) {
			if (players_raw[playerName]["round1"][i]["value"] === players_raw[playerName]["round2"][j]["value"]) {
				return true;
			} else {
				return false;
			};
		};
	};
*/
};


// check for double ace
function checkAceDouble(playerName) {
	if ((board.cardsinfo.cardSummary[playerName][0].constructor === Array)
		&& (board.cardsinfo.cardSummary[playerName][1].constructor === Array)) { // A pair
		return true;
	} else {
		return false;
	};
	
/*	for (var i in players_raw[playerName]["round1"]) {
		for (var j in players_raw[playerName]["round2"]) {
			if ((players_raw[playerName]["round2"][j]["value"] === "A") 
				&& (players_raw[playerName]["round1"][i]["value"] === "A")) {
				return true;
			} else {
				return false;
			};
		};
	};
*/
}



// surrender option
function surrender_html() {
	
	// late surrender
		// dealer has blackjack
			if (board.cardsinfo.bjStatus["dealer"] === "bj") {
				confirm("Dealer has a Blackjack, you may not surrender.");
				
				// disable surrender
					document.getElementById("surrenderButton").disabled = true;
			} else { // dealer does not have a natural
				board.gameplay.round_count += 1;
				
				// disable all buttons
					//disable action buttons
						enableButtons("action", true, "newHandButton");
					//disable bet buttons
						enableButtons("bet", true);
					//disable other buttons
						enableButtons("other", true);
				
				//reveal dealer card
					revealDealerCard()
				
				// lose half bet
					board.bet.userStartCash += (board.bet.pot)/2;
					document.getElementById("userCash").innerHTML = board.bet.userStartCash;
					document.getElementById("betStatus").innerHTML = "+ $ " + (board.bet.pot)/2;
				
				// game status
					document.getElementById("gameStatus").appendChild(document.createElement("td")).innerHTML = "You SURRENDER!";
				
			};
};



function basicStrategy() {
	
	if (board.gameplay.deck_no === 1) {
		window.open("https://www.blackjackinfo.com/blackjack-basic-strategy-engine/?numdecks=1&soft17=s17&dbl=all&das=yes&surr=ls&peek=no");
	} else if (board.gameplay.deck_no === 2) {
		window.open("https://www.blackjackinfo.com/blackjack-basic-strategy-engine/?numdecks=2&soft17=s17&dbl=all&das=yes&surr=ls&peek=no");
	} else if (board.gameplay.deck_no === 4) {
		window.open("https://www.blackjackinfo.com/blackjack-basic-strategy-engine/?numdecks=4&soft17=s17&dbl=all&das=yes&surr=ls&peek=no");
	} else if (board.gameplay.deck_no === 6) {
		window.open("https://www.blackjackinfo.com/blackjack-basic-strategy-engine/?numdecks=6&soft17=s17&dbl=all&das=yes&surr=ls&peek=no");
	} else if (board.gameplay.deck_no === 8) {
		window.open("https://www.blackjackinfo.com/blackjack-basic-strategy-engine/?numdecks=8&soft17=s17&dbl=all&das=yes&surr=ls&peek=no");
	};	
}

/////////////////////////////// button functions ///////////////////////////////
function hit_button_html() {
	if (document.getElementById("hitButton").disabled === false) {
		hit_html(findSplitName()[0]);
	};
}



function dd_button_html() {
	if (document.getElementById("ddButton").disabled === false) {
		dd_html();
	};
}



function split_button_html() {
	if (document.getElementById("splitButton").disabled === false) {	
		
		// pre split function to tell split function which hand to split
		board.gameplay.split_var[board.gameplay.split_times] = true;
		board.gameplay.split_var[(board.gameplay.split_times +1)] = true;

		// split active hand
			split_html(findSplitName()[0]);
	};
}



function stand_button_html() {
	if (document.getElementById("standButton").disabled === false) {
		stand_html();
	};
}



function newHand_button_html() {
	if (document.getElementById("newHandButton").disabled === false) {
		newHand_html();
	};	
}


/////////////////////////////// helper functions ///////////////////////////////

// updating deck count
function deck_count_html() {
	document.getElementById("card_count").innerHTML = game_deck["count"];
	document.getElementById("deck_total").innerHTML = (board.gameplay.deck_no)*52;
	return;
}



// function to enable/disable buttons
function enableButtons(buttontype, main_logical, exception) {
	if (buttontype === "action") {
		if (main_logical === true) {
			document.getElementById("hitButton").disabled = true;
			document.getElementById("standButton").disabled = true;
			document.getElementById("ddButton").disabled = true;
			document.getElementById("splitButton").disabled = true;
			document.getElementById("newHandButton").disabled = true;
		} else if (main_logical === false) {
			document.getElementById("hitButton").disabled = false;
			document.getElementById("standButton").disabled = false;
			document.getElementById("ddButton").disabled = false;
			document.getElementById("splitButton").disabled = false;
			document.getElementById("newHandButton").disabled = false;
		};
	} else if (buttontype === "bet") {
		if (main_logical === true) {
			document.getElementById("fiveDol").disabled = true;
			document.getElementById("tenDol").disabled = true;
			document.getElementById("fifteenDol").disabled = true;
			document.getElementById("twentyDol").disabled = true;
			document.getElementById("fiftyDol").disabled = true;
			document.getElementById("seventyfiveDol").disabled = true;
			document.getElementById("onehundredDol").disabled = true;
			document.getElementById("onehundredfiftyDol").disabled = true;
			document.getElementById("twohundredDol").disabled = true;
			document.getElementById("bet_Button").disabled = true;
		} else if (main_logical === false) {
			document.getElementById("fiveDol").disabled = false;
			document.getElementById("tenDol").disabled = false;
			document.getElementById("fifteenDol").disabled = false;
			document.getElementById("twentyDol").disabled = false;
			document.getElementById("fiftyDol").disabled = false;
			document.getElementById("seventyfiveDol").disabled = false;
			document.getElementById("onehundredDol").disabled = false;
			document.getElementById("onehundredfiftyDol").disabled = false;
			document.getElementById("twohundredDol").disabled = false;
			document.getElementById("bet_Button").disabled = false;
		};	
	} else if (buttontype === "deck") {
		if (main_logical === true) {
			document.getElementById("eightDecks").disabled = true;
			document.getElementById("sixDecks").disabled = true;
			document.getElementById("fourDecks").disabled = true;
			document.getElementById("twoDecks").disabled = true;
			document.getElementById("oneDecks").disabled = true;
		} else if (main_logical === false) {
			document.getElementById("eightDecks").disabled = false;
			document.getElementById("sixDecks").disabled = false;
			document.getElementById("fourDecks").disabled = false;
			document.getElementById("twoDecks").disabled = false;
			document.getElementById("oneDecks").disabled = false;
		};
	} else if (buttontype === "other") {
		if (document.getElementById("insuranceButton") !== null) {
			if (main_logical === true) {
				document.getElementById("insuranceButton").disabled = true;
				document.getElementById("surrenderButton").disabled = true;
				document.getElementById("strategyButton").disabled = true;
			} else if (main_logical === false) {
				document.getElementById("insuranceButton").disabled = false;
				document.getElementById("surrenderButton").disabled = false;
				document.getElementById("strategyButton").disabled = false;
			};
		};
	};
	
	if (exception !== undefined) {
		if (exception.constructor === Array) {
			for (var i=0; i < exception.length; i++) {
				if (main_logical === true) {
					document.getElementById(exception[i]).disabled = false;
				} else if (main_logical === false) {
					document.getElementById(exception[i]).disabled = true;
				};
			};
		} else {
			if (main_logical === true) {
				document.getElementById(exception).disabled = false;
			} else if (main_logical === false) {
				document.getElementById(exception).disabled = true;
			};
		};
	};
}



//// updating total - removing previous
function status_html(playerName) {
	if (playerName !== "dealer") {
		document.getElementById("userStatusText").innerHTML = "You have ";

		document.getElementById("userStatus").innerHTML = board.cardsinfo.currTotals[findSplitName()[0]];
	} else if (playerName === "dealer") {
		document.getElementById("dealerStatusText").innerHTML = "Dealer has ";
		
		document.getElementById("dealerS").innerHTML = board.cardsinfo.currTotals["dealer"];
	};
	return;
}



//// resetting to back of cards setup
function resetCards() {
	document.getElementById("dealerStack").innerHTML = "";
	document.getElementById("userStack").innerHTML = "";
	
	//closed dealer card
		var elem1 = document.createElement("td");
		document.getElementById("dealerStack").appendChild(elem1);

		var elem2 = document.createElement("img");
		elem2.setAttribute("src", "cards/back.png");
		elem2.setAttribute("class", "defaultB");
		elem1.appendChild(elem2);
		
	//user space card
		var elem1 = document.createElement("td");
		document.getElementById("userStack").appendChild(elem1);

		var elem2 = document.createElement("img");
		elem2.setAttribute("src", "cards/back.png");
		elem2.setAttribute("class", "defaultB");
		elem1.appendChild(elem2);
}