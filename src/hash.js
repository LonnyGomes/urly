const acceptableCharacters = 'abcdefghjkmnpqrstuvwxyz23456789';
const hashLength = 7;

console.log(genHash(hashLength, acceptableCharacters))

function genHash(length, acceptableCharacters) {
    // Build an array of random characters
    const randomChars = [];
    for (let i = 0; i < length; i++) {
        randomChars.push(acceptableCharacters[randNum(0, acceptableCharacters.length - 1)]);
    }
    // Join the characters together and return them
    return randomChars.join('');
}

function randNum(min, max) {
    const dif = max - min;
    return Math.round(Math.random() * dif) + min;
}