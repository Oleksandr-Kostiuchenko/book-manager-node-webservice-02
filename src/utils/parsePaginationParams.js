const parseNum = (number, defaultValue) => {
  const isString = typeof number === 'string';
  if (!isString) return defaultValue;

  const parsedNum = parseInt(number);
  if (Number.isNaN(parsedNum)) return defaultValue;

  return parsedNum;
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;

  const parsedPage = parseNum(page, 1);
  const parsedPerPage = parseNum(perPage, 10);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
