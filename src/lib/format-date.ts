export function formatMonthYear(dateStr: string, locale: string) {
  const formatter = new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', {
    month: 'short',
    year: 'numeric',
  });
  return formatter.format(new Date(dateStr));
}
