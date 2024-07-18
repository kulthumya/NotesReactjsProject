import React, { useState, useEffect } from 'react';
import './Notes.css';

function Notes({ userId }) {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await fetch(`http://localhost:3000/notes/${userId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setNotes(data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const addNote = async () => {
        try {
            const response = await fetch('http://localhost:3000/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, title, content }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchNotes();
            setTitle('');
            setContent('');
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    const updateNote = async (id, updatedTitle, updatedContent) => {
        try {
            const response = await fetch(`http://localhost:3000/notes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: updatedTitle, content: updatedContent }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchNotes();
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    const deleteNote = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/notes/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchNotes();
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const startEditing = (id) => {
        setNotes(notes.map(note => note.id === id ? { ...note, isEditing: true } : note));
    };

    const saveNote = (id) => {
        const note = notes.find(note => note.id === id);
        updateNote(id, note.title, note.content);
        setNotes(notes.map(note => note.id === id ? { ...note, isEditing: false } : note));
    };

    return (
        <div className="notes-container">
            <h2>Notes</h2>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <button onClick={addNote}>Add Note</button>
            <ul>
                {notes.map(note => (
                    <li key={note.id} className="note-item">
                        <div className="note-input">
                            <input
                                type="text"
                                value={note.title}
                                onChange={(e) => setNotes(notes.map(n => n.id === note.id ? { ...n, title: e.target.value } : n))}
                                readOnly={!note.isEditing}
                            />
                        </div>
                        <div className="note-textarea">
                            <textarea
                                value={note.content}
                                onChange={(e) => setNotes(notes.map(n => n.id === note.id ? { ...n, content: e.target.value } : n))}
                                readOnly={!note.isEditing}
                            ></textarea>
                        </div>
                        {note.isEditing ? (
                            <button onClick={() => saveNote(note.id)}>Save</button>
                        ) : (
                            <button onClick={() => startEditing(note.id)}>Edit</button>
                        )}
                        <button onClick={() => deleteNote(note.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Notes;
