import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState("notes");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const [search, setSearch] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/notes");
      setNotes(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Title and Content are required");
      return;
    }

    const safeTags = typeof tags === "string" ? tags : "";

    if (!editMode && !safeTags.trim()) {
      alert("Please add tags before saving the note");
      return;
    }

    const formattedTags = safeTags
      .split(" ")
      .filter((t) => t.trim() !== "")
      .map((t) => (t.startsWith("#") ? t : `#${t}`))
      .join(" ");

    try {
      if (editMode) {
        if (!editId) return;

        await axios.put(`http://localhost:5000/notes/${editId}`, {
          title,
          content,
          tags: formattedTags,
        });
      } else {
        await axios.post("http://localhost:5000/notes", {
          title,
          content,
          tags: formattedTags,
        });
      }

      setTitle("");
      setContent("");
      setTags("");
      setEditMode(false);
      setEditId(null);

      fetchNotes();
      setView("notes");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNote = async (id) => {
    const confirmDelete = window.confirm("Delete this note?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/notes/${id}`);
      fetchNotes();
      setSelectedNote(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title || "");
    setContent(note.content || "");
    setTags(note.tags || "");

    setEditId(note._id);
    setEditMode(true);
    setView("create");
  };

  const filteredNotes = notes.filter((n) => {
    const q = search.toLowerCase();

    const tags =
      typeof n.tags === "string"
        ? n.tags.toLowerCase()
        : Array.isArray(n.tags)
        ? n.tags.join(" ").toLowerCase()
        : "";

    return tags.includes(q);
  });

  return (
    <div className="app">
      <div className="topbar">Smart Notes 📝</div>

      <div className="sidebar">
        <button onClick={() => setView("create")}>New Note ➕</button>
        <button onClick={() => setView("notes")}>All Notes 📂</button>

        <div className="noteCount">
          Total Notes: {notes.length}
        </div>
      </div>

      <div className="main">

        {view === "create" && (
          <div className="editor">
            <div className="editHeader">
              <h2>{editMode ? "Edit Note" : "Create Note"}</h2>

              {editMode && (
                <button
                  className="backBtn"
                  onClick={() => {
                    setEditMode(false);
                    setEditId(null);
                    setTitle("");
                    setContent("");
                    setTags("");
                    setView("notes");
                  }}
                >
                  ← Back
                </button>
              )}
            </div>

            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Write your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <input
              placeholder="Add tag"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />

            <button className="primary" onClick={saveNote}>
              {editMode ? "Update Note" : "Save Note"}
            </button>
          </div>
        )}

        {view === "notes" && (
          <div>
            <h2 className="title">All Notes</h2>

            <input
              className="searchBar"
              placeholder="Search tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {loading ? (
              <p>Loading Notes...</p>
            ) : filteredNotes.length === 0 ? (
              <div className="empty">No Notes Found</div>
            ) : (
              <div className="grid">
                {filteredNotes.map((note) => (
                  <div
                    key={note._id}
                    className="card"
                    onClick={() => setSelectedNote(note)}
                  >

                    {/* ✅ TITLE PINK */}
                    <h3 style={{ color: "#be185d" }}>
                      {note.title}
                    </h3>

                    <p>
                      {note.content.length > 60
                        ? note.content.substring(0, 60) + "..."
                        : note.content}
                    </p>

                    {/* ✅ TAGS BLUE */}
                    <span style={{ color: "#2563eb", fontWeight: "600" }}>
                      {note.tags}
                    </span>

                    <div className="time">
                      {new Date(
                        note.updatedAt || note.createdAt
                      ).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedNote && (
        <div className="modal" onClick={() => setSelectedNote(null)}>
          <div className="modalBox" onClick={(e) => e.stopPropagation()}>

            {/* ✅ FIXED MODAL TITLE COLOR */}
            <h2 style={{ color: "#be185d" }}>
              {selectedNote.title}
            </h2>

            <p>{selectedNote.content}</p>

            {/* ✅ FIXED MODAL TAG COLOR */}
            <small style={{ color: "#2563eb", fontWeight: "600" }}>
              {selectedNote.tags}
            </small>

            <div className="time modalTime">
              {new Date(
                selectedNote.updatedAt || selectedNote.createdAt
              ).toLocaleString("en-IN")}
            </div>

            <div className="modalActions">
              <button
                className="editBtn"
                onClick={() => {
                  handleEdit(selectedNote);
                  setSelectedNote(null);
                }}
              >
                Edit
              </button>

              <button
                className="danger"
                onClick={() => deleteNote(selectedNote._id)}
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default App;