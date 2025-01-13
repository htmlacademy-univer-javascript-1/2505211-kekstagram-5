export function resetForm() {
  const uploadForm = document.querySelector('.img-upload__form');
  const fileInput = uploadForm.querySelector('.img-upload__input');
  const hashtagsInput = uploadForm.querySelector('.text__hashtags');
  const descriptionInput = uploadForm.querySelector('.text__description');
  const uploadOverlay = document.querySelector('.img-upload__overlay');
  const previewImage = uploadOverlay.querySelector('.img-upload__preview img');
  const effectLevelSlider = document.querySelector('.effect-level__slider');
  const effectLevelWrapper = document.querySelector('.effect-level'); // Обертка слайдера
  const scaleControlValue = document.querySelector('.scale__control--value');
  const submitButton = uploadForm.querySelector('.img-upload__submit');

  // Сброс состояния формы
  uploadForm.reset();
  previewImage.src = '';
  hashtagsInput.value = '';
  descriptionInput.value = '';
  fileInput.value = '';
  submitButton.disabled = false;

  // Сброс масштаба
  scaleControlValue.value = '100%';
  previewImage.style.transform = 'scale(1)';

  // Сброс слайдера
  effectLevelSlider.noUiSlider.set(100); // Установить значение по умолчанию
  effectLevelSlider.classList.add('hidden'); // Скрыть сам слайдер
  effectLevelWrapper.style.display = 'none'; // Скрыть обертку
  document.querySelector('input[name="effect"][value="none"]').checked = true; // Установить эффект "Оригинал"
  previewImage.className = ''; // Удалить все классы эффектов
  previewImage.style.filter = ''; // Удалить фильтр

  // Закрытие формы
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
}


export function showMessage(messageType) {
  const templateElement = document.querySelector(`#${messageType}`).content.querySelector(`.${messageType}`);
  const messageClone = templateElement.cloneNode(true);
  document.body.appendChild(messageClone);

  const closeButton = messageClone.querySelector(`.${messageType}__button`);

  // Функция для удаления сообщения
  function removeMessage() {
    messageClone.remove();
    document.removeEventListener('keydown', handleEscapeKey);
  }

  // Функция для обработки нажатия Escape
  function handleEscapeKey(event) {
    if (event.key === 'Escape') {
      removeMessage();
    }
  }

  // Закрытие сообщения при взаимодействии
  document.addEventListener('keydown', handleEscapeKey);
  closeButton.addEventListener('click', removeMessage);
  messageClone.addEventListener('click', (event) => {
    if (event.target === messageClone) {
      removeMessage();
    }
  });
}

