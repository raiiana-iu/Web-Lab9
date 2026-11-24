const delay = () => new Promise(resolve => setTimeout(resolve, 100));

let books = [
  { id: 1, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "fantasy", year: 1937, read: true, rating: 5 },
  { id: 2, title: "1984", author: "George Orwell", genre: "fiction", year: 1949, read: true, rating: 5 },
  { id: 3, title: "Dune", author: "Frank Herbert", genre: "science fiction", year: 1965, read: false, rating: null },
  { id: 4, title: "Pride and Prejudice", author: "Jane Austen", genre: "romance", year: 1813, read: true, rating: 4 },
  { id: 5, title: "The Martian", author: "Andy Weir", genre: "science fiction", year: 2011, read: false, rating: null },
  { id: 6, title: "The Name of the Wind", author: "Patrick Rothfuss", genre: "fantasy", year: 2007, read: true, rating: 5 }
];

export async function getAllBooks() {
  await delay();
  return books.map(book => ({ ...book }));
}

export async function getBook(id) {
  await delay();
  const book = books.find(item => item.id === id);
  return book ? { ...book } : null;
}

export async function createBook(data) {
  await delay();
  const id = books.length ? Math.max(...books.map(book => book.id)) + 1 : 1;
  const book = { ...data, id };
  books = [...books, book];
  return { ...book };
}

export async function updateBook(id, data) {
  await delay();
  const exists = books.some(book => book.id === id);
  if (!exists) return null;
  books = books.map(book => book.id === id ? { ...data, id } : book);
  return { ...books.find(book => book.id === id) };
}

export async function deleteBook(id) {
  await delay();
  const exists = books.some(book => book.id === id);
  if (!exists) return false;
  books = books.filter(book => book.id !== id);
  return true;
}

export async function getStats() {
  await delay();
  const total = books.length;
  const read = books.filter(book => book.read).length;
  const rated = books.filter(book => book.rating !== null);
  const byGenre = {};
  books.forEach(book => {
    byGenre[book.genre] = (byGenre[book.genre] || 0) + 1;
  });
  return {
    total,
    read,
    unread: total - read,
    averageRating: rated.length
      ? Math.round((rated.reduce((sum, book) => sum + book.rating, 0) / rated.length) * 10) / 10
      : null,
    byGenre
  };
}