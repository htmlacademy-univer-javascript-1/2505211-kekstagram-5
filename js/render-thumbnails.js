import {generatePhotos} from './data.js';

const miniatureTemplate = document.querySelector('#picture').content.querySelector('.picture'); // Исправлено имя переменной
const miniaturesFragment = document.createDocumentFragment();

generatePhotos().forEach((photo) => {
  const miniature = miniatureTemplate.cloneNode(true);
  const miniatureImage = miniature.querySelector('.picture__img');
  const miniatureLikes = miniature.querySelector('.picture__likes');
  const miniatureComments = miniature.querySelector('.picture__comments');

  miniatureImage.src = photo.url;
  miniatureImage.alt = photo.description;
  miniatureLikes.textContent = photo.likes;
  miniatureComments.textContent = photo.comments.length;

  miniaturesFragment.appendChild(miniature);
});

document.querySelector('.pictures').appendChild(miniaturesFragment);
