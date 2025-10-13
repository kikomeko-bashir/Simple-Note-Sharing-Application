import React from 'react';
import Button from '../common/Button.jsx';
import { X, Calendar, Edit2, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const safeFormat = (dateString) => {
  if (!dateString) return 'just now';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return 'just now';
  return formatDistanceToNow(d, { addSuffix: true });
};

const NoteModal = ({ note, onClose, onEdit, onDelete, canEdit = false, isDeleting = false }) => {
  if (!note) return null;

  const updated = note.updatedAt || note.updated_at;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{note.title}</h3>
              <div className="mt-1 flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar size={12} />
                  <span>Updated {safeFormat(updated)}</span>
                </div>
                {note?.user?.username && (
                  <div className="flex items-center space-x-1">
                    <span>by</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{note.user.username}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {canEdit && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit && onEdit(note)}
                    className="flex items-center space-x-1"
                  >
                    <Edit2 size={14} />
                    <span>Edit</span>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete && onDelete(note.id)}
                    loading={isDeleting}
                    disabled={isDeleting}
                    className="flex items-center space-x-1"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm" onClick={onClose}>
                <X size={16} />
              </Button>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 max-h-[70vh] overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{note.content}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;


