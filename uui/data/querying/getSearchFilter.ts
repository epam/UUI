export function getSearchFilter(searchString: string): ((text: string[]) => boolean) {
    if (!searchString) {
        return text => true;
    }
    searchString = searchString.replace(/[\s\n\r\t\0]+/g, ' ').trim(); // trim and normalize whitespaces

    // split by comma-separated groups, then by spaces, and make regex of each word
    let wordGroups = searchString
        .split(',')
        .map(words => words
            .split(' ')
            .map(word => word.trim())
            .filter(s => s.length > 0)
            .map(word => word.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")) // esape regex characters inside the string
            .map(word => new RegExp(word, 'i')),
        )
        .filter(g => g.length > 0);

    return function (texts) {
        return wordGroups.length ? wordGroups.some(wordRegexes => wordRegexes.every(regex => texts.some(text => regex.test(text)))) : true;
    };

}
