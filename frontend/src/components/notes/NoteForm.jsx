import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Plus } from 'lucide-react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import FocusTrap from '../common/FocusTrap.jsx';
import { validationRules } from '../../utils/validation.js';

const NoteForm = ({ note, onSave, onCancel, isSaving }) => {
  // Tags removed from UI
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: {
      title: note?.title || '',
      content: note?.content || ''
    }
  });

  const content = watch('content');

  // Update form when note changes
  useEffect(() => {
    if (note) {
      reset({
        title: note.title,
        content: note.content
      });
      // tags removed
    } else {
      reset({
        title: '',
        content: ''
      });
      // tags removed
    }
  }, [note, reset]);

  const onSubmit = (data) => {
    onSave({ ...data });
  };

  // Tag helpers removed

  return (
    <FocusTrap>
      <div className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" role="form" aria-label="Note form">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {note ? 'Edit Note' : 'Create New Note'}
          </h2>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="flex items-center space-x-2"
          >
            <X size={16} />
            <span>Cancel</span>
          </Button>
        </div>

        {/* Title */}
        <Input
          label="Title"
          placeholder="Enter note title"
          {...register('title', {
            required: 'Title is required',
            minLength: {
              value: 3,
              message: 'Title must be at least 3 characters'
            },
            maxLength: {
              value: 100,
              message: 'Title must be less than 100 characters'
            }
          })}
          error={errors.title?.message}
          required
        />

        {/* Content */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Content
            <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            placeholder="Write your note content here... (Markdown supported)"
            rows={12}
            className={`
              w-full px-3 py-2 border rounded-lg transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              resize-vertical
              ${errors.content 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-600'
              }
              dark:bg-gray-800 dark:text-gray-100
            `}
            {...register('content', {
              required: 'Content is required',
              minLength: {
                value: 10,
                message: 'Content must be at least 10 characters'
              }
            })}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.content.message}
            </p>
          )}
          
          {/* Character count */}
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {content?.length || 0} characters
          </div>
        </div>

        {/* Tags removed */}

        {/* Preview removed */}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            loading={isSaving}
            disabled={isSaving}
            className="flex items-center space-x-2"
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : (note ? 'Update Note' : 'Create Note')}</span>
          </Button>
        </div>
      </form>
    </div>
    </FocusTrap>
  );
};

export default NoteForm;
