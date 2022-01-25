import fs from "fs"
import { concat, from } from "rxjs"
import { count, groupBy, map, mergeMap, reduce, toArray } from "rxjs/operators"

/*
given the word in the answer list, find the word that removes the higest number of the most popular ngrams

produce a ranked list of all words using the sum of the frequency of ngrams that occur in all words, for ht engrams present in word

for each word, split into 1, 2 and 3 grams
for each word segment count occurences in all words

for each word sum counts for ngrams that are present
*/

let answerWords = fs.readFileSync("./data/wordle-answers-alphabetical.txt").toString()

const ngrams = (a: string, n: number) => [...a].slice(0, 1 - n).map((_, i) => a.slice(i, i + n))

from(answerWords.concat("\n").split('\n')).pipe(
    map(word => ({ word, includes: [] as { key: string, count: number }[] })),
    mergeMap(word => from(answerWords.concat("\n").split('\n')).pipe(
        mergeMap(w => concat(from(w.split('')), from(ngrams(w, 2)), from(ngrams(w, 3)))),
        groupBy(ngrams => ngrams),
        mergeMap(group => group.pipe(
            count(),
            map(count => ({ key: group.key, count }))
        )),
        toArray(),
        map(array => array.sort((a, b) => b.count - a.count)),
        mergeMap(array => from(array)),
        reduce((acc, ngram) => acc.word.includes(ngram.key) ? { ...acc, includes: acc.includes.concat([ngram]) } : acc, word),
    )),
    map(word => ({ ...word, score: word.includes.reduce((count, ngram) => count + ngram.count, 0) })),
    toArray(),
    map(array => array.sort((a, b) => b.score - a.score)),
).subscribe({
    next: item => {
        fs.mkdirSync("./output", { recursive: true })
        fs.writeFileSync("./output/scored.json", JSON.stringify(item, null, 2))
    },
    error: err => console.log(err),
    complete: () => console.log("Done with this buffer source")
});
