// 

// function to repeat "smth" action
function repeatA(noTimes, smth) {
	for (var i = 1; i <= noTimes; i++) {
		smth;
	};
}

// function to repeat fuction with input
function repeat(noTimes, smth) {
	for (var i = 1; i <= noTimes; i++) {
		smth(i);
	};
}

// do function then only if the conditon, test is true
function onlyif(test, then) {
	if (test) {
		then();
	};
}

// do function if the condition, test is not true
function unless(test, then) {
	if (!test) {
		then();
	};
}