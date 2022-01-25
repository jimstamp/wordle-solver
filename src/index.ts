
import fs from "fs"
import prompt from "prompt"
import { filterGuesses, Guess } from "./guess"

(async () => {

    let words = JSON.parse(fs.readFileSync("./output/scored.json").toString()) as Guess[]
    let currentWord = words.shift()
    let response = ""
    while (currentWord !== undefined && response != 'ggggg') {
        console.log("try : " + currentWord.word)
        try {
            response = (await prompt.get(["foo"]))["foo"] as string;//ask("response (as 'ybgbb': ")
        } catch(e) {
            response = "";
            break
        }
        if (response !== null) {
            words = words
                .filter(filterGuesses(response, currentWord));
        } else {
            break;
        }
        currentWord = words.shift()
    }
    if(response === 'ggggg') {
        console.log("congratulations!")
    } else {
        console.log("\nsorry, we tried\n")
    }
})()
