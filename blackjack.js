
var BlackjackJS = (function() {
	var	cards = ["c01.png","c02.png","c03.png","c04.png","c05.png","c06.png","c07.png","c08.png","c09.png","c10.png","c11.png","c12.png","c13.png","d01.png","d02.png","d03.png","d04.png","d05.png","d06.png","d07.png","d08.png","d09.png","d10.png","d11.png","d12.png","d13.png","h01.png","h02.png","h03.png","h04.png","h05.png","h06.png","h07.png","h08.png","h09.png","h10.png","h11.png","h12.png","h13.png","s01.png","s02.png","s03.png","s04.png","s05.png","s06.png","s07.png","s08.png","s09.png","s10.png","s11.png","s12.png","s13.png"];
    var scores = [1,2,3,4,5,6,7,8,9,10,10,10,10,1,2,3,4,5,6,7,8,9,10,10,10,10,1,2,3,4,5,6,7,8,9,10,10,10,10,1,2,3,4,5,6,7,8,9,10,10,10,10];

	function Card(card, score){
		this.card = card;
	  this.score = score;
	}


	Card.prototype.view = function(){
		var src = '';
		this.src =  "png/" + this.card;
		// var image = document.createElement("img");
		// var imageParent = document.getElementById("images");
		// 	image.src = this.src;
  //           alert(image.src);
		// 	imageParent.appendChild(image);
		return `
			<img class="suit">` + "src = "png/" +" this.card " " + `</>
		`;
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


	Player.prototype.showHand = function(){
		var hand = "";
		for(var i = 0; i < this.hand.length; i++){
			 hand += this.hand[i].view();
		}
		return hand;
	}


	var Deck = new function(){
	    this.deck;

		this.init = function(){
			this.deck = []; //empty the array
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

			document.getElementById(this.player.element).innerHTML += card.view();
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

				this.dealer.hit(card);
				document.getElementById(this.dealer.element).innerHTML += card.view();
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

			document.getElementById(this.dealer.element).innerHTML = this.dealer.showHand();
			document.getElementById(this.player.element).innerHTML = this.player.showHand();

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