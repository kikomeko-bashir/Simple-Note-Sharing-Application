import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Edit2, Trash2, Calendar, Tag } from 'lucide-react';
import Button from '../common/Button.jsx';

const NoteCard = ({ note, onEdit, onDelete, onView, isDeleting, canEdit = false }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'just now';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'just now';
    return formatDistanceToNow(d, { addSuffix: true });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const stripMarkdown = (content) => {
    return content
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
      .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
      .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
      .trim();
  };

  return (
    <div 
      className="card p-6 hover:shadow-md transition-shadow duration-200 group cursor-pointer flex flex-col h-56"
      onClick={() => onView && onView(note)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {note.title}
        </h3>
        
        {canEdit && (
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(note);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit2 size={14} />
            </Button>
            
            <Button
              variant="danger"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              loading={isDeleting}
              disabled={isDeleting}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        )}
      </div>

      {/* Content Preview */}
      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-4">
          {truncateContent(stripMarkdown(note.content), 280)}
        </p>
      </div>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center space-x-1 mb-2">
            <Tag size={12} className="text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Tags:</span>
          </div>
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

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Calendar size={12} />
            <span>Updated {formatDate(note.updatedAt || note.updated_at)}</span>
          </div>
          {note?.user?.username && (
            <div className="flex items-center space-x-1">
              <span>by</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">{note.user.username}</span>
            </div>
          )}
        </div>
        
        <div className="text-xs">
          {note.content.length > 150 && (
            <span className="text-primary-600 dark:text-primary-400">
              {Math.ceil(note.content.length / 1000)} min read
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
