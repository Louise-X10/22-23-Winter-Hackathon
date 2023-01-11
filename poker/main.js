const cardPath = 'cardsSVG/';
const tokenPath = 'tokensSVG/';

class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
        this.number = value;
        this.location = cardPath + suit + '_' + value + '.svg';
        this.flipped = false;
        this.container = null;

        switch(this.number){
            case "king":
                this.number = 13;
                break;
            case "queen": 
                this.number = 12;
                break;
            case "jack":
                this.number = 11;
                break;
            case "ace":
                this.number = 14; // or 1
        }
    }

    displayCard (cardID, table) {
        // Create card syntax
        this.container = document.createElement('div');
        this.container.classList.add('card');
        this.container.setAttribute('id', cardID);
        const front = document.createElement('div');
        front.classList.add('front');
        const back = document.createElement('div');
        back.classList.add('back');
        this.container.appendChild(front);
        this.container.appendChild(back);

        // Create card side image elements
        const frontImg = document.createElement('img');
        frontImg.src = this.location;
        frontImg.alt = this.suit + ' ' + String(this.value);
        const backImg = document.createElement('img');
        backImg.src = cardPath + 'back.svg';
        backImg.alt = 'back';

        // Add card side images to card syntax
        front.appendChild(frontImg);
        back.appendChild(backImg);
        table.appendChild(this.container);
    }

    flip () {
        this.container.classList.toggle('flip');
        this.flipped = !this.flipped;
    }
}

class Deck {
    constructor(){
        this.deck = [];
        this.reset();
        this.shuffle();
        this.winner = null;
    }

    reset() {
        this.deck = [];
        const suits = ['clubs', 'diamonds','hearts', 'spades'];
        const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'jack', 'queen', 'king', 'ace'];
        for (let suit of suits) {
            for (let value of values) {
                this.deck.push(new Card(suit, value));
            }
        }
    }

    shuffle() {
        let totalNumOfCards = this.deck.length;
        for (let i = 0; i < totalNumOfCards; i++){
            let j = Math.floor(Math.random() * totalNumOfCards);
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    deal(cardID, table) {
        const card = this.deck.pop();
        card.displayCard(cardID, table);
        return card;
    }
}

class Player {
    constructor(container, common){
        this.container = container;
        let tables = container.querySelectorAll('.table');
        this.playtable = tables[0];
        this.tokentable = tables[1];
        this.commontable = common;

        this.cards = [null, null]; // [card1, card2]
        this.btns = [null, null]; // [nextBtn, betBtn]

        this.money = 0;
        this.tokens = {}; // dictionary {value : count}

        this.handCards = []; // in ascending order after evaluate
        this.handName = '';
        this.handRank = null;
        this.rankCards = [];
        this.highCards = [];
        this.setTokens();
    }

    setCards(card1, card2){
        this.cards = [card1, card2];
    }

    setButtons(nextBtn, betBtn){
        this.btns = [nextBtn, betBtn];
    }

    // Set tokens to totalvalue
    setTokens(totalValue=260) { // 4*50 + 4*10 + 4*5 = 260
        this.clearTokens();
        while (this.money < totalValue && this.money < 200){
            this.addToken(50);
        }
        while (this.money < totalValue && this.money < 240){
            this.addToken(10);
        }
        while (this.money < totalValue){
            this.addToken(5);
        }
    }

    // Place token of given value into table
    addToken(value){
        const token = document.createElement('img');
        token.src = tokenPath + `token_${value}.svg`
        token.alt = "token";
        token.classList.add("token", `_${value}`, "player");
        this.tokentable.appendChild(token);
        this.money += value;
        this.tokens[value]? this.tokens[value] ++ : this.tokens[value] = 1;
    }

    // clear all tokens on table
    clearTokens(){
        let tokens = document.querySelectorAll(`#player .table.tokens img`);
        for (let token of tokens){
            this.tokentable.removeChild(token);
        }
    }
    
    // move given token to player table
    collectToken(token){
        let cloneToken = token.cloneNode();
        cloneToken.classList.add('hidden');
        let xi = token.getBoundingClientRect()['x'];
        let yi = token.getBoundingClientRect()['y'];
        this.tokentable.appendChild(cloneToken);
        let xf = cloneToken.getBoundingClientRect()['x'];
        let yf = cloneToken.getBoundingClientRect()['y'];
        this.tokentable.removeChild(cloneToken);
        token.style.transform = `translate(${xf-xi}px, ${yf-yi}px)`;
        setTimeout(()=>{this.tokentable.appendChild(token);
            token.style.transform = '';}, 1000);
    }

    // move given token to common table
    moveToken(token){
        token.classList.remove('selected');
        let cloneToken = token.cloneNode();
        cloneToken.classList.add('hidden');
        let xi = token.getBoundingClientRect()['x'];
        let yi = token.getBoundingClientRect()['y'];
        this.commontable.appendChild(cloneToken);
        let xf = cloneToken.getBoundingClientRect()['x'];
        let yf = cloneToken.getBoundingClientRect()['y'];
        this.commontable.removeChild(cloneToken);
        token.style.transform = `translate(${xf-xi}px, ${yf-yi}px)`;
        setTimeout(()=>{this.commontable.appendChild(token);
            token.style.transform = '';}, 1000);
    }

    makeBet() {
        let playerTokens = this.tokentable.querySelectorAll('.token.selected');
        playerTokens.forEach((token)=>this.moveToken(token));
    }
}

const commonTable = document.querySelector('.common .table.cards');
const commonTokenTable = document.querySelector('.common .table.tokens');
const playerContainer1 = document.querySelector('#player1');
const playerContainer2 = document.querySelector('#player2');

const player1 = new Player(playerContainer1, commonTokenTable);
const player2 = new Player(playerContainer2, commonTokenTable);

const nextBtn = document.querySelector('button.next');
const betBtn1 = document.querySelector('#player1 button.bet');
const betBtn2 = document.querySelector('#player2 button.bet');
player1.setButtons(nextBtn, betBtn1);
player2.setButtons(nextBtn, betBtn2);

const deck = new Deck();
const card1 = deck.deal('card1', commonTable);
const card2 = deck.deal('card2', commonTable);
const card3 = deck.deal('card3', commonTable);
const card4 = deck.deal('card4', commonTable);
const card5 = deck.deal('card5', commonTable);
const commonCards = [card1, card2, card3, card4, card5];

const player1card1 = deck.deal('player1card1', player1.playtable);
const player1card2 = deck.deal('player1card2', player1.playtable);
const player2card1 = deck.deal('player2card1', player2.playtable);
const player2card2 = deck.deal('player2card2', player2.playtable);

player1.setCards(player1card1, player1card2);
player2.setCards(player2card1, player2card2);


// Click to select and highlight tokens
function selectTokens(event){
    let token = event.target;
    token.classList.add("selected");
}
const tokens = document.querySelectorAll('.table.tokens img');
tokens.forEach(token => token.addEventListener('click', () => token.classList.toggle('selected')))

// Click on any player card on the table to flip it
allCards = document.querySelectorAll('.card[id^=player]');
allCards.forEach(card => card.addEventListener('click', () => card.classList.toggle('flip')));


// Only checks for straight, no flush, in given set of cards
// Returns list of straight cards (ascending order), or [] if none
function returnStraight(cards){
    // Don't need to check for straight if not enough 5 cards
    if (cards.length < 5){
        return [];
    }

    let numbersCloneDuplicates = cards.map(c => c.number); // clone numbers array
    let numbersNoDuplicate = new Set(numbersCloneDuplicates);
    numbersClone = Array.from(numbersNoDuplicate.values()); // with no duplicates

    // ace also counts as a 1
    if (numbersClone.includes(14)){
        numbersClone.unshift(1);
    }

    // Search for range of straight, i.e. continuous numbers
    let startIndex = 0;
    let endIndex = 1;
    while (endIndex < numbersClone.length){
        // if continuous, increment endIndex
        if (numbersClone[endIndex]-numbersClone[endIndex-1] === 1){
            endIndex++;
        // if not continuous but already have at least 5 in straight, break
        } else if (endIndex-startIndex>=5){
            break;
        // if not continuous, reset startIndex and endIndex and keep looking
        } else {
            startIndex = endIndex;
            endIndex = startIndex+1;
        }
    }

    let straightNumbers = numbersClone.slice(startIndex,endIndex);
    // If longer than 5 straight, remove the smaller numbers
    while (straightNumbers.length > 5){
        straightNumbers.shift();
    }
    // If have straight, return straight cards
    if(straightNumbers.length === 5){
        // pick first card with each num
        // if num == 1, convert it to 14 
        if (straightNumbers.includes(1)){
            straightNumbers[0] = 14; // replace first number as 14 in straightNumbers
        }
        let straightCards = straightNumbers.map((num)=> cards[numbersCloneDuplicates.indexOf(num)]);
        return straightCards;
    } else {
        return [];
    }
    
}

// Set player.hand and player.handName
function evaluateHand(player, cardsGiven){
    // sort cards in ascending number order
    var cards = cardsGiven.map(x=>x);
    cards.sort((card1, card2)=> card1.number - card2.number);

    let numbers = cards.map(c => c.number);
    let suits = cards.map(c => c.suit);
    
    let numberFreq = numbers.reduce((acc, curr) => (acc[curr] ? acc[curr]++ : acc[curr] = 1, acc), {}) 
    let numberFreqValues = Object.values(numberFreq);

    let suitFreq = suits.reduce((acc, curr) => (acc[curr] ? acc[curr]++ : acc[curr] = 1, acc), {}) 
    let suitFreqValues = Object.values(suitFreq);

    let isFlush = suitFreqValues.includes(5||6||7); 
    // Check for straight flush
    if (!isFlush){
        var straightFlushCards = [];
    } else {
        let handBool = suits.map((num) => suitFreq[num]>=5);
        let flushCards = cards.filter((value, index)=>handBool[index]);
        var straightFlushCards = returnStraight(flushCards);
    }
    let straightCards = returnStraight(cards);
    let isStraightFlush = straightFlushCards.length > 0;
    let isStraight = straightCards.length > 0;

    // handCards: list of cards to form a hand
    // handName: name of hand
    // handBool: list of booleans [true, false, ...] used to generate handCards from cards
    if (isStraightFlush){
        var handCards = straightFlushCards;
        var handBool = false;
        var handName = "Straight Flush";
        player.handRank = 1;
    } else if (numberFreqValues.includes(4)){
        var handBool = numbers.map((num) => numberFreq[num]===4);
        var handName = "Four of a kind";
        player.handRank = 2;
    } else if (numberFreqValues.includes(3) && numberFreqValues.includes(2)){
        var handBool = numbers.map((num) => numberFreq[num]===3 || numberFreq[num]===2);
        var handName = "Full House";
        player.handRank = 3;
    } else if (isFlush){
        var handBool = suits.map((num) => suitFreq[num]>=5);
        var handName = "Flush";
        player.handRank = 4;
    } else if (isStraight){
        var handCards = straightCards;
        var handBool = false;
        var handName = "Straight";
        player.handRank = 5;
    } else if (numberFreqValues.includes(3)){
        var handBool = numbers.map((num) => numberFreq[num]===3);
        var handName = "Three of a kind";
        player.handRank = 6;
    } else if (numberFreqValues.includes(2) && numberFreqValues.indexOf(2) !== numberFreqValues.lastIndexOf(2)) {
        var handBool = numbers.map((num) => numberFreq[num]===2);
        var handName = "Two pairs";
        player.handRank = 7;
    } else if (numberFreqValues.includes(2)){
        var handBool = numbers.map((num) => numberFreq[num]===2);
        var handName = "One pair";
        player.handRank = 8;
    } else {
        // if no hand at all, select highest valued cards, i.e. remove two lowest
        cards.shift();
        cards.shift();
        player.handCards = cards;
        player.handName = "None";
        return; 
    }

    // Select hand cards from handBool if needed
    if (handBool !== false){
        var handCards = cards.filter((value, index)=>handBool[index]);
    }
    
    // Select highest cards from remaining cards (ascending order)
    if (handCards.length < 5){
        let remainingCards = cards.filter(card => !handCards.includes(card));
        let remainingLength = 5 - handCards.length;
        player.rankCards = handCards.map(x=>x);
        player.highCards = [];
        while(remainingLength>0){
            let maxCard = remainingCards.pop(); // card with max number is at the end
            handCards.push(maxCard);
            player.highCards.push(maxCard);
            remainingLength--;
        }
    }
    
    // handCards.sort((card1, card2)=> card1.number - card2.number); // Sort in ascending order
    player.handCards = handCards;
    player.handName = handName;
}

function evaluateHighCards(player1Cards, player2Cards){
    while(player1Cards.length>0){
        player1card = player1Cards.pop();
        player2card = player2Cards.pop();
        if (player1card.number === player2card.number){
            continue
        } else if (player1card.number > player2card.number){
            return player1;
        } else if (player1card.number < player2card.number){
            return player2;
        }
    }
    return null; // completely same cards
}

// Return [winner, highCard]
// highCard=true if rank name are the same and need to compare high cards
// winner=null if both players have same cards
function evaluateWinner(player1, player2){
    let highCard = false;
    if (player1.handRank < player2.handRank){
        return [player1, highCard];
    } else if (player1.handRank > player2.handRank){
        return [player2, highCard];
    } else {
        highCard = true;
        // sorted in ascending order
        let player1Cards = player1.rankCards.map(x=>x);
        let player2Cards = player2.rankCards.map(x=>x);
        var winner = evaluateHighCards(player1Cards, player2Cards);
        if (winner!==null){
            return [winner, highCard];
        }
        player1Cards = player1.highCards.map(x=>x);
        player2Cards = player2.highCards.map(x=>x);
        winner = evaluateHighCards(player1Cards, player2Cards);
        return [winner, highCard];
    }
}

//! In progress
function splitTokens(tokenSet){
    tokenSet1 = [];
    tokenSet2 = [];

    function getTokenValue(token){
        let val = token.className.split(' ')[1];
        val = val.slice(1,val.length);
        return Number(val);
    }

    tokenSet = Array.from(tokenSet); // convert Nodelist to array
    //tokenValues = tokenSet.map(getTokenValue);
    let sum = tokenSet.reduce((sumValue, token)=> sumValue+getTokenValue(token),0)
    let subSum = Math.ceil(sum / 2); // for 2 players, doesn't matter
    while(Math.sum(tokenSet1) < subSum){
        tokenSet1.push()
    }


    return [tokenSet1, tokenSet2]
}
// After pressing next button, flip common cards and display eval message, then end this round (startRound=true)
function nextAction (){
    if (!card1.flipped){
        card1.flip();
        card2.flip();
        card3.flip();
        window.dispatchEvent(startEvent);
    } else if (!card4.flipped){
        card4.flip();
        window.dispatchEvent(startEvent);
    } else if (!card5.flipped){
        card5.flip();
        nextBtn.textContent = 'Reveal Hand';
        nextRound(); // setup listener but don't start new round because don't need to bet anymore
    } else if (nextBtn.textContent === 'Reveal Hand') {
        evaluateHand(player1, commonCards.concat(player1.cards));
        evaluateHand(player2, commonCards.concat(player2.cards));
        var [winner, highCard] = evaluateWinner(player1, player2);
        if (winner===null){
            var winnerName = "tie";
        } else {
            var winnerName = winner.container.getAttribute('id');
        }
        let evalMsg = "Player1: " + player1.handName + "; Player2: " + player2.handName + "\n Winner is " + winnerName;
        if (highCard){
            evalMsg += " after comparing highest cards"
        }
        deck.winner = winner;
        alert(evalMsg);
        nextBtn.textContent = 'Collect tokens';
        nextRound(); // setup listener but don't start new round
    } else if (nextBtn.textContent === 'Collect tokens') {
        let commonTokens = commonTokenTable.querySelectorAll('.token');
        if (deck.winner!==null){
            commonTokens.forEach((token)=>deck.winner.collectToken(token));
        } else {
            /* [tokenSet1, tokenSet2] = splitTokens(commonTokens);
            tokenSet1.forEach((token)=>player1.collectToken(token));
            tokenSet2.forEach((token)=>player2.collectToken(token)); */
        }
        
    }
}

// Make next button clickable once every round
function nextRound() {
    nextBtn.addEventListener('click', nextAction, {once: true});
}

// During each player's turn, set up bet button listener
// Once bet button is pressed once, update currrent player to next player and call playerTurn
// Once all player's played, update current player to null, then run next button and end this round 
function playerTurn(player){
    
    if (!player){
        nextRound();
        return;
    }

    //console.log('Playing one turn', player.container.getAttribute('id'))
    player.container.classList.add('playing');
    let playerBetBtn = player.btns[1];

    // Set up bet button listener for one click only
    function betAction(){
        
        player.makeBet();
        playerBetBtn.removeEventListener('click', betAction);
        player.container.classList.remove('playing');
        switch(player){
            case player1:
                console.log("Currently player1, next round player 2");
                CurrentPlayer = player2;
                break;
            case player2:
                console.log("Currently player2, next round next button");
                CurrentPlayer =  null;
        }
        // Define a new play event since currentplayer is updated
        console.log('dispatch play event')
        let playEvent = new CustomEvent('playOnce',{ detail: CurrentPlayer})
        window.dispatchEvent(playEvent);
    }
    playerBetBtn.addEventListener('click', betAction, {once: true});
    
}

// Run each current player's turn
// If current player is null, run next button and end this round
function oneRound(){
    CurrentPlayer = player1;
    let playEvent = new CustomEvent('playOnce',{ detail: CurrentPlayer})
    window.dispatchEvent(playEvent)
}

// when playOnce event is fired, play a new turn with current player then update
window.addEventListener('playOnce', (e) => {playerTurn(e.detail);})
// when startRound event is fired, a new round will initiate
window.addEventListener('startRound', (e)=>{oneRound();});

// global startEvent to start a new round
var startEvent = new CustomEvent('startRound')

// Main(): start game
function main(){
    window.dispatchEvent(startEvent)
}

main();