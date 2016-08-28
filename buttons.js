//////////////////////   BUTTONS   //////////////////////

//hit button
	var elem7 = document.createElement("td");
	document.getElementById("userButtons").appendChild(elem7);

	var elem8 = document.createElement("input");
	elem8.setAttribute("id", "hitButton");
	elem8.setAttribute("class", "actionButton");
	elem8.setAttribute("title", "Draws an additional card");
	elem8.setAttribute("alt", "Draws an additional card");
	elem8.setAttribute("type", "button");
	elem8.setAttribute("value", "HIT (A)");
	elem8.setAttribute("onclick", "hit_button_html()");
	elem7.appendChild(elem8);

//double down button
	var elem1 = document.createElement("td");
	document.getElementById("userButtons").appendChild(elem1);
	
	var elem2 = document.createElement("input");
	elem2.setAttribute("id", "ddButton");
	elem2.setAttribute("class", "actionButton");
	elem2.setAttribute("title", "Increase initial bet by 100% and committing to stand after receiving exactly 1 more card");
	elem2.setAttribute("alt", "Increase initial bet by 100% and committing to stand after receiving exactly 1 more card");
	elem2.setAttribute("type", "button");
	elem2.setAttribute("value", "DOUBLE DOWN (S)");
	elem2.setAttribute("onclick", "dd_button_html()");
	elem1.appendChild(elem2);



//split button
	var elem1 = document.createElement("td");
	document.getElementById("userButtons").appendChild(elem1);
	
	var elem2 = document.createElement("input");
	elem2.setAttribute("id", "splitButton");
	elem2.setAttribute("class", "actionButton");
	elem2.setAttribute("title", "Split a hand of 2 same value cards into 2 hands, placing an additional bet equal to the first. Each hand is then played out separately.");
	elem2.setAttribute("alt", "Split a hand of 2 same value cards into 2 hands, placing an additional bet equal to the first. Each hand is then played out separately.");
	elem2.setAttribute("type", "button");
	elem2.setAttribute("value", "SPLIT (D)");
	elem2.setAttribute("onclick", "split_button_html()");
	elem1.appendChild(elem2);
	
	
	
//stand button
	var elem9 = document.createElement("td");
	document.getElementById("userButtons").appendChild(elem9);

	var elem10 = document.createElement("input");
	elem10.setAttribute("id", "standButton");
	elem10.setAttribute("class", "actionButton");
	elem10.setAttribute("title", "Take no more cards");
	elem10.setAttribute("alt", "Take no more cards");
	elem10.setAttribute("type", "button");
	elem10.setAttribute("value", "STAND (F)");
	elem10.setAttribute("onclick", "stand_button_html()");
	elem9.appendChild(elem10);


	
//new hand button
	var elem1 = document.createElement("td");
	document.getElementById("userButtons").appendChild(elem1);
	
	var elem2 = document.createElement("input");
	elem2.setAttribute("id", "newHandButton");
	elem2.setAttribute("class", "actionButton");
	elem2.setAttribute("title", "Play another round");
	elem2.setAttribute("alt", "Play another round");
	elem2.setAttribute("type", "button");
	elem2.setAttribute("value", "NEW HAND (G)");
	elem2.setAttribute("onclick", "newHand_button_html()");
	elem2.disabled = false;
	elem1.appendChild(elem2);