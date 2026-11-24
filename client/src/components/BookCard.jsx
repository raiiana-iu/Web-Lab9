export default function BookCard({ book, onEdit, onToggle, onRate, onDelete, busy }) {
  return (
    <article className="book-card">
      <div>
        <h3>{book.title}</h3>
        <p>{book.author} · {book.year} · {book.genre}</p>
        <p>{book.read ? "Read" : "Unread"} · Rating: {book.rating ?? "Not rated"}</p>
      </div>
      <div className="actions">
        <button disabled={busy} onClick={() => onToggle(book)}>{book.read ? "Mark unread" : "Mark read"}</button>
        <select aria-label={`Rate ${book.title}`} value={book.rating ?? ""} disabled={busy}
          onChange={event => onRate(book, event.target.value === "" ? null : Number(event.target.value))}>
          <option value="">No rating</option>
          {[1, 2, 3, 4, 5].map(number => <option key={number} value={number}>{number} star</option>)}
        </select>
        <button className="secondary" disabled={busy} onClick={() => onEdit(book)}>Edit</button>
        <button className="danger" disabled={busy} onClick={() => onDelete(book.id)}>Delete</button>
      </div>
    </article>
  );
}