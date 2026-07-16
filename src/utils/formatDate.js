/**
 * 날짜를 "YY/MM/DD" 또는 "YY/MM/DD HH:mm" 형식의 문자열로 변환
 *
 * @param {Date | string | number} date - 변환할 날짜 (Date 객체, ISO 문자열, timestamp 모두 가능)
 * @param {boolean} [withTime=false] - true면 시:분까지 포함 (예: "24/01/17 15:38"), false면 날짜만 (예: "24/01/17")
 * @returns {string} 지정한 형식의 날짜 문자열
 */
export default function formatDate(date, withTime = false) {
  if (!date) return '';

  const newData = new Date(date);

  if (isNaN(newData.getTime())) return ''; // Invalid Date 예외 처리

  const year = String(newData.getFullYear()).slice(-2);
  const month = String(newData.getMonth() + 1).padStart(2, '0');
  const day = String(newData.getDate()).padStart(2, '0');

  const formatted = `${year}/${month}/${day}`;

  if (!withTime) return formatted;

  const hours = String(newData.getHours()).padStart(2, '0');
  const minutes = String(newData.getMinutes()).padStart(2, '0');

  return `${formatted} ${hours}:${minutes}`;
}
