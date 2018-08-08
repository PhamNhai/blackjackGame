
var BlackjackJS = (function() {
	var	cards = ["c01","c02","c03","c04","c05","c06","c07","c08","c09","c10","c11","c12","c13","d01","d02","d03","d04","d05","d06","d07","d08","d09","d10","d11","d12","d13","h01","h02","h03","h04","h05","h06","h07","h08","h09","h10","h11","h12","h13","s01","s02","s03","s04","s05","s06","s07","s08","s09","s10","s11","s12","s13"];
    var scores = [1,2,3,4,5,6,7,8,9,10,10,10,10,1,2,3,4,5,6,7,8,9,10,10,10,10,1,2,3,4,5,6,7,8,9,10,10,10,10,1,2,3,4,5,6,7,8,9,10,10,10,10];
    var playerCards = document.getElementById('player');
    var dealerCards = document.getElementById('dealer');
	var playerNumCards = 2;
	var dealerNumCards = 2;



	function Card(card, score){
		this.card = card;
	    this.score = score;
	}


	Card.prototype.view = function(){
		var imgNode = "";
		var cardUrl = "";
		cardUrl = "png/"+this.card+".png";
		imgNode = document.createElement('img');
		imgNode.src=cardUrl;		
		imgNode.style.height = '180px';
        imgNode.style.width = '120px';
        return imgNode;
	}


	function Player(element, hand){
		this.hand = hand;
		this.element = element;
	}


	Player.prototype.hit = function(card){
		this.hand.push(card);
	}


	Player.prototype.getScore = function(){
		var points = 0;
		for(var i = 0; i < this.hand.length; i++){
			if(i == 0) points = 0;
			else points += this.hand[i].score;
		}
		return points;
	}



	Player.prototype.dealershowHand = function(){
			for(var i = 0; i < this.hand.length; i++){
				 var imgCard = this.hand[i].view();
				dealerCards.appendChild(imgCard);
			}
		}

	Player.prototype.playershowHand = function(){
			for(var i = 0; i < this.hand.length; i++){
				var imgCard = this.hand[i].view();
				playerCards.appendChild(imgCard);
			}
		}

	var Deck = new function(){
	    this.deck;

		this.init = function(){
			this.deck = []; 
			for(var i = 0; i < cards.length; i+=1){
		    	this.deck.push(new Card(cards[i],scores[i]));
		    }
		}

		this.shuffle = function(){
			 var j, x, i;
			 for (i = this.deck.length; i; i--) {
					 j = Math.floor(Math.random() * i);
					 x = this.deck[i - 1];
					 this.deck[i - 1] = this.deck[j];
					 this.deck[j] = x;
			 }
		}

	}

	var Game = new function(){


		this.dealButtonHandler = function(){
			Game.start();
			this.dealButton.disabled = true;
			this.hitButton.disabled = false;
			this.standButton.disabled = false;
		}

		this.hitButtonHandler = function(){
			var card = Deck.deck.pop();
			this.player.hit(card);
			var imgCard = card.view();
			playerNumCards ++;
			playerCards.appendChild(imgCard);
			this.playerScore.innerHTML = this.player.getScore();

			if(this.player.getScore() > 21){
				this.gameEnded('You lost!');
			}
		}


		this.standButtonHandler = function(){
			this.hitButton.disabled = true;
			this.standButton.disabled = true;

			while(true){
				var card = Deck.deck.pop();
				dealerNumCards ++;
				this.dealer.hit(card);
				var imgCard = card.view();
				dealerCards.appendChild(imgCard);
				card.view();
				this.dealerScore.innerHTML = this.dealer.getScore();

				var playerBlackjack = this.player.getScore() == 21,
						dealerBlackjack = this.dealer.getScore() == 21;

				if(dealerBlackjack && !playerBlackjack) {
						this.gameEnded('You lost!');
						break;
				} else if(dealerBlackjack && playerBlackjack) {
						this.gameEnded('Draw!');
						break;
				} else if(this.dealer.getScore() > 21 && this.player.getScore() <= 21) {
						this.gameEnded('You won!');
						break;
				} else if(this.dealer.getScore() > this.player.getScore() && this.dealer.getScore() <= 21 && this.player.getScore() < 21) {
						this.gameEnded('You lost!');
						break;
				}

			}
		}

		this.init = function(){
			this.dealerScore = document.getElementById('dealer-score').getElementsByTagName("span")[0];
			this.playerScore = document.getElementById('player-score').getElementsByTagName("span")[0];
			this.dealButton = document.getElementById('deal');
			this.hitButton = document.getElementById('hit');
			this.standButton = document.getElementById('stand');

			this.dealButton.addEventListener('click', this.dealButtonHandler.bind(this));
			this.hitButton.addEventListener('click', this.hitButtonHandler.bind(this));
			this.standButton.addEventListener('click', this.standButtonHandler.bind(this));

		}


		this.start = function(){

			Deck.init();
			Deck.shuffle();

			this.dealer = new Player('dealer', [Deck.deck.pop(), Deck.deck.pop()]);

			this.player = new Player('player', [Deck.deck.pop(), Deck.deck.pop()]);
			document.getElementById("player").innerHTML = "";
			document.getElementById("dealer").innerHTML = "";
			this.dealer.dealershowHand();
			this.player.playershowHand();
			this.dealerScore.innerHTML = this.dealer.getScore();
			this.playerScore.innerHTML = this.player.getScore();

			this.setMessage("");
		}

		this.gameEnded = function(str){
			this.setMessage(str);
			this.dealButton.disabled = false;
			this.hitButton.disabled = true;
			this.standButton.disabled = true;

		}

		this.setMessage = function(str){
			document.getElementById('status').innerHTML = str;
		}


	}

	return {
		init: Game.init.bind(Game)
	}

})() 