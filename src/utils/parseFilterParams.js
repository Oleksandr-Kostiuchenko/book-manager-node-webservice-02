const parseGenre = (genre) => {
  const knownGenres = [
    'Fiction',
    'Non-fiction',
    'Mystery',
    'Fantasy',
    'Science Fiction',
    'Biography',
    'Romance',
    'Historical',
    'Thriller',
    'Horror',
    'Self-help',
    'Philosophy',
    'Poetry',
    'Young Adult',
    'Children',
    'Graphic Novel',
    'Classic',
    'Motivation',
  ];

  if (knownGenres.includes(genre)) return genre;

  return undefined;
};

const parseNumber = (num) => {
  const isString = typeof num === 'string';
  if (!isString) return;

  const parsedNum = parseInt(num);
  if (Number.isNaN(parsedNum)) return;

  return parsedNum;
};

const parseAuthor = (author) => {
  const isString = typeof author === 'string';
  if (!isString) return undefined;

  return String(author);
};

const parseIsRead = (isRead) => {
  if (isRead === undefined) return undefined;

  return isRead;
};

export const parseFilterParams = (query) => {
  const { author, minYear, maxYear, genre, isRead } = query;

  const parsedAuthor = parseAuthor(author);
  const parsedMinYear = parseNumber(minYear);
  const parsedMaxYear = parseNumber(maxYear);
  const parsedGenre = parseGenre(genre);
  const parsedIsRead = parseIsRead(isRead);

  return {
    author: parsedAuthor,
    minYear: parsedMinYear,
    maxYear: parsedMaxYear,
    genre: parsedGenre,
    isRead: parsedIsRead,
  };
};
