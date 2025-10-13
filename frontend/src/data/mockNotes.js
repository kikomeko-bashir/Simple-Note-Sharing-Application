// Mock notes data for development
export const mockNotes = [
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

// Helper functions
export const getNotesByUserId = (userId) => {
  return mockNotes.filter(note => note.userId === parseInt(userId));
};

export const getNoteById = (id) => {
  return mockNotes.find(note => note.id === parseInt(id));
};

export const searchNotes = (query, userId) => {
  const userNotes = getNotesByUserId(userId);
  const lowercaseQuery = query.toLowerCase();
  
  return userNotes.filter(note => 
    note.title.toLowerCase().includes(lowercaseQuery) ||
    note.content.toLowerCase().includes(lowercaseQuery) ||
    note.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const filterNotesByTag = (tag, userId) => {
  const userNotes = getNotesByUserId(userId);
  return userNotes.filter(note => 
    note.tags.some(noteTag => noteTag.toLowerCase() === tag.toLowerCase())
  );
};

// Generate unique ID for new notes
export const generateNoteId = () => {
  return Math.max(...mockNotes.map(note => note.id)) + 1;
};
