import { getData } from './api.js';
import { renderThumbnails } from './thumbnails.js';
import { initForm } from './form.js';

const DEBOUNCE_DELAY = 500; // Задержка для устранения дребезга
const RANDOM_PHOTO_LIMIT = 10; // Количество случайных фото
const photosData = [];
const filterSection = document.querySelector('.img-filters'); // Блок с фильтрами
const galleryContainer = document.querySelector('.pictures'); // Контейнер для изображений
const filtersBlock = document.querySelector('.img-filters');
let activePhotoSet = []; // Текущий набор фото
let processedPhotos = []; // Фото после фильтрации

// Функция для задержки вызова
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// Получение случайных изображений
const selectRandomPhotos = (photos) => {
  const shuffledPhotos = photos.slice().sort(() => Math.random() - 0.5);
  return shuffledPhotos.slice(0, RANDOM_PHOTO_LIMIT);
};

// Получение самых комментируемых изображений
const selectMostCommented = (photos) => {
  return photos.slice().sort((a, b) => b.comments.length - a.comments.length);
};

// Удаление всех изображений из галереи
const clearGallery = () => {
  galleryContainer.querySelectorAll('.picture').forEach((image) => image.remove());
};

// Обработка переключения фильтров
const handleFilterSwitch = debounce((filterId) => {
  clearGallery();

  switch (filterId) {
    case 'filter-default':
      processedPhotos = activePhotoSet;
      break;
    case 'filter-random':
      processedPhotos = selectRandomPhotos(activePhotoSet);
      break;
    case 'filter-discussed':
      processedPhotos = selectMostCommented(activePhotoSet);
      break;
  }

  renderThumbnails(processedPhotos);
}, DEBOUNCE_DELAY);

// Настройка фильтров
const configureFilters = () => {
  filterSection.classList.remove('img-filters--inactive');

  filterSection.addEventListener('click', (event) => {
    if (event.target.classList.contains('img-filters__button')) {
      filterSection.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
      event.target.classList.add('img-filters__button--active');
      handleFilterSwitch(event.target.id);
    }
  });
};

// Загрузка изображений с сервера
const fetchPhotos = async () => {
  try {
    activePhotoSet = await getData();
    processedPhotos = activePhotoSet;

    filtersBlock.classList.remove('img-filters--inactive');
    configureFilters();
    renderThumbnails(processedPhotos);
  } catch (error) {
    const errorMessage = document.createElement('div');
    errorMessage.textContent = 'Ошибка загрузки изображений. Пожалуйста, попробуйте позже.';
    errorMessage.style.cssText = `
      color: red;
      text-align: center;
      font-size: 20px;
      margin-top: 20px;
    `;
    document.body.appendChild(errorMessage);
  }
};

// Стартовая загрузка
fetchPhotos();

// Инициализация формы редактирования
initForm(photosData, renderThumbnails);
