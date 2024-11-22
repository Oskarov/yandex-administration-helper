export const returnStatusClass = (status: string) => {
  switch (status) {
    // Беклог
    case 'Беклог':
      return 'backlog';

    // В работе
    case 'В работе':
      return 'in-work';

    // Готово
    case 'Готово':
      return 'done';

    default:
      return 'dafault';
  }
};

export const returnDateString = (): string => {
  const day = new Date().toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const time = new Date().toLocaleTimeString('ru-RU', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  return `${day}, ${time}`;
};
