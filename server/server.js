import express from "express";
import cors from "cors";
import {
  getAllBooks, getBook, createBook, updateBook, deleteBook, getStats
} from "./booksStore.js";
import { validateBook, isDuplicate } from "./validate.js";

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

function validId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

app.get("/api/books", async (req, res, next) => {
  try {
    const allowed = ["q", "genre", "read", "sort", "order"];
    for (const key of Object.keys(req.query)) {
      if (!allowed.includes(key) || Array.isArray(req.query[key])) {
        return res.status(400).json({ error: `Invalid or repeated query parameter: ${key}` });
      }
    }

    const { q, genre, read, sort, order } = req.query;
    if (read !== undefined && !["true", "false"].includes(read)) {
      return res.status(400).json({ error: "read must be true or false" });
    }
    if (sort !== undefined && !["title", "author", "year", "rating"].includes(sort)) {
      return res.status(400).json({ error: "sort must be title, author, year, or rating" });
    }
    if (order !== undefined && !["asc", "desc"].includes(order)) {
      return res.status(400).json({ error: "order must be asc or desc" });
    }
    if (order !== undefined && sort === undefined) {
      return res.status(400).json({ error: "order requires sort" });
    }

    let result = await getAllBooks();
    if (q) {
      const term = q.toLowerCase();
      result = result.filter(book =>
        book.title.toLowerCase().includes(term) || book.author.toLowerCase().includes(term)
      );
    }
    if (genre) result = result.filter(book => book.genre === genre.toLowerCase());
    if (read !== undefined) result = result.filter(book => book.read === (read === "true"));

    if (sort) {
      const direction = order === "desc" ? -1 : 1;
      result = [...result].sort((a, b) => {
        if (sort === "rating") {
          if (a.rating === null && b.rating === null) return 0;
          if (a.rating === null) return 1;
          if (b.rating === null) return -1;
        }
        const comparison = typeof a[sort] === "string"
          ? a[sort].localeCompare(b[sort])
          : a[sort] - b[sort];
        return comparison * direction;
      });
    }
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

app.get("/api/books/:id", async (req, res, next) => {
  try {
    const id = validId(req.params.id);
    if (!id) return res.status(400).json({ error: "id must be a positive integer" });
    const book = await getBook(id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    return res.json(book);
  } catch (error) { return next(error); }
});

app.post("/api/books", async (req, res, next) => {
  try {
    const checked = validateBook(req.body);
    if (!checked.valid) return res.status(400).json({ error: checked.message });
    const books = await getAllBooks();
    if (isDuplicate(books, checked.value)) return res.status(409).json({ error: "A book with this title and author already exists" });
    const book = await createBook(checked.value);
    res.location(`/api/books/${book.id}`);
    return res.status(201).json(book);
  } catch (error) { return next(error); }
});

app.put("/api/books/:id", async (req, res, next) => {
  try {
    const id = validId(req.params.id);
    if (!id) return res.status(400).json({ error: "id must be a positive integer" });
    const existing = await getBook(id);
    if (!existing) return res.status(404).json({ error: "Book not found" });
    const checked = validateBook(req.body);
    if (!checked.valid) return res.status(400).json({ error: checked.message });
    const books = await getAllBooks();
    if (isDuplicate(books, checked.value, id)) return res.status(409).json({ error: "A book with this title and author already exists" });
    return res.json(await updateBook(id, checked.value));
  } catch (error) { return next(error); }
});

app.patch("/api/books/:id", async (req, res, next) => {
  try {
    const id = validId(req.params.id);
    if (!id) return res.status(400).json({ error: "id must be a positive integer" });
    const existing = await getBook(id);
    if (!existing) return res.status(404).json({ error: "Book not found" });
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({ error: "Request body must be a JSON object" });
    }
    const allowed = ["title", "author", "genre", "year", "read", "rating"];
    const changes = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    const checked = validateBook({ ...existing, ...changes });
    if (!checked.valid) return res.status(400).json({ error: checked.message });
    const books = await getAllBooks();
    if (isDuplicate(books, checked.value, id)) return res.status(409).json({ error: "A book with this title and author already exists" });
    return res.json(await updateBook(id, checked.value));
  } catch (error) { return next(error); }
});

app.delete("/api/books/:id", async (req, res, next) => {
  try {
    const id = validId(req.params.id);
    if (!id) return res.status(400).json({ error: "id must be a positive integer" });
    const deleted = await deleteBook(id);
    if (!deleted) return res.status(404).json({ error: "Book not found" });
    return res.status(204).end();
  } catch (error) { return next(error); }
});

app.get("/api/stats", async (req, res, next) => {
  try { return res.json(await getStats()); }
  catch (error) { return next(error); }
});

// Deliberate async error route for testing; documented in README.
app.get("/api/crash", async () => {
  throw new Error("Intentional test error");
});

app.use("/api", (req, res) => res.status(404).json({ error: "Not found" }));

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ error: "Malformed JSON request body" });
  }
  console.error(error);
  return res.status(500).json({ error: "Something went wrong" });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));