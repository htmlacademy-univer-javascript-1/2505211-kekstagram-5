import { sendData } from './api.js';
import { resetForm, showMessage, } from './form-utils.js';


export function initForm(photos, renderThumbnails) {
  const uploadForm = document.querySelector('.img-upload__form');
  const pristine = new Pristine(uploadForm);
  const fileInput = uploadForm.querySelector('.img-upload__input');
  const uploadOverlay = document.querySelector('.img-upload__overlay');
  const closeButton = uploadOverlay.querySelector('.img-upload__cancel');
  const submitButton = uploadForm.querySelector('.img-upload__submit');
  const previewImage = uploadOverlay.querySelector('.img-upload__preview img');
  const sliderWrapper = document.querySelector('.effect-level');
  const effectLevelSlider = document.querySelector('.effect-level__slider');
  const effectLevelValue = document.querySelector('.effect-level__value');
  const effectRadios = document.querySelectorAll('input[name="effect"]');
  const hashtagsInput = uploadForm.querySelector('.text__hashtags');
  const descriptionInput = uploadForm.querySelector('.text__description');
  const initialEffect = document.querySelector('input[name="effect"]:checked').value;

  let currentEffect = 'none';

  // Функция для закрытия формы редактирования
  const closeUploadOverlay = () => {
    uploadOverlay.classList.add('hidden');
    document.body.classList.remove('modal-open');
    resetForm();
    document.removeEventListener('keydown', onEscapePress);
  };

  // Закрытие по нажатию на клавишу Esc
  const onEscapePress = (evt) => {
    const isInputFocused = document.activeElement === hashtagsInput || document.activeElement === descriptionInput;
    if (evt.key === 'Escape' && !isInputFocused) {
      closeUploadOverlay();
    }
  };


  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const previewImage = document.querySelector('.img-upload__preview img');
      previewImage.src = imageUrl;

      // Показываем форму редактирования
      uploadOverlay.classList.remove('hidden');
      document.body.classList.add('modal-open');

      // Удаляем URL после загрузки изображения
      previewImage.onload = () => {
        URL.revokeObjectURL(imageUrl);
      };

      // Добавляем обработчик на клавишу Esc
      document.addEventListener('keydown', onEscapePress);
    }
  });

  // Закрытие по нажатию на кнопку
  closeButton.addEventListener('click', closeUploadOverlay);

  // Инициализируем масштабирование
  initScaleControls();

  // Инициализация ползунка noUiSlider
  noUiSlider.create(effectLevelSlider, {
    range: {
      min: 0,
      max: 100,
    },
    start: 100,
    step: 1,
    connect: 'lower',
  });

  effectLevelSlider.classList.add('hidden');
  sliderWrapper.style.display = 'none'; // Скрыть ползунок и окно
  document.querySelector('input[name="effect"][value="none"]').checked = true;

  updateSlider(initialEffect); // Установить состояние для начального эффекта

  pristine.addValidator(hashtagsInput, function(value) {
    const hashtags = value.trim().toLowerCase().split(' '); // Приводим к нижнему регистру и разделяем
    const regex = /^#[A-Za-zА-Яа-я0-9]{2,19}$/; // Хэш-тег минимум из 2 символов (включая #)
    const uniqueHashtags = new Set(hashtags); // Убираем повторяющиеся хэштеги

    // Проверка на длину хэш-тега, количество хэштегов и уникальность
    return hashtags.every(tag => regex.test(tag)) &&
           hashtags.length <= 5 &&
           hashtags.length === uniqueHashtags.size;
  }, 'Неверный формат хэш-тега или превышено количество хэш-тегов');

  pristine.addValidator(descriptionInput, function(value) {
    return value.length <= 140; // Длина комментария не более 140 символов
  }, 'Комментарий не может превышать 140 символов');

  uploadForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    if (!pristine.validate()) {
      // Ошибки валидации
      return;
    }
    // Валидация пройдена, продолжаем отправку данных
  });


  function applyEffect(effect, value) {
    previewImage.className = '';
    previewImage.style.filter = '';

    if (effect !== 'none') {
      previewImage.classList.add(`effects__preview--${effect}`);
      switch (effect) {
        case 'chrome':
          previewImage.style.filter = `grayscale(${value / 100})`;
          break;
        case 'sepia':
          previewImage.style.filter = `sepia(${value / 100})`;
          break;
        case 'marvin':
          previewImage.style.filter = `invert(${value}%)`;
          break;
        case 'phobos':
          previewImage.style.filter = `blur(${(value / 100) * 3}px)`;
          break;
        case 'heat':
          previewImage.style.filter = `brightness(${1 + (value / 100) * 2})`;
          break;
      }
    }
  }

  function updateSlider(effect) {
    const sliderWrapper = document.querySelector('.effect-level');

    if (effect === 'none') {
      effectLevelSlider.classList.add('hidden');
      sliderWrapper.style.display = 'none'; // Скрыть обертку
      effectLevelValue.value = ''; // Очистить значение
      previewImage.style.filter = ''; // Убрать фильтр
      previewImage.className = ''; // Убрать классы эффектов
    } else {
      effectLevelSlider.classList.remove('hidden');
      sliderWrapper.style.display = ''; // Показать обертку
      effectLevelSlider.noUiSlider.updateOptions({
        range: { min: 0, max: 100 },
        start: 100,
      });
      effectLevelValue.value = 100; // Установить значение по умолчанию
    }
  }

  effectRadios.forEach((radio) => {
    radio.addEventListener('change', (evt) => {
      currentEffect = evt.target.value;
      updateSlider(currentEffect);
      applyEffect(currentEffect, effectLevelSlider.noUiSlider.get());
    });
  });

  effectLevelSlider.noUiSlider.on('update', (values) => {
    const value = Math.round(values[0]);
    effectLevelValue.value = value;
    applyEffect(currentEffect, value);
  });

  uploadForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    submitButton.disabled = true;

    const formData = new FormData(uploadForm);

    try {
      await sendData(formData);
      showMessage('success');

      const filterData = getCurrentFilterData(); // Получаем текущий фильтр

      const newPhotoUrl = URL.createObjectURL(fileInput.files[0]);
      const newPhoto = {
        id: photos.length + 1,
        url: newPhotoUrl,
        description: uploadForm.querySelector('.text__description').value,
        likes: 0,
        comments: [],
        effect: filterData.effect,
        intensity: filterData.intensity,
      };

      photos.push(newPhoto);
      renderThumbnails([newPhoto]);

      resetForm();
    } catch (error) {
      console.error('Ошибка отправки данных:', error);
      showMessage('error');
    } finally {
      submitButton.disabled = false;
    }
  });


  function getCurrentFilterData() {
    const effectRadios = document.querySelectorAll('input[name="effect"]');
    let selectedEffect = 'none';

    // Ищем текущий выбранный эффект
    effectRadios.forEach((radio) => {
      if (radio.checked) {
        selectedEffect = radio.value;
      }
    });

    // Получаем значение интенсивности фильтра
    const effectLevel = effectLevelSlider.noUiSlider ? effectLevelSlider.noUiSlider.get() : 100;

    return {
      effect: selectedEffect,
      intensity: selectedEffect === 'none' ? null : effectLevel, // Интенсивность только если выбран фильтр
    };
  }


  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      previewImage.src = imageUrl;
      uploadOverlay.classList.remove('hidden');
      document.body.classList.add('modal-open');

      previewImage.onload = () => {
        URL.revokeObjectURL(imageUrl);
      };
    }
  });

  closeButton.addEventListener('click', resetForm);


  function initScaleControls() {
    const scaleControlValue = document.querySelector('.scale__control--value');
    const scaleControlMinus = document.querySelector('.scale__control--smaller');
    const scaleControlPlus = document.querySelector('.scale__control--bigger');
    const previewImage = document.querySelector('.img-upload__preview img');
    const SCALE_STEP = 25; // Шаг изменения масштаба
    const SCALE_MIN = 25;  // Минимальный масштаб
    const SCALE_MAX = 100; // Максимальный масштаб

    // Обновление масштаба изображения
    const updateScale = (value) => {
      if (value < SCALE_MIN) {value = SCALE_MIN};
      if (value > SCALE_MAX) {value = SCALE_MAX};

      scaleControlValue.value = `${value}%`;
      previewImage.style.transform = `scale(${value / 100})`;
    };

    // Уменьшение масштаба
    scaleControlMinus.addEventListener('click', () => {
      let currentScale = parseInt(scaleControlValue.value, 10);
      currentScale -= SCALE_STEP;
      updateScale(currentScale);
    });

    // Увеличение масштаба
    scaleControlPlus.addEventListener('click', () => {
      let currentScale = parseInt(scaleControlValue.value, 10);
      currentScale += SCALE_STEP;
      updateScale(currentScale);
    });

    // Установить масштаб по умолчанию
    updateScale(100); // Начальный масштаб = 100%
  }


  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
      const previewImage = document.querySelector('.img-upload__preview img');
      previewImage.src = URL.createObjectURL(file);

      // Показываем форму редактирования
      uploadOverlay.classList.remove('hidden');
      document.body.classList.add('modal-open');
    }
  });
}
