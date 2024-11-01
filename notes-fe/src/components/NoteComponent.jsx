import React, { useEffect, useState } from "react";
import { createNote, deleteNote, getNotes, updateNote } from "../api/notes";

const NoteComponent = () => {
  const [notesList, setNotesList] = useState([]);
  const [currentNote, setCurrentNote] = useState({
    title: "",
    description: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  useEffect(() => {
    fetchNotes(); // Use fetchNotes instead of getNotes directly
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentNote({ ...currentNote, [name]: value });
  };

  const handleAddNote = async (event) => {
    event.preventDefault();
    if (isEditMode) {
      await updateExistingNote();
    } else {
      await createNewNote();
    }
    resetNoteForm();
    fetchNotes(); // Refresh the list after adding or updating a note
  };

  const handleEditNote = (note) => {
    setCurrentNote({ title: note.title, description: note.description });
    setIsEditMode(true);
    setSelectedNoteId(note.id);
  };

  const handleDeleteNote = async (id) => {
    await deleteNote(id);
    fetchNotes(); // Refresh the list after deletion
  };

  const fetchNotes = async () => {
    try {
      const notes = await getNotes();
      console.log("Fetched notes:", notes); // Log the fetched notes
      setNotesList(notes);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  const createNewNote = async () => {
    await createNote(currentNote);
  };

  const updateExistingNote = async () => {
    await updateNote(selectedNoteId, currentNote);
  };

  const resetNoteForm = () => {
    setCurrentNote({ title: "", description: "" });
    setIsEditMode(false);
    setSelectedNoteId(null);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="text-center mb-0">
                {isEditMode ? "Edit Note" : "Add Note"}
              </h2>
            </div>

            <div className="card-body">
              <form onSubmit={handleAddNote}>
                <div className="mb-3">
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={currentNote.title}
                    onChange={handleInputChange}
                    required
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={currentNote.description}
                    onChange={handleInputChange}
                    required
                    className="form-control"
                    rows="3"
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-4">
                  {isEditMode ? "Update Note" : "Add Note"}
                </button>
              </form>

              <div className="notes-section">
                <h3 className="h4 mb-3">Notes List</h3>
                <div className="list-group">
                  {notesList.map((note) => (
                    <div
                      key={note.id}
                      className="list-group-item list-group-item-action"
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h4 className="h5 mb-1">{note.title}</h4>
                          <p className="mb-1 text-muted">{note.description}</p>
                        </div>
                        <div className="btn-group btn-group-sm">
                          <button
                            onClick={() => handleEditNote(note)}
                            className="btn btn-outline-primary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="btn btn-outline-danger"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteComponent;
