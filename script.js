const emojis = [
    '🌭', '🔥', '❤️', '🦕', '🌮', '🍕', '🍔', '🍟', '🍗', '🍖',
    '🍤', '🍣', '🍱', '🍛', '🍜', '🍝', '🍲', '🍥', '🍙', '🍚',
    '🍘', '🍢', '🍡', '🍧', '🍨', '🍦', '🍰', '🎂', '🍮', '🍭',
    '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖',
    '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯',
    '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔',
    '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦'
];

let numberOfCards = 0;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;

function startGame() {
    const width = parseInt(document.getElementById('width').value);
    const height = parseInt(document.getElementById('height').value);

    if (isOutOfRange(width, 4, 11)) {
        alert('Width can be from 4 to 11');
        return;
    }

    if (isOutOfRange(height, 3, 6)) {
        alert('Height can be from 3 to 6');
        return;
    }

    reset();

    setupBoard(width, height);
}

function setupBoard(width, height) {
    const board = document.getElementById('board');
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${width}, 100px)`;
    board.style.gridTemplateRows = `repeat(${height}, 100px)`;

    numberOfCards = width * height;
    matchedPairs = 0; // Сбрасываем количество совпадений при новом старте игры
    const selectedEmojis = shuffleArray(emojis).slice(0, numberOfCards / 2);
    const doubleEmojis = [...selectedEmojis, ...selectedEmojis];

    if (numberOfCards % 2 === 1) doubleEmojis.push('');

    const gameEmojis = shuffleArray(doubleEmojis);

    gameEmojis.forEach(emoji => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;

        const emojiElement = document.createElement('span');
        emojiElement.textContent = emoji;
        emojiElement.style.visibility = 'hidden';
        card.appendChild(emojiElement);

        card.addEventListener('click', () => flipCard(card, emojiElement));

        board.appendChild(card);
    });
}

function flipCard(card, emojiElement) {
    if (lockBoard || card === firstCard || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    emojiElement.style.visibility = 'visible';

    if (firstCard === null) {
        firstCard = card;
    } else {
        secondCard = card;
        checkForMatch();
    }
}

function checkForMatch() {
    const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedPairs += 1;

    reset();

    if (matchedPairs === numberOfCards / 2) {
        setTimeout(() => alert('Congratulations, you won!'), 500);
    }
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');

        firstCard.firstChild.style.visibility = 'hidden';
        secondCard.firstChild.style.visibility = 'hidden';

        reset();
    }, 1000);
}

function reset() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function isOutOfRange(val, minVal, maxVal) {
    return val < minVal || val > maxVal;
}

function shuffleArray(array) {
    for (let index = array.length - 1; index > 0; index--) {
        const j = Math.floor(Math.random() * (index + 1));
        [array[index], array[j]] = [array[j], array[index]];
    }
    return array;
}

document.getElementById('start-button').addEventListener('click', startGame);
