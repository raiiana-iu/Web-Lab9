import { useEffect, useState } from "react";

const emptyBook = { title: "", author: "", genre: "", year: new Date().getFullYear(), read: false, rating: null };

export default function BookForm({ initialBook, onSave, onCancel, busy }) {
  const [form, setForm] = useState(initialBook || emptyBook);

  useEffect(() => {
    setForm(initialBook || emptyBook);
  }, [initialBook]);

  function change(event) {
    const { name, value, type, checked } = event.target;
    setForm(current => ({
      ...current,
      [name]: type === "checkbox" ? checked :
        name === "year" ? Number(value) :
        name === "rating" ? (value === "" ? null : Number(value)) : value
    }));
  }

  function submit(event) {
    event.preventDefault();
    onSave({ ...form, year: Number(form.year), rating: form.rating === "" ? null : form.rating });
  }

  return (
    <form onSubmit={submit} className="book-form">
      <h2>{initialBook ? "Edit book" : "Add a book"}</h2>
      <input name="title" placeholder="Title" value={form.title} onChange={change} required />
      <input name="author" placeholder="Author" value={form.author} onChange={change} required />
      <input name="genre" placeholder="Genre" value={form.genre} onChange={change} required />
      <input name="year" type="number" placeholder="Year" value={form.year} onChange={change} required />
      <label><input name="read" type="checkbox" checked={form.read} onChange={change} /> Read</label>
      <label>Rating
        <select name="rating" value={form.rating ?? ""} onChange={change}>
          <option value="">Not rated</option>
          {[1, 2, 3, 4, 5].map(number => <option key={number} value={number}>{number}</option>)}
        </select>
      </label>
      <div className="actions">
        <button disabled={busy} type="submit">{busy ? "Saving..." : "Save book"}</button>
        {initialBook && <button type="button" className="secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}