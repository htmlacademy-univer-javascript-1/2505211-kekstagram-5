function checkStringLength(str, maxLength) {
  return str.length <= maxLength;
}


function isPalindrome(str) {
  // Приводим строку к нижнему регистру и убираем пробелы
  const cleanedStr = str.replace(/\s+/g, '').toLowerCase();
  // Проверяем, равна ли строка своему обратному значению
  return cleanedStr === cleanedStr.split('').reverse().join('');
}

// Функция для преобразования времени из формата "часы:минуты" в минуты
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Основная функция для проверки времени встреч
const isMeetingWithinWorkingHours = (workStart, workEnd, meetingStart, meetingDuration) => {
  const workStartMinutes = timeToMinutes(workStart);
  const workEndMinutes = timeToMinutes(workEnd);
  const meetingStartMinutes = timeToMinutes(meetingStart);
  const meetingEndMinutes = meetingStartMinutes + meetingDuration;

  // Проверка, укладывается ли встреча в рамки рабочего дня
  return meetingStartMinutes >= workStartMinutes && meetingEndMinutes <= workEndMinutes;
};
