import React, { useState, useEffect } from 'react';
import { Search, SortAsc, SortDesc, Plus, X } from 'lucide-react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import LazyNoteCard from './LazyNoteCard.jsx';
import { NotesListSkeleton } from '../common/LoadingSkeleton.jsx';
import { useDebounce } from '../../hooks/useDebounce.js';
import { useAuth } from '../../context/AuthContext.jsx';

const NotesList = ({ 
  notes, 
  isLoading, 
  isDeleting, 
  searchQuery, 
  sortBy,
  sortOrder,
  onSearchChange,
  onSortChange,
  onEditNote,
  onDeleteNote,
  onViewNote,
  onCreateNote,
  searchInputRef
}) => {
  const { user } = useAuth();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300);

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) {
      setIsSearching(true);
      onSearchChange(debouncedSearchQuery);
      setTimeout(() => setIsSearching(false), 200);
    }
  }, [debouncedSearchQuery, searchQuery, onSearchChange]);

  const handleSort = (field) => {
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(field, newOrder);
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />;
  };

  const clearSearch = () => {
    setLocalSearchQuery('');
    onSearchChange('');
  };

  // Show only notes created by current user
  const [showMine, setShowMine] = useState(false);

  if (isLoading) {
    return <NotesListSkeleton count={6} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            My Notes
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          </p>
        </div>
        
        <Button
          onClick={onCreateNote}
          className="flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>New Note</span>
        </Button>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isSearching ? 'text-primary-500 animate-pulse' : 'text-gray-400'}`} size={20} />
            <Input
              ref={searchInputRef}
              placeholder="Search notes..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {localSearchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort('title')}
            className="flex items-center space-x-1"
          >
            <span>Title</span>
            {getSortIcon('title')}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort('updatedAt')}
            className="flex items-center space-x-1"
          >
            <span>Updated</span>
            {getSortIcon('updatedAt')}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort('createdAt')}
            className="flex items-center space-x-1"
          >
            <span>Created</span>
            {getSortIcon('createdAt')}
          </Button>

          <Button
            variant={showMine ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setShowMine((v) => !v)}
            className="flex items-center space-x-1"
            title="Show only my notes"
          >
            <span>Mine</span>
          </Button>
        </div>
      </div>

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Plus size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {searchQuery ? 'No notes found' : 'No notes yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery 
              ? 'Try adjusting your search'
              : 'Create your first note to get started'
            }
          </p>
          {!searchQuery && (
            <Button onClick={onCreateNote}>
              Create Your First Note
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {((notes || []).filter(note => !showMine || (note?.user?.id && user?.id ? note.user.id === user.id : false))).map(note => (
          <LazyNoteCard
            key={note.id}
            note={note}
            onEdit={onEditNote}
            onDelete={onDeleteNote}
            onView={onViewNote}
            isDeleting={isDeleting}
            canEdit={note?.user?.id && user?.id ? note.user.id === user.id : false}
          />
        ))}
        </div>
      )}
    </div>
  );
};

export default NotesList;
