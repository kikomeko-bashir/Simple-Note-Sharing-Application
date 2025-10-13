// Mock API service that simulates real API calls
import { mockAuth } from '../data/mockAuth.js';
import { 
  getNotesByUserId, 
  getNoteById, 
  searchNotes, 
  filterNotesByTag,
  generateNoteId 
} from '../data/mockNotes.js';

// Simulate API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Mock notes storage (in real app, this would be in database)
// Notes are now dynamically created for each user
let notes = [
  {
    id: 1,
    title: 'Welcome to Notes App',
    content: '# Welcome to Your Notes App!\n\nThis is your first note. You can:\n\n- **Create** new notes\n- **Edit** existing notes\n- **Delete** notes you no longer need\n- **Search** through your notes\n\n## Features\n\n- Markdown support\n- Dark/Light theme\n- Responsive design\n- Real-time search\n\n*Happy note-taking!*',
    userId: 1,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    tags: ['welcome', 'getting-started']
  },
  {
    id: 2,
    title: 'Meeting Notes - Project Planning',
    content: '## Project Planning Meeting\n\n**Date:** January 15, 2024\n**Attendees:** John, Jane, Mike\n\n### Agenda\n\n1. Project scope discussion\n2. Timeline review\n3. Resource allocation\n4. Next steps\n\n### Key Decisions\n\n- Project deadline: March 31, 2024\n- Team size: 5 developers\n- Budget: $50,000\n\n### Action Items\n\n- [ ] Create project timeline\n- [ ] Set up development environment\n- [ ] Schedule weekly standups\n- [ ] Prepare initial wireframes',
    userId: 1,
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    tags: ['meeting', 'project', 'planning']
  },
  {
    id: 3,
    title: 'Shopping List',
    content: '## Grocery Shopping\n\n### Fruits & Vegetables\n- [ ] Apples\n- [ ] Bananas\n- [ ] Spinach\n- [ ] Tomatoes\n- [ ] Carrots\n\n### Dairy\n- [ ] Milk\n- [ ] Cheese\n- [ ] Yogurt\n\n### Pantry\n- [ ] Rice\n- [ ] Pasta\n- [ ] Olive oil\n- [ ] Bread\n\n### Other\n- [ ] Coffee\n- [ ] Tea\n- [ ] Eggs',
    userId: 1,
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-20T09:15:00Z',
    tags: ['shopping', 'grocery', 'personal']
  },
  {
    id: 4,
    title: 'React Hooks Cheat Sheet',
    content: '# React Hooks Cheat Sheet\n\n## useState\n```javascript\nconst [state, setState] = useState(initialValue);\n```\n\n## useEffect\n```javascript\nuseEffect(() => {\n  // side effects\n  return () => {\n    // cleanup\n  };\n}, [dependencies]);\n```\n\n## useContext\n```javascript\nconst value = useContext(MyContext);\n```\n\n## useReducer\n```javascript\nconst [state, dispatch] = useReducer(reducer, initialState);\n```\n\n## Custom Hooks\n```javascript\nfunction useCustomHook() {\n  // custom logic\n  return { value, setValue };\n}\n```',
    userId: 1,
    createdAt: '2024-01-25T16:45:00Z',
    updatedAt: '2024-01-25T16:45:00Z',
    tags: ['react', 'hooks', 'javascript', 'reference']
  },
  {
    id: 5,
    title: 'Book Recommendations',
    content: '## Books to Read\n\n### Fiction\n- **The Seven Husbands of Evelyn Hugo** by Taylor Jenkins Reid\n- **Project Hail Mary** by Andy Weir\n- **The Midnight Library** by Matt Haig\n\n### Non-Fiction\n- **Atomic Habits** by James Clear\n- **Thinking, Fast and Slow** by Daniel Kahneman\n- **Sapiens** by Yuval Noah Harari\n\n### Technical\n- **Clean Code** by Robert C. Martin\n- **Design Patterns** by Gang of Four\n- **System Design Interview** by Alex Xu\n\n### Currently Reading\n- [ ] **The Lean Startup** by Eric Ries',
    userId: 1,
    createdAt: '2024-02-01T11:20:00Z',
    updatedAt: '2024-02-01T11:20:00Z',
    tags: ['books', 'reading', 'recommendations']
  },
  {
    id: 6,
    title: 'Weekend Trip Ideas',
    content: '## Weekend Getaway Ideas\n\n### Local Options\n- **Mountain Hiking** - Blue Ridge Mountains\n- **Beach Day** - Virginia Beach\n- **City Tour** - Washington DC\n- **Wine Tasting** - Local vineyards\n\n### Budget Considerations\n- Gas: $50-100\n- Food: $100-200\n- Activities: $50-150\n- Accommodation: $100-300\n\n### Packing List\n- [ ] Comfortable shoes\n- [ ] Weather-appropriate clothing\n- [ ] Camera\n- [ ] Snacks\n- [ ] Water bottles\n- [ ] First aid kit',
    userId: 1,
    createdAt: '2024-02-05T13:10:00Z',
    updatedAt: '2024-02-05T13:10:00Z',
    tags: ['travel', 'weekend', 'planning', 'personal']
  }
];

// Helper function to get user ID from token
const getUserIdFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token));
    return payload.id;
  } catch (error) {
    return null;
  }
};

// Mock API service
export const mockApi = {
  // Authentication endpoints
  auth: {
    login: async (credentials) => {
      try {
        const response = await mockAuth.login(credentials.email, credentials.password);
        return {
          data: response,
          status: 200,
          message: 'Login successful'
        };
      } catch (error) {
        return {
          data: null,
          status: 401,
          message: error.message
        };
      }
    },
    
    register: async (userData) => {
      try {
        const response = await mockAuth.register(userData);
        return {
          data: response,
          status: 201,
          message: 'Registration successful'
        };
      } catch (error) {
        return {
          data: null,
          status: 400,
          message: error.message
        };
      }
    },
    
    verifyToken: async (token) => {
      try {
        const response = await mockAuth.verifyToken(token);
        return {
          data: response,
          status: 200,
          message: 'Token valid'
        };
      } catch (error) {
        return {
          data: null,
          status: 401,
          message: error.message
        };
      }
    }
  },
  
  // Notes endpoints
  notes: {
    getAll: async (token) => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const userId = getUserIdFromToken(token);
        if (!userId) {
          return {
            data: null,
            status: 401,
            message: 'Invalid token'
          };
        }
        
        // Check if user has any notes, if not create sample notes
        let userNotes = notes.filter(note => note.userId === userId);
        
        if (userNotes.length === 0) {
          // Create sample notes for new user
          const sampleNotes = [
            {
              id: Date.now() + 1,
              title: 'Welcome to Your Notes App!',
              content: '# Welcome to Your Notes App!\n\nThis is your first note. You can:\n\n- **Create** new notes\n- **Edit** existing notes\n- **Delete** notes you no longer need\n- **Search** through your notes\n\n## Features\n\n- Markdown support\n- Dark/Light theme\n- Responsive design\n- Real-time search\n\n*Happy note-taking!*',
              userId: userId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              tags: ['welcome', 'getting-started']
            },
            {
              id: Date.now() + 2,
              title: 'Quick Start Guide',
              content: '## Getting Started\n\n1. **Create a new note** by clicking the "New Note" button\n2. **Add tags** to organize your notes\n3. **Use markdown** for rich formatting\n4. **Search** through your notes using the search bar\n5. **Filter by tags** to find specific notes\n\n### Markdown Tips\n\n- Use `#` for headers\n- Use `**bold**` for bold text\n- Use `*italic*` for italic text\n- Use `-` for bullet points\n- Use `[link](url)` for links',
              userId: userId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              tags: ['guide', 'help', 'getting-started']
            }
          ];
          
          // Add sample notes to the notes array
          notes.push(...sampleNotes);
          userNotes = sampleNotes;
        }
        
        return {
          data: userNotes,
          status: 200,
          message: 'Notes retrieved successfully'
        };
      } catch (error) {
        return {
          data: null,
          status: 500,
          message: 'Failed to retrieve notes'
        };
      }
    },
    
    getById: async (id, token) => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const userId = getUserIdFromToken(token);
        if (!userId) {
          return {
            data: null,
            status: 401,
            message: 'Invalid token'
          };
        }
        
        const note = notes.find(n => n.id === parseInt(id) && n.userId === userId);
        
        if (!note) {
          return {
            data: null,
            status: 404,
            message: 'Note not found'
          };
        }
        
        return {
          data: note,
          status: 200,
          message: 'Note retrieved successfully'
        };
      } catch (error) {
        return {
          data: null,
          status: 500,
          message: 'Failed to retrieve note'
        };
      }
    },
    
    create: async (noteData, token) => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const userId = getUserIdFromToken(token);
        if (!userId) {
          return {
            data: null,
            status: 401,
            message: 'Invalid token'
          };
        }
        
        const newNote = {
          id: Math.max(...notes.map(n => n.id)) + 1,
          title: noteData.title,
          content: noteData.content || '',
          userId: userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: noteData.tags || []
        };
        
        notes.push(newNote);
        
        return {
          data: newNote,
          status: 201,
          message: 'Note created successfully'
        };
      } catch (error) {
        return {
          data: null,
          status: 500,
          message: 'Failed to create note'
        };
      }
    },
    
    update: async (id, noteData, token) => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const userId = getUserIdFromToken(token);
        if (!userId) {
          return {
            data: null,
            status: 401,
            message: 'Invalid token'
          };
        }
        
        const noteIndex = notes.findIndex(n => n.id === parseInt(id) && n.userId === userId);
        
        if (noteIndex === -1) {
          return {
            data: null,
            status: 404,
            message: 'Note not found'
          };
        }
        
        const updatedNote = {
          ...notes[noteIndex],
          title: noteData.title,
          content: noteData.content || '',
          updatedAt: new Date().toISOString(),
          tags: noteData.tags || []
        };
        
        notes[noteIndex] = updatedNote;
        
        return {
          data: updatedNote,
          status: 200,
          message: 'Note updated successfully'
        };
      } catch (error) {
        return {
          data: null,
          status: 500,
          message: 'Failed to update note'
        };
      }
    },
    
    delete: async (id, token) => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const userId = getUserIdFromToken(token);
        if (!userId) {
          return {
            data: null,
            status: 401,
            message: 'Invalid token'
          };
        }
        
        const noteIndex = notes.findIndex(n => n.id === parseInt(id) && n.userId === userId);
        
        if (noteIndex === -1) {
          return {
            data: null,
            status: 404,
            message: 'Note not found'
          };
        }
        
        notes.splice(noteIndex, 1);
        
        return {
          data: { id: parseInt(id) },
          status: 200,
          message: 'Note deleted successfully'
        };
      } catch (error) {
        return {
          data: null,
          status: 500,
          message: 'Failed to delete note'
        };
      }
    },
    
    search: async (query, token) => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const userId = getUserIdFromToken(token);
        if (!userId) {
          return {
            data: null,
            status: 401,
            message: 'Invalid token'
          };
        }
        
        const userNotes = notes.filter(note => note.userId === userId);
        const lowercaseQuery = query.toLowerCase();
        
        const searchResults = userNotes.filter(note => 
          note.title.toLowerCase().includes(lowercaseQuery) ||
          note.content.toLowerCase().includes(lowercaseQuery) ||
          note.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
        );
        
        return {
          data: searchResults,
          status: 200,
          message: 'Search completed successfully'
        };
      } catch (error) {
        return {
          data: null,
          status: 500,
          message: 'Search failed'
        };
      }
    }
  }
};

// Helper function to get auth token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth token in localStorage
export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Helper function to remove auth token from localStorage
export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};
