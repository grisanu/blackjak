//initial draw		
	board.cardsinfo.tmp = initialHand(user);
	board.cardsinfo.players_raw = board.cardsinfo.tmp[1];
	board.cardsinfo.cardSummary = cardValueSummary(board.cardsinfo.players_raw);
	board.cardsinfo.currTotals = addUpCards(board.cardsinfo.cardSummary);
	board.cardsinfo.bjStatus = checkStatus(board.cardsinfo.currTotals);
	board.cardsinfo.cardName = makeCardName(board.cardsinfo.players_raw);
	board.cardsinfo.noCards = {dealer: board.cardsinfo.cardName["dealer"].length};
	board.cardsinfo.noCards[user] = board.cardsinfo.cardName[user].length;
	
	board.bet.ins_pot = "";
	
	board.gameplay.deck_chosen = "";
	board.gameplay.dd_var = [false];
	board.gameplay.split_var = [false];
	board.gameplay.win_var = [];
	board.gameplay.end_var = false;
	board.gameplay.dealer_rev = false;
	board.gameplay.stand_var = false;
	board.gameplay.ins_var = false;
	board.gameplay.ace_var = false;
	board.gameplay.split_times = 0;
	board.gameplay.curr_hand = 0;

//update card count	
	deck_count_html();
	
//emptying userStack and dealerStack
	document.getElementById("dealerStack").innerHTML = "";
	document.getElementById("userStack").innerHTML = "";
		
if (board.bet.userStartCash <= 0) {

	document.getElementById("gameStatus").innerHTML = "";
	document.getElementById("gameStatus").appendChild(document.createElement("td")).innerHTML = "GAME OVER! YOU ARE OUT OF CASH.";
	
} else {

	// displaying cards				
		// dealer
			// first dealer card
				var elem1 = document.createElement("td");
				document.getElementById("dealerStack").appendChild(elem1);
	
				var elem2 = document.createElement("img");
				elem2.setAttribute("src", board.cardsinfo.cardName["dealer"][0]);
				elem2.setAttribute("class", "default");
				elem1.appendChild(elem2);
				
			// second closed dealer card ==> closed
				var elem1 = document.createElement("td");
				document.getElementById("dealerStack").appendChild(elem1);
	
				var elem2 = document.createElement("img");
				elem2.setAttribute("src", "cards/back.png");
				elem2.setAttribute("class", "defaultB");
				elem1.appendChild(elem2);
		
		//user
			//first card
				var elem3 = document.createElement("td");
				document.getElementById("userStack").appendChild(elem3);
	
				var elem4 = document.createElement("img");
				elem4.setAttribute("src", board.cardsinfo.cardName[user][0]);
				elem4.setAttribute("class", "default");
				elem3.appendChild(elem4);
	
			//second card
				var elem5 = document.createElement("td");
				document.getElementById("userStack").appendChild(elem5);
	
				var elem6 = document.createElement("img");
				elem6.setAttribute("src", board.cardsinfo.cardName[user][1]);
				elem6.setAttribute("class", "default");
				elem5.appendChild(elem6);		
	
	// disable split button
		document.getElementById("splitButton").disabled = true;
	// enable surrender
		document.getElementById("surrenderButton").disabled = false;
	
	//update status if hint is on
		if (board.gameplay.hint_var === true) {
			status_html(user);
			if (board.gameplay.dealer_rev === false) { // if closed dealer card has yet been revealed
				document.getElementById("dealerStatusText").innerHTML = "Dealer has ";
				document.getElementById("dealerS").innerHTML = board.cardsinfo.cardSummary["dealer"][0];
			} else if (board.gameplay.dealer_rev === true) { // no closed dealer card
				status_html("dealer");
			};
		};

		//enable hint button
			document.getElementById("hintButton").disabled = false;
		//enable strategy
			document.getElementById("strategyButton").disabled = false;
	
	// user has blackjack
		if (checkBJ(user) === true) {
		
			// disable surrender
				document.getElementById("surrenderButton").disabled = true;
				
			// reveal dealer cards, no need to hit
				revealDealerCard();
			// after reveal a card then determine winner
				checkWinner();
			// enable newhand
				document.getElementById("newHandButton").disabled = false;
			// here text is displayed
				console.log("case1 => bj user");
		} else { // user does not have blackjack
			// enable action buttons
				enableButtons("action", false, "newHandButton");
		
			// prompting for insurance only if user DOES NOT have BJ
				if (board.cardsinfo.cardSummary["dealer"][0].constructor === Array) {
					confirm("Dealer has opened an Ace. You can choose to take insurance.");
					document.getElementById("insuranceButton").disabled = false;
				};
			
			// if user has a pair then enable split button
				if (checkDouble(user) === true) {
					// enable split
						document.getElementById("splitButton").disabled = false;
	
				} else {
					// disable split
						document.getElementById("splitButton").disabled = true;
				};
		};
		
		
		// set key binding
			// define a handler
				function doc_keyUp(e) {
					if (Date.now() - lastMove > 500) {
					
						// hit
							if (e.keyCode === 65) { // letter a
								hit_button_html();
							} 
						// double down
							else if (e.keyCode === 83) { // letter s
								dd_button_html();
							} 
						// split
							else if (e.keyCode === 68) { // letter d
								split_button_html();
							} 
						// stand
							else if (e.keyCode === 70) { // letter f
								stand_button_html();
							} 
						// new hand
							else if (e.keyCode === 71) { // letter g
								newHand_button_html();
							}
						// confirm bet
							else if (e.keyCode === 66) { // letter b
								confirmBet();
							}
						// hint
							else if (e.keyCode === 87) { // letter w
								toggleHint();
							}
						// $5
							else if (e.keyCode === 49) { // letter 1
								placeBet(5);
							}
						// $10
							else if (e.keyCode === 50) { // letter 2
								placeBet(10);
							}
						// $15
							else if (e.keyCode === 51) { // letter 3
								placeBet(15);
							}
						// $20
							else if (e.keyCode === 52) { // letter 4
								placeBet(20);
							}
						// $50
							else if (e.keyCode === 53) { // letter 5
								placeBet(50);
							}
						// $75
							else if (e.keyCode === 54) { // letter 6
								placeBet(75);
							}
						// $100
							else if (e.keyCode === 55) { // letter 7
								placeBet(100);
							}
						// $150
							else if (e.keyCode === 56) { // letter 8
								placeBet(150);
							}
						// $200
							else if (e.keyCode === 57) { // letter 9
								placeBet(200);
							};
							
						lastMove = Date.now();
					};
				}
				
			// adding event listener
				document.addEventListener('keyup', doc_keyUp, false);

};