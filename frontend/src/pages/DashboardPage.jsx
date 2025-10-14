import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotes } from '../context/NotesContext.jsx';
import { NotesProvider } from '../context/NotesContext.jsx';
import Button from '../components/common/Button.jsx';
import ThemeToggle from '../components/common/ThemeToggle.jsx';
import PageTransition from '../components/common/PageTransition.jsx';
import SkipToContent from '../components/common/SkipToContent.jsx';
import ResponsiveNav from '../components/common/ResponsiveNav.jsx';
import NotesList from '../components/notes/NotesList.jsx';
import NoteForm from '../components/notes/NoteForm.jsx';
import NoteEditor from '../components/notes/NoteEditor.jsx';
import NoteModal from '../components/notes/NoteModal.jsx';
import { useNotesKeyboardShortcuts } from '../hooks/useKeyboardNavigation.js';
import { LogOut, User } from 'lucide-react';

const DashboardContent = () => {
  const { user, logout } = useAuth();
  const {
    notes,
    filteredNotes,
    currentNote,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    searchQuery,
    setSearchQuery,
    setSort,
    setCurrentNote
  } = useNotes();

  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [viewingNote, setViewingNote] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const searchInputRef = useRef(null);

  const handleCreateNote = () => {
    setEditingNote(null);
    setViewingNote(null);
    setShowNoteForm(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setViewingNote(null);
    setShowNoteForm(true);
  };

  const handleViewNote = async (note) => {
    setViewingNote(note);
    setShowNoteForm(false);
    setEditingNote(null);
    setShowModal(true);
  };

  const { updateNote, createNote, deleteNote } = useNotes();

  const handleSaveNote = async (noteData) => {
    if (editingNote) {
      const result = await updateNote(editingNote.id, noteData);
      if (result.success) {
        setShowNoteForm(false);
        setEditingNote(null);
      }
    } else {
      const result = await createNote(noteData);
      if (result.success) {
        setShowNoteForm(false);
      }
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      const result = await deleteNote(noteId);
      if (result.success) {
        setViewingNote(null);
        setEditingNote(null);
      }
    }
  };

  const handleCancelForm = () => {
    setShowNoteForm(false);
    setEditingNote(null);
  };

  const handleBackToList = () => {
    setViewingNote(null);
  };

  // Keyboard shortcuts
  useNotesKeyboardShortcuts({
    createNote: handleCreateNote,
    focusSearch: () => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    },
    closeModal: () => {
      if (showNoteForm) {
        setShowNoteForm(false);
        setEditingNote(null);
      } else if (viewingNote) {
        setViewingNote(null);
      }
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SkipToContent />
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Notes App
              </h1>
            </div>
            
            <ResponsiveNav>
              <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                <User size={16} />
                <span>{user?.name || user?.email}</span>
              </div>
              
              <ThemeToggle />
              
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </ResponsiveNav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" tabIndex="-1" className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <PageTransition>
          {showNoteForm ? (
            <NoteForm
              note={editingNote}
              onSave={handleSaveNote}
              onCancel={handleCancelForm}
              isSaving={isCreating || isUpdating}
            />
          ) : (
            <NotesList
              notes={filteredNotes}
              isLoading={isLoading}
              isDeleting={isDeleting}
              searchQuery={searchQuery}
              sortBy={undefined}
              sortOrder={undefined}
              onSearchChange={setSearchQuery}
              onSortChange={setSort}
              onEditNote={handleEditNote}
              onDeleteNote={handleDeleteNote}
              onViewNote={handleViewNote}
              onCreateNote={handleCreateNote}
              searchInputRef={searchInputRef}
            />
          )}
        </PageTransition>
        {showModal && (
          <NoteModal
            note={viewingNote}
            onClose={() => setShowModal(false)}
            onEdit={(n) => {
              setShowModal(false);
              handleEditNote(n);
            }}
            onDelete={(id) => {
              setShowModal(false);
              handleDeleteNote(id);
            }}
            canEdit={viewingNote?.user?.id && user?.id ? viewingNote.user.id === user.id : false}
            isDeleting={isDeleting}
          />
        )}
      </main>
    </div>
  );
};

const DashboardPage = () => {
  return (
    <NotesProvider>
      <DashboardContent />
    </NotesProvider>
  );
};

export default DashboardPage;
