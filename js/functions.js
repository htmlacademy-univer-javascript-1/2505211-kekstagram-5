function checkStringLength(str, maxLength) {
  return str.length <= maxLength;
}


function isPalindrome(str) {
  // Приводим строку к нижнему регистру и убираем пробелы
  const cleanedStr = str.replace(/\s+/g, '').toLowerCase();
  // Проверяем, равна ли строка своему обратному значению
  return cleanedStr === cleanedStr.split('').reverse().join('');
}

