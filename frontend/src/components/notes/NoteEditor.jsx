import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { formatDistanceToNow } from 'date-fns';
import { Edit2, Trash2, ArrowLeft, Calendar, Tag, Eye, EyeOff, Copy, Check } from 'lucide-react';
import Button from '../common/Button.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const NoteEditor = ({ 
  note, 
  onEdit, 
  onDelete, 
  onBack, 
  isDeleting 
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const { isDark } = useTheme();

  if (!note) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Note not found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The note you're looking for doesn't exist or has been deleted.
        </p>
        <Button onClick={onBack}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Notes
        </Button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'just now';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'just now';
    return formatDistanceToNow(d, { addSuffix: true });
  };

  const copyCode = async (code, language) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(language);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Back to Notes</span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-2"
            >
              {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
              <span>{showPreview ? 'Edit' : 'Preview'}</span>
            </Button>
            
            <Button
              onClick={() => onEdit(note)}
              className="flex items-center space-x-2"
            >
              <Edit2 size={16} />
              <span>Edit</span>
            </Button>
            
            <Button
              variant="danger"
              onClick={() => onDelete(note.id)}
              loading={isDeleting}
              disabled={isDeleting}
              className="flex items-center space-x-2"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </Button>
          </div>
        </div>

        {/* Note Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {note.title}
        </h1>

        {/* Note Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <div className="flex items-center space-x-1">
            <Calendar size={16} />
            <span>Updated {formatDate(note.updatedAt || note.updated_at)}</span>
          </div>
          
          {note.tags && note.tags.length > 0 && (
            <div className="flex items-center space-x-2">
              <Tag size={16} />
              <div className="flex flex-wrap gap-1">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="card p-8">
        {showPreview ? (
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';
                  
                  if (!inline && language) {
                    return (
                      <div className="relative group">
                        <div className="absolute top-2 right-2 z-10">
                          <button
                            onClick={() => copyCode(String(children).replace(/\n$/, ''), language)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-gray-800 dark:bg-gray-700 text-white rounded hover:bg-gray-700 dark:hover:bg-gray-600"
                            title="Copy code"
                          >
                            {copiedCode === language ? (
                              <Check size={16} />
                            ) : (
                              <Copy size={16} />
                            )}
                          </button>
                        </div>
                        <SyntaxHighlighter
                          style={isDark ? oneDark : oneLight}
                          language={language}
                          PreTag="div"
                          className="rounded-lg"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    );
                  }
                  
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                table({ children }) {
                  return (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        {children}
                      </table>
                    </div>
                  );
                },
                thead({ children }) {
                  return (
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      {children}
                    </thead>
                  );
                },
                th({ children }) {
                  return (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {children}
                    </th>
                  );
                },
                td({ children }) {
                  return (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {children}
                    </td>
                  );
                }
              }}
            >
              {note.content}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 leading-relaxed font-mono text-sm">
            {note.content}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Created {formatDate(note.createdAt || note.created_at)} • 
          {note.content.length > 0 && ` ${Math.ceil(note.content.length / 1000)} min read`}
        </p>
      </div>
    </div>
  );
};

export default NoteEditor;
