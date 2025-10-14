import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import toast from 'react-hot-toast';
import { api } from '../services/apiClient.js';

// Initial state
const initialState = {
  notes: [],
  filteredNotes: [],
  currentNote: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  searchQuery: '',
  selectedTag: '',
  authorIdFilter: null,
  error: null,
  sortBy: 'updatedAt', // 'title', 'createdAt', 'updatedAt'
  sortOrder: 'desc', // 'asc', 'desc'
  page: 1,
  pageSize: 20,
  totalCount: 0
};

// Action types
const NOTES_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_CREATING: 'SET_CREATING',
  SET_UPDATING: 'SET_UPDATING',
  SET_DELETING: 'SET_DELETING',
  SET_NOTES: 'SET_NOTES',
  ADD_NOTE: 'ADD_NOTE',
  UPDATE_NOTE: 'UPDATE_NOTE',
  DELETE_NOTE: 'DELETE_NOTE',
  SET_CURRENT_NOTE: 'SET_CURRENT_NOTE',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_SELECTED_TAG: 'SET_SELECTED_TAG',
  SET_AUTHOR_FILTER: 'SET_AUTHOR_FILTER',
  SET_SORT: 'SET_SORT',
  SET_PAGE: 'SET_PAGE',
  SET_PAGE_SIZE: 'SET_PAGE_SIZE',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_FILTERS: 'RESET_FILTERS'
};

// Reducer function
const notesReducer = (state, action) => {
  switch (action.type) {
    case NOTES_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload, error: action.payload ? null : state.error };
    case NOTES_ACTIONS.SET_CREATING:
      return { ...state, isCreating: action.payload, error: action.payload ? null : state.error };
    case NOTES_ACTIONS.SET_UPDATING:
      return { ...state, isUpdating: action.payload, error: action.payload ? null : state.error };
    case NOTES_ACTIONS.SET_DELETING:
      return { ...state, isDeleting: action.payload, error: action.payload ? null : state.error };
    case NOTES_ACTIONS.SET_NOTES:
      return { 
        ...state, 
        notes: action.payload.notes, 
        filteredNotes: action.payload.notes, 
        totalCount: action.payload.totalCount ?? state.totalCount,
        isLoading: false, 
        error: null 
      };
    case NOTES_ACTIONS.ADD_NOTE: {
      const newNotes = [...state.notes, action.payload];
      return { ...state, notes: newNotes, filteredNotes: newNotes, isCreating: false, error: null };
    }
    case NOTES_ACTIONS.UPDATE_NOTE: {
      const updatedNotes = state.notes.map((note) => (note.id === action.payload.id ? action.payload : note));
      return { ...state, notes: updatedNotes, filteredNotes: updatedNotes, currentNote: action.payload, isUpdating: false, error: null };
    }
    case NOTES_ACTIONS.DELETE_NOTE: {
      const remainingNotes = state.notes.filter((note) => note.id !== action.payload);
      return { ...state, notes: remainingNotes, filteredNotes: remainingNotes, currentNote: state.currentNote?.id === action.payload ? null : state.currentNote, isDeleting: false, error: null };
    }
    case NOTES_ACTIONS.SET_CURRENT_NOTE:
      return { ...state, currentNote: action.payload };
    case NOTES_ACTIONS.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload, filteredNotes: filterNotes(state.notes, action.payload, state.selectedTag, state.sortBy, state.sortOrder) };
    case NOTES_ACTIONS.SET_SELECTED_TAG:
      return { ...state, selectedTag: action.payload, filteredNotes: filterNotes(state.notes, state.searchQuery, action.payload, state.sortBy, state.sortOrder) };
    case NOTES_ACTIONS.SET_AUTHOR_FILTER:
      return { ...state, authorIdFilter: action.payload };
    case NOTES_ACTIONS.SET_SORT:
      return { ...state, sortBy: action.payload.sortBy, sortOrder: action.payload.sortOrder, filteredNotes: filterNotes(state.notes, state.searchQuery, state.selectedTag, action.payload.sortBy, action.payload.sortOrder) };
    case NOTES_ACTIONS.SET_PAGE:
      return { ...state, page: action.payload };
    case NOTES_ACTIONS.SET_PAGE_SIZE:
      return { ...state, pageSize: action.payload };
    case NOTES_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false, isCreating: false, isUpdating: false, isDeleting: false };
    case NOTES_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    case NOTES_ACTIONS.RESET_FILTERS:
      return { ...state, searchQuery: '', selectedTag: '', authorIdFilter: null, page: 1, filteredNotes: state.notes };
    default:
      return state;
  }
};

// Helper function to filter and sort notes
// Tags removed from UI – normalize to empty array
const normalizeTags = () => [];
const filterNotes = (notes, searchQuery, selectedTag, sortBy, sortOrder) => {
  let filtered = [...notes];
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter((note) => {
      const tags = normalizeTags(note);
      return (
        note.title.toLowerCase().includes(query) ||
        (note.content || '').toLowerCase().includes(query) ||
        tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }
  if (selectedTag) {
    filtered = filtered.filter((note) => normalizeTags(note).some((tag) => tag.toLowerCase() === selectedTag.toLowerCase()));
  }
  filtered.sort((a, b) => {
    let aValue, bValue;
    switch (sortBy) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt || a.created_at);
        bValue = new Date(b.createdAt || b.created_at);
        break;
      case 'updatedAt':
      default:
        aValue = new Date(a.updatedAt || a.updated_at);
        bValue = new Date(b.updatedAt || b.updated_at);
        break;
    }
    return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1;
  });
  return filtered;
};

// Create context
const NotesContext = createContext();

// NotesProvider component
export const NotesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);
  const { token } = useAuth();

  // Auto reload notes whenever query-related state changes
  useEffect(() => {
    if (token) {
      loadNotes();
    } else {
      dispatch({ type: NOTES_ACTIONS.SET_NOTES, payload: { notes: [], totalCount: 0 } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, state.searchQuery, state.authorIdFilter, state.sortBy, state.sortOrder, state.page, state.pageSize]);

  // Load all notes
  const loadNotes = async () => {
    if (!token) return;
    dispatch({ type: NOTES_ACTIONS.SET_LOADING, payload: true });
    try {
      const params = {};
      if (state.searchQuery) params.q = state.searchQuery;
      if (state.selectedTag) params['tags__name'] = state.selectedTag;
      if (state.authorIdFilter) params['user__id'] = state.authorIdFilter;
      if (state.sortBy) {
        const map = { title: 'title', createdAt: 'created_at', updatedAt: 'updated_at' };
        const field = map[state.sortBy] || 'updated_at';
        params.ordering = state.sortOrder === 'desc' ? `-${field}` : field;
      }
      params.page = state.page;
      params.page_size = state.pageSize;
      const data = await api.notes.list(params);
      const notes = Array.isArray(data) ? data : (data.results || []);
      const totalCount = typeof data?.count === 'number' ? data.count : notes.length;
      dispatch({ type: NOTES_ACTIONS.SET_NOTES, payload: { notes, totalCount } });
    } catch (error) {
      const msg = 'Failed to load notes';
      dispatch({ type: NOTES_ACTIONS.SET_ERROR, payload: msg });
      toast.error(msg);
    }
  };

  // Create new note
  const createNote = async (noteData) => {
    if (!token) return { success: false, error: 'Not authenticated' };
    dispatch({ type: NOTES_ACTIONS.SET_CREATING, payload: true });
    try {
      const payload = {
        title: noteData.title,
        content: noteData.content || ''
      };
      const data = await api.notes.create(payload);
      dispatch({ type: NOTES_ACTIONS.ADD_NOTE, payload: data });
      toast.success('Note created successfully!');
      return { success: true, data };
    } catch (error) {
      const msg = 'Failed to create note';
      dispatch({ type: NOTES_ACTIONS.SET_ERROR, payload: msg });
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  // Update existing note
  const updateNote = async (id, noteData) => {
    if (!token) return { success: false, error: 'Not authenticated' };
    dispatch({ type: NOTES_ACTIONS.SET_UPDATING, payload: true });
    try {
      const payload = {
        title: noteData.title,
        content: noteData.content || ''
      };
      const data = await api.notes.update(id, payload);
      dispatch({ type: NOTES_ACTIONS.UPDATE_NOTE, payload: data });
      toast.success('Note updated successfully!');
      return { success: true, data };
    } catch (error) {
      const msg = 'Failed to update note';
      dispatch({ type: NOTES_ACTIONS.SET_ERROR, payload: msg });
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    if (!token) return { success: false, error: 'Not authenticated' };
    dispatch({ type: NOTES_ACTIONS.SET_DELETING, payload: true });
    try {
      await api.notes.remove(id);
      dispatch({ type: NOTES_ACTIONS.DELETE_NOTE, payload: id });
      toast.success('Note deleted successfully!');
      return { success: true };
    } catch (error) {
      const msg = 'Failed to delete note';
      dispatch({ type: NOTES_ACTIONS.SET_ERROR, payload: msg });
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  // Get note by ID
  const getNoteById = async (id) => {
    if (!token) return { success: false, error: 'Not authenticated' };
    try {
      const data = await api.notes.get(id);
      dispatch({ type: NOTES_ACTIONS.SET_CURRENT_NOTE, payload: data });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to load note' };
    }
  };

  // Search notes via server
  const searchNotes = async (query) => {
    if (!token) return { success: false, error: 'Not authenticated' };
    try {
      const data = await api.notes.list({ q: query, page: 1, page_size: state.pageSize });
      const notes = Array.isArray(data) ? data : (data.results || []);
      const totalCount = typeof data?.count === 'number' ? data.count : notes.length;
      dispatch({ type: NOTES_ACTIONS.SET_NOTES, payload: { notes, totalCount } });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Search failed' };
    }
  };

  const setSearchQuery = (query) => dispatch({ type: NOTES_ACTIONS.SET_SEARCH_QUERY, payload: query });
  const setSelectedTag = (tag) => dispatch({ type: NOTES_ACTIONS.SET_SELECTED_TAG, payload: tag });
  const setAuthorFilter = (authorId) => dispatch({ type: NOTES_ACTIONS.SET_AUTHOR_FILTER, payload: authorId });
  const setSort = (sortBy, sortOrder) => dispatch({ type: NOTES_ACTIONS.SET_SORT, payload: { sortBy, sortOrder } });
  const setPage = (page) => dispatch({ type: NOTES_ACTIONS.SET_PAGE, payload: page });
  const setPageSize = (pageSize) => dispatch({ type: NOTES_ACTIONS.SET_PAGE_SIZE, payload: pageSize });
  const clearError = () => dispatch({ type: NOTES_ACTIONS.CLEAR_ERROR });
  const resetFilters = () => dispatch({ type: NOTES_ACTIONS.RESET_FILTERS });

  const getAllTags = () => {
    const allTags = state.notes.flatMap((note) => normalizeTags(note));
    return [...new Set(allTags)].sort();
  };

  const value = {
    ...state,
    loadNotes,
    createNote,
    updateNote,
    deleteNote,
    getNoteById,
    searchNotes,
    setSearchQuery,
    setSelectedTag,
    setAuthorFilter,
    setSort,
    setPage,
    setPageSize,
    clearError,
    resetFilters,
    getAllTags
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

// Custom hook to use notes context
export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
