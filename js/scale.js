const STEP_SCALE = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const DEFAULT_SCALE = MAX_SCALE;
const uploadImg = document.querySelector('.img-upload__preview img');
const scaleControlValue = document.querySelector('.scale__control--value');
const scaleSmallerButton = document.querySelector('.scale__control--smaller');
const scaleBiggerButton = document.querySelector('.scale__control--bigger');
let currentScale = DEFAULT_SCALE;
const updateScale = () => {
  scaleControlValue.value = `${currentScale}%`;
  uploadImg.style.transform = `scale(${currentScale / 100})`;
};

function onSmallerButtonClick() {
  if (currentScale > MIN_SCALE) {
    currentScale -= STEP_SCALE;
    updateScale();
  }
}

function onBiggerButtonClick() {
  if (currentScale < MAX_SCALE) {
    currentScale += STEP_SCALE;
    updateScale();
  }
}

const resetScale = () => {
  currentScale = DEFAULT_SCALE;
  updateScale();
};
scaleSmallerButton.addEventListener('click', onSmallerButtonClick);
scaleBiggerButton.addEventListener('click', onBiggerButtonClick);
export {resetScale};
