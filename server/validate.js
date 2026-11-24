export function validateBook(data) {
  const errors = [];

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { valid: false, message: "Request body must be a JSON object" };
  }

  if (typeof data.title !== "string" || !data.title.trim()) errors.push("title must be a non-empty string");
  if (typeof data.author !== "string" || !data.author.trim()) errors.push("author must be a non-empty string");
  if (typeof data.genre !== "string" || !data.genre.trim()) errors.push("genre must be a non-empty string");
  if (!Number.isInteger(data.year) || data.year < 1 || data.year > new Date().getFullYear()) {
    errors.push("year must be a valid positive year");
  }
  if (typeof data.read !== "boolean") errors.push("read must be true or false");
  if (!(data.rating === null || (Number.isInteger(data.rating) && data.rating >= 1 && data.rating <= 5))) {
    errors.push("rating must be null or an integer from 1 to 5");
  }

  return errors.length
    ? { valid: false, message: errors.join("; ") }
    : {
        valid: true,
        value: {
          title: data.title.trim(),
          author: data.author.trim(),
          genre: data.genre.trim().toLowerCase(),
          year: data.year,
          read: data.read,
          rating: data.rating
        }
      };
}

export function isDuplicate(books, candidate, ignoreId = null) {
  return books.some(book =>
    book.id !== ignoreId &&
    book.title.toLowerCase() === candidate.title.toLowerCase() &&
    book.author.toLowerCase() === candidate.author.toLowerCase()
  );
}