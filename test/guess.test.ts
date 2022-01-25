import { filterGuesses } from "../src/guess"

describe("guess", () => {
    describe("filterGuesses", () => {
        it("should filter all guesses for 5 'b's", () => {
            let guesses = [
                { word: "chase", includes: [], score: 10 },
                { word: "point", includes: [], score: 10 },
                { word: "downs", includes: [], score: 10 },
                { word: "knoll", includes: [], score: 10 },
            ]
            expect(guesses.filter(filterGuesses("bbbbb", { word: "adieu", includes: [], score: 10 }))).toHaveLength(1)
        })
        it("should filter all but 1 guess for 1 'y'", () => {
            let guesses = [
                { word: "chase", includes: [], score: 10 },
                { word: "point", includes: [], score: 10 },
                { word: "downs", includes: [], score: 10 },
            ]
            expect(guesses.filter(filterGuesses("bybbb", { word: "edeee", includes: [], score: 10 }))).toHaveLength(1)
        })
        it("should filter all but 1 guess for 1 'g'", () => {
            let guesses = [
                { word: "chase", includes: [], score: 10 },
                { word: "point", includes: [], score: 10 },
                { word: "downs", includes: [], score: 10 },
            ]
            expect(guesses.filter(filterGuesses("bbbgb", { word: "zzzsz", includes: [], score: 10 }))).toHaveLength(1)
        })
        it("should filter single y for co-incidental match", () => {
            let guesses = [
                { word: "longs", includes: [], score: 10 },
            ]
            expect(guesses.filter(filterGuesses("ybbbb", { word: "later", includes: [], score: 10 }))).toHaveLength(0)
        })
        it("should reject words with b's, even with a y", () => {
            let guesses = [
                { word: "alter", includes: [], score: 10 },
                { word: "alert", includes: [], score: 10 },
                { word: "coils", includes: [], score: 10 },
            ]
            let result = guesses.filter(filterGuesses("ybbbb", { word: "later", includes: [], score: 10 }))
            expect(result).toHaveLength(1)
            expect(result[0].word).toBe("coils")
        })
        it("should reject words with b's", () => {
            let guesses = [
                { word: "alter", includes: [], score: 10 },
                { word: "alert", includes: [], score: 10 },
                { word: "coils", includes: [], score: 10 },
            ]
            let result = guesses.filter(filterGuesses("ybbbb", { word: "later", includes: [], score: 10 }))
            expect(result).toHaveLength(1)
            expect(result[0].word).toBe("coils")
        })
        it("should progress through a game", () => {
            let guesses = [
                { word: "solid", includes: [], score: 10 },
                { word: "clown", includes: [], score: 10 },
                { word: "nobly", includes: [], score: 10 },
                { word: "ghoul", includes: [], score: 10 },
                { word: "knoll", includes: [], score: 10 },
            ]
            guesses = guesses.filter(filterGuesses("ybbbb", { word: "later", includes: [], score: 10 }));
            expect(guesses[0].word).toBe("solid")
            guesses = guesses.filter(filterGuesses("byybb", { word: "solid", includes: [], score: 10 }))
            expect(guesses[0].word).toBe("clown")
            guesses = guesses.filter(filterGuesses("bygby", { word: "clown", includes: [], score: 10 }))
            expect(guesses[0].word).toBe("knoll")
        })
        /*
        it is possible to get a 'b' for a letter that is in target word, if the letter has been marked
        'g' or 'y' elsewhere and it is a repeat.

        the exception is a 'y' in the same location 
        */
        it("should allow b for double letters", () => {
            let guesses = [
                { word: "later", includes: [], score: 10 },
                { word: "solid", includes: [], score: 10 },
                { word: "sonic", includes: [], score: 10 },
                { word: "clown", includes: [], score: 10 },
                { word: "dough", includes: [], score: 10 },
                { word: "poppy", includes: [], score: 10 },
                { word: "knoll", includes: [], score: 10 },
                { word: "boozy", includes: [], score: 10 },
                { word: "booxy", includes: [], score: 10 },
            ]
            guesses = guesses.filter(filterGuesses("bbbbb", { word: "later", includes: [], score: 10 }));
            expect(guesses[0].word).toBe("sonic")
            guesses = guesses.filter(filterGuesses("bgbbb", guesses[0]))
            expect(guesses[0].word).toBe("dough")
            guesses = guesses.filter(filterGuesses("bgbbb", guesses[0]))
            expect(guesses[0].word).toBe("poppy")
            guesses = guesses.filter(filterGuesses("bgbbg", guesses[0]))
            expect(guesses[0].word).toBe("boozy")
            guesses = guesses.filter(filterGuesses("ggbbg", guesses[0]))
            expect(guesses[0].word).toBe("booxy")

        })

    })
})