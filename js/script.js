/*
Consegna
L'utente indica un livello di difficoltà in base al quale viene generata una griglia di gioco quadrata, in cui ogni cella contiene un numero (in ordine) tra quelli compresi in un range:
con difficoltà 1 => tra 1 e 100
con difficoltà 2 => tra 1 e 81
con difficoltà 3 => tra 1 e 49

Il computer deve generare 16 numeri casuali nello stesso range della difficoltà prescelta: le bombe.
I numeri nella lista delle bombe non possono essere duplicati.

In seguito l'utente clicca su una cella: se il numero è presente nella lista dei numeri generati - abbiamo calpestato una bomba - la cella si colora di rosso e la partita termina, altrimenti la cella cliccata si colora di azzurro e l'utente può continuare a cliccare sulle altre celle.
La partita termina quando il giocatore clicca su una bomba o raggiunge il numero massimo possibile di numeri consentiti.
Al termine della partita il software deve comunicare il punteggio, cioè il numero di volte che l’utente ha cliccato su una cella che non era una b.

BONUS:
1- quando si clicca su una bomba e finisce la partita, evitare che si possa cliccare su altre celle
2- quando si clicca su una bomba e finisce la partita, il software scopre tutte le bombe nascoste
*/

const eleLevel = document.getElementById('level');
const btnPlay = document.getElementById('play');
const eleGrid = document.querySelector('.grid');
const eleGuide = document.querySelector('.guide');
const eleOutput = document.querySelector('.output');
const arrLevels = [100, 81, 16]; // 49
const BOMB_NUMBER = 13; // 16

btnPlay.addEventListener('click', setupGame);
eleLevel.addEventListener('change', setupGame);
document.addEventListener('keydown', function(ev) {
	// console.log(ev);
	switch (ev.key) {
		case 'f':
		case 'F':
			eleLevel.value = 0;
			setupGame();
			break;

		case 'm':
		case 'M':
			eleLevel.value = 1;
			setupGame();
			break;

		case 'd':
		case 'D':
			eleLevel.value = 2;
			setupGame();
			break;

		case 'g':
		case 'G':
			showGuide();
			break;

		case ' ':
			setupGame();
			break;
	}
})


function setupGame() {
	eleGrid.innerHTML = ''; // cancella il contenuto della griglia per evitare che le celle vengano aggiunte alle precenti ad ogni click del bottone gioca
	eleOutput.innerHTML = '';
	score = 0;

	// selezionare il livello
	const indexLevel = parseInt(eleLevel.value);
	const cellsCount = arrLevels[indexLevel];
	const cellsPerRow = Math.sqrt(cellsCount);
	const goodCells = cellsCount - BOMB_NUMBER;
	console.log('cellsCount:', cellsCount, 'indexLevel:', indexLevel);


	// stampare la griglia in base al livello
	for (let cellNum = 1; cellNum <= cellsCount; cellNum++){
		const eleCell = document.createElement('div');
		eleCell.classList.add('cell');
		// eleCell.append(cellNum); // metodo 1
		eleCell.innerHTML = cellNum; // metodo 2
		eleCell.style.width = `calc(100% / ${cellsPerRow})`;
		eleCell.style.height = `calc(100% / ${cellsPerRow})`;
		eleCell.addEventListener('click', manageCellClick);
		eleGrid.append(eleCell);
		// console.log(cellNum);
	}

	// logica del gioco
	const arrRandom = [];
	for (i = 0; i < BOMB_NUMBER; i++) {
		let randomNumber;
		do {
			randomNumber = getRandomNumber(1, cellsCount);
		} while (arrRandom.includes(randomNumber))
		arrRandom.push(randomNumber);
	}
	console.log('bombe', arrRandom.sort((a,b)=>a-b)); // il sort è giusto per avere la vita facile quando testiamo il programma

	function manageCellClick() {
		cellValue = parseInt(this.innerHTML);

		if (arrRandom.includes(cellValue)) {
			const cells = document.querySelectorAll('.cell');
			for (i = 0; i < cells.length; i++) {
				cells[i].removeEventListener('click', manageCellClick);
				if (arrRandom.includes(parseInt(cells[i].innerHTML))) {
					cells[i].classList.add('bomb');
				}
			}
			eleOutput.innerHTML = 'Hai preso una bomba. Il tuo punteggio è: ' + score;
		} else {
			this.classList.add('selected');
			score++;
		}

		if (score == goodCells) {
			eleOutput.innerHTML = 'Hai Vinto. Il tuo punteggio è: ' + score;
			const cells = document.querySelectorAll('.cell');
			for (i = 0; i < cells.length; i++) {
				cells[i].removeEventListener('click', manageCellClick);
			}
		}

		this.removeEventListener('click', manageCellClick);
	}
}

function showGuide() {
	eleGrid.innerHTML = '';
	eleGrid.append(eleGuide);
}

function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}