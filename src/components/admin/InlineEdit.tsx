import React, { useState, useEffect, useRef } from 'react';
import { Edit3, Check, X } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

interface InlineEditProps {
  value: string;
  onSave: (newValue: string) => Promise<boolean | void> | boolean | void;
  multiline?: boolean;
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div';
  label?: string;
  children?: React.ReactNode;
}

export const InlineEdit: React.FC<InlineEditProps> = ({
  value,
  onSave,
  multiline = false,
  className = '',
  as: Component = 'span',
  label,
  children,
}) => {
  const { isAdmin } = useContent();
  const [isEditing, setIsEditing] = useState(false);
  const [currentVal, setCurrentVal] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setCurrentVal(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if ('select' in inputRef.current) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  if (!isAdmin) {
    return <Component className={className}>{children || value}</Component>;
  }

  const handleSave = async (e?: React.MouseEvent | React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (currentVal.trim() === value.trim()) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      await onSave(currentVal);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save inline edit:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentVal(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setCurrentVal(value);
      setIsEditing(false);
    } else if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Enter' && multiline && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  if (isEditing) {
    return (
      <div
        className="relative inline-block w-full my-1 z-30"
        onClick={(e) => e.stopPropagation()}
      >
        {label && (
          <span className="block text-[10px] font-mono text-emerald-400 mb-1">
            Editing {label} (Press Esc to cancel, Enter to save)
          </span>
        )}
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={currentVal}
            onChange={(e) => setCurrentVal(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={Math.min(8, Math.max(2, currentVal.split('\n').length + 1))}
            className="w-full p-2.5 rounded-xl bg-slate-950 border-2 border-emerald-500 text-sm text-white focus:outline-hidden shadow-2xl resize-y"
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={currentVal}
            onChange={(e) => setCurrentVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border-2 border-emerald-500 text-sm text-white focus:outline-hidden shadow-xl"
          />
        )}
        <div className="flex items-center gap-1.5 mt-1.5 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" />
            <span>Cancel</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-2.5 py-1 rounded-md bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
          >
            <Check className="w-3 h-3" />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <Component
      onClick={(e: React.MouseEvent) => {
        // Prevent click if parent is a link unless Alt/click is intended
        e.stopPropagation();
        setIsEditing(true);
      }}
      className={`group/inline relative cursor-pointer rounded-sm hover:outline-dashed hover:outline-1 hover:outline-emerald-400 hover:bg-emerald-500/5 transition-all ${className}`}
      title="Click to edit this content directly"
    >
      {children || value}
      <span
        aria-hidden="true"
        className="opacity-0 group-hover/inline:opacity-100 ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950 border border-emerald-600 text-emerald-300 shadow-xs align-middle"
      >
        <Edit3 className="w-2.5 h-2.5 mr-0.5" />
        Edit
      </span>
    </Component>
  );
};
