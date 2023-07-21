const getRank = (match: RegExpMatchArray) => {
    const [word] = match;
    const { index, input } = match;

    if (index === 0) {
        return word.length === input.length || input[index + word.length] === ' ' ? 4 : 3;
    }

    return input[index - 1] === ' ' ? 2 : 1;
};

export function getSearchFilter(searchString: string): (texts: string[]) => number | boolean {
    if (!searchString) {
        return () => true;
    }
    const searchStr = searchString.replace(/[\s\n\r\t\0]+/g, ' ').trim(); // trim and normalize whitespaces

    // split by comma-separated groups, then by spaces, and make regex of each word
    const words = searchStr
        .split(' ')
        .map((word) => word.trim())
        .filter((s) => s.length > 0)
        .map((word) => word.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')) // esape regex characters inside the string
        .map((word) => new RegExp(word, 'i'));

    return (texts) => {
        if (!words.length) {
            return true;
        }

        const ranks = words.map((wordRegex) => {
            // matching regex word with fields values
            const wordRanks = texts.map((text) => {
                const match = text.match(wordRegex);
                if (match === null) {
                    return null;
                }
                return getRank(match);
            });

            // if keyword was not found in every field value
            if (wordRanks.every((rank) => rank === null)) {
                return false;
            }
            return Math.max(...wordRanks);
        });

        // some keyword of a group was not found in fields values
        if (ranks.some((rank) => !rank)) {
            return false;
        }

        return (ranks as number[]).reduce((totalRank, rank) => totalRank + rank, 0);
    };
}
