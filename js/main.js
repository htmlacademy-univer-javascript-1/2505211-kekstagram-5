// Функция для генерации случайного числа в заданном диапазоне
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Массив возможных описаний комментариев
const messages = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

// Массив имен авторов комментариев
const names = ['Артём', 'Светлана', 'Иван', 'Мария', 'Дмитрий', 'Елена'];

// Функция для генерации комментариев
const generateComments = (count) => {
  const comments = [];
  const usedIds = new Set();

  for (let i = 0; i < count; i++) {
    let id;
    do {
      id = getRandomInt(1, 1000); // Генерация ID комментария
    } while (usedIds.has(id));
    usedIds.add(id);

    const randomMessage = messages[getRandomInt(0, messages.length - 1)];
    const randomName = names[getRandomInt(0, names.length - 1)];
    const avatarId = getRandomInt(1, 6); // Случайный ID аватара от 1 до 6

    comments.push({
      id: id,
      avatar: `img/avatar-${avatarId}.svg`,
      message: randomMessage,
      name: randomName,
    });
  }

  return comments;
};

// Функция для генерации массива фотографий
const generatePhotos = () => {
  const photos = [];

  for (let i = 1; i <= 25; i++) {
    photos.push({
      id: i,
      url: `photos/${i}.jpg`,
      description: `Описание фотографии номер ${i}. Это интересный момент!`,
      likes: getRandomInt(15, 200),
      comments: generateComments(getRandomInt(0, 30)), // Случайное количество комментариев от 0 до 30
    });
  }

  return photos;
};

// Генерация массива фотографий
const photosArray = generatePhotos();
console.log(photosArray);
