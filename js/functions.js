function checkStringLength(str, maxLength) {
  return str.length <= maxLength;
}

// Примеры использования
console.log(checkStringLength('проверяемая строка', 20)); // true
console.log(checkStringLength('проверяемая строка', 18)); // true
console.log(checkStringLength('проверяемая строка', 10)); // false

function isPalindrome(str) {
  // Приводим строку к нижнему регистру и убираем пробелы
  const cleanedStr = str.replace(/\s+/g, '').toLowerCase();
  // Проверяем, равна ли строка своему обратному значению
  return cleanedStr === cleanedStr.split('').reverse().join('');
}

// Примеры использования
console.log(isPalindrome('топот')); // true
console.log(isPalindrome('ДовОд')); // true
console.log(isPalindrome('Кекс'));  // false
