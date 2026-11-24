import { useCallback, useEffect, useState } from "react";
import { addBook, getBooks, getStats, patchBook, removeBook, replaceBook } from "./api/books.js";
import BookForm from "./components/BookForm.jsx";
import BookCard from "./components/BookCard.jsx";

export default function App() {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ q: "", genre: "", read: "", sort: "title", order: "asc" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);

  const loadStats = useCallback(async () => {
    try { setStats(await getStats()); }
    catch (err) { setError(err.message); }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError("");
      try {
        const result = await getBooks(filters, controller.signal);
        setBooks(result);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [filters]);

  useEffect(() => { loadStats(); }, [loadStats]);

  function changeFilter(event) {
    const { name, value } = event.target;
    setFilters(current => ({ ...current, [name]: value }));
  }

  async function refreshAfterChange() {
    const result = await getBooks(filters);
    setBooks(result);
    await loadStats();
  }

  async function saveBook(book) {
    setBusy(true);
    setError("");
    try {
      if (editing) await replaceBook(editing.id, book);
      else await addBook(book);
      setEditing(null);
      await refreshAfterChange();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function changeBook(book, changes) {
    setBusy(true);
    setError("");
    try {
      await patchBook(book.id, changes);
      await refreshAfterChange();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function deleteBook(id) {
    if (!window.confirm("Delete this book?")) return;
    setBusy(true);
    setError("");
    try {
      await removeBook(id);
      setBooks(current => current.filter(book => book.id !== id));
      await loadStats();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return (
    <main className="container">
      <header><h1>My Reading List</h1><p>Keep track of the books you read.</p></header>

      {stats && <section className="stats">
        <div><strong>{stats.total}</strong><span>Total books</span></div>
        <div><strong>{stats.read}</strong><span>Read</span></div>
        <div><strong>{stats.unread}</strong><span>Unread</span></div>
        <div><strong>{stats.averageRating ?? "—"}</strong><span>Average rating</span></div>
        <div><strong>{Object.keys(stats.byGenre).length}</strong><span>Genres</span></div>
      </section>}

      {error && <p className="error">{error}</p>}

      <BookForm initialBook={editing} onSave={saveBook} onCancel={() => setEditing(null)} busy={busy} />

      <section className="library">
        <h2>Books</h2>
        <div className="filters">
          <input name="q" placeholder="Search title or author" value={filters.q} onChange={changeFilter} />
          <input name="genre" placeholder="Genre" value={filters.genre} onChange={changeFilter} />
          <select name="read" value={filters.read} onChange={changeFilter}>
            <option value="">All books</option><option value="true">Read</option><option value="false">Unread</option>
          </select>
          <select name="sort" value={filters.sort} onChange={changeFilter}>
            <option value="title">Title</option><option value="author">Author</option>
            <option value="year">Year</option><option value="rating">Rating</option>
          </select>
          <select name="order" value={filters.order} onChange={changeFilter}>
            <option value="asc">Ascending</option><option value="desc">Descending</option>
          </select>
        </div>

        {loading && <p>Loading books...</p>}
        {!loading && !error && books.length === 0 && <p>No books found.</p>}
        {!loading && books.map(book => <BookCard key={book.id} book={book} busy={busy}
          onEdit={setEditing}
          onToggle={item => changeBook(item, { read: !item.read })}
          onRate={(item, rating) => changeBook(item, { rating })}
          onDelete={deleteBook} />)}
      </section>
    </main>
  );
}