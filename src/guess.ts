export interface Guess { word: string, includes: {}[], score: number }

export const filterGuesses = (response: string, currentGuess: Guess) => (possibleGuess: Guess) => {
    let result = true;
    let flagged = ""
    for(let i = 0;i<response.length;i++) {
        if(response[i] === 'b' && possibleGuess.word.includes(currentGuess.word[i]) && !flagged.includes(currentGuess.word[i])) {
            return false
        }
        if(response[i] === 'y') {
            if(possibleGuess.word.includes(currentGuess.word[i]) && possibleGuess.word[i] !== currentGuess.word[i]) {
                flagged += currentGuess.word[i]
                result = true
            } else {
                return false
            }
        }
        if(response[i] === 'g') {
            if(possibleGuess.word[i] === currentGuess.word[i]) {
                flagged = currentGuess.word[i]
                result = true
            } else {
                return false
            }
        }
    }
    return result
}