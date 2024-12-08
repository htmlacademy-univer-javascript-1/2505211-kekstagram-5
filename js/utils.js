const getRandomInteger = (a, b) => Math.floor(Math.random() * (b - a + 1) + a);
const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const isEscapeKey = (evt) => evt.key === 'Escape';

export {getRandomInteger, getRandomArrayElement, isEscapeKey};
