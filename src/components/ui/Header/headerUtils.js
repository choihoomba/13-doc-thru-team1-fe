/** Figma 표기 규격(YYYY.MM.DD)에 맞춰 알림 날짜를 변환합니다. */
export function formatNotificationDate(createdAt) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
}
