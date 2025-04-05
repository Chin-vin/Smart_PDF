import React from 'react';
import {
  AlignCenter, AlignJustify, AlignLeft, AlignRight, BoldIcon, Heading1Icon,
  Heading2Icon, Heading3Icon, Highlighter, Italic, Sparkle, Underline
} from 'lucide-react';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { chatSession } from '@/app/configs/AiModel';
import { toast } from 'sonner';

function EditorExtensions({ editor, fileId }) {
  if (!editor || !fileId) return null;

  const searchAi = useAction(api.myAction.search);

  const onAiClick = async () => {
    toast("AI is generating your answer...");

    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      ' '
    );

    console.log("Selected Question:", selectedText);

    const result = await searchAi({ query: selectedText, fileId });
    console.log("API Response:", result);

    const UnformattedAns = JSON.parse(result);
    console.log("Extracted Answer:", UnformattedAns);

    const PROMPT = `
      For question: ${selectedText}, analyze and extract the most relevant answer from the given content.
      Format it properly using HTML elements.
      Answer Content: ${UnformattedAns}
    `;

    const AiModelResult = await chatSession.sendMessage(PROMPT);
    const finalAns = AiModelResult.response.text().replace('```html', '').replace('```', '');

    console.log("Final AI Answer:", finalAns);

    // Append answer to existing content
    const allText = editor.getHTML();
    editor.commands.setContent(allText + `<p><strong>Answer:</strong> ${finalAns}</p>`);

    // Save content specific to the PDF file
    localStorage.setItem(`editorContent-${fileId}`, editor.getHTML());
  };

  return (
    <div className="p-5 flex gap-4">
      <div className="control-group">
        <div className="button-group">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'text-blue-500 font-bold' : ''}>
            <BoldIcon />
          </button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'text-blue-500 font-bold' : ''}>
            <Italic />
          </button>
          <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'text-blue-500 font-bold' : ''}>
            <Underline />
          </button> 
          <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'text-blue-500 font-bold' : ''}>
            <Highlighter />
          </button> 
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'text-blue-500 font-bold' : ''}>
            <Heading1Icon />
          </button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'text-blue-500 font-bold' : ''}>
            <Heading2Icon />
          </button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'text-blue-500 font-bold' : ''}>
            <Heading3Icon />
          </button>
          <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'text-blue-500 font-bold' : ''}>
            <AlignLeft />
          </button>
          <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'text-blue-500 font-bold' : ''}>
            <AlignCenter />
          </button>
          <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'text-blue-500 font-bold' : ''}>
            <AlignRight />
          </button>
          <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={editor.isActive({ textAlign: 'justify' }) ? 'text-blue-500 font-bold' : ''}>
            <AlignJustify />
          </button>
          <button onClick={onAiClick} className="hover:text-blue-500">
            <Sparkle />
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditorExtensions;
