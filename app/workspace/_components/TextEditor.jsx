import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import EditorExtensions from './EditorExtensions';
import { useParams } from 'next/navigation';

function TextEditor() {
  const { fileId } = useParams(); // Get fileId for storing notes per PDF

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Underline,
      Typography,
      TextStyle,
      Color,
      TextAlign,
      Placeholder.configure({
        placeholder: 'Start taking your notes here...',
      }),
    ],
    content: localStorage.getItem(`editorContent-${fileId}`) || "<p><strong>Type something here...</strong></p>",
    editorProps: {
      attributes: {
        class: 'prose max-w-full p-5',
      },
    },
  });

  // Load stored notes when switching PDFs
  useEffect(() => {
    if (editor && fileId) {
      const savedContent = localStorage.getItem(`editorContent-${fileId}`);
      if (savedContent) {
        editor.commands.setContent(savedContent);
      }
    }
  }, [editor, fileId]);

  // Save to localStorage when content changes
  useEffect(() => {
    if (editor && fileId) {
      const saveContent = () => {
        localStorage.setItem(`editorContent-${fileId}`, editor.getHTML());
      };
      editor.on("update", saveContent);
      return () => editor.off("update", saveContent);
    }
  }, [editor, fileId]);

  return (
    <div>
      {editor ? <EditorExtensions editor={editor} fileId={fileId} /> : null}
      <div className='overflow-scroll h-[88vh]'>
        <EditorContent editor={editor} className="prose max-w-full p-5" />
      </div>
    </div>
  );
}

export default TextEditor;
