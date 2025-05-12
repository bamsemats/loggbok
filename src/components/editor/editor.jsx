// src/Tiptap.tsx
import './editor.css';
import { EditorProvider, FloatingMenu, BubbleMenu, useCurrentEditor } from '@tiptap/react';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect, useRef } from 'react';
import {useState} from 'react';
import { BiBold, BiCodeAlt, BiRedo, BiStrikethrough, BiUndo } from "react-icons/bi";
import { BiItalic } from "react-icons/bi";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { AiOutlineOrderedList } from "react-icons/ai";
import { BiCodeBlock } from "react-icons/bi";
import DOMPurify from 'dompurify';
import { BsBlockquoteRight } from 'react-icons/bs';
import { GoHorizontalRule } from 'react-icons/go';
import { VscNewline } from 'react-icons/vsc';
import { LuChevronDown, LuHeading1, LuHeading2, LuHeading3, LuHeading4, LuHeading5, LuHeading6 } from 'react-icons/lu';

// define your extension array
const extensions = [StarterKit]

const content = '<p>Hello World!</p>'

const Tiptap = () => {

  const [posts, setPosts] = useState([]);

  const submittedPosts = () => {
    posts.map((item) => {
      return (
        <div className='post'>
          {item.content}
        </div>
      )
    })
  }

  function handleSubmitPost() {
    const currentTextBody = document.querySelector('.tiptap');
    console.log(currentTextBody.innerHTML);
    setPosts(prev => [
      ...prev,
      currentTextBody.innerHTML
    ])
  }

  const MenuBar = () => {
    const { editor } = useCurrentEditor()
    
    const [currentHeading, setCurrentHeading] = useState('');
    const [headingDropDownShown, setHeadingDropDownShown] = useState(false);
    const headingDropDownRef = useRef(null);
    const headingDropDownButtonRef = useRef(null);

    const activeHeading = editor.isActive('heading', {level: 2}) ? 'H2' : editor.isActive('heading', {level: 3}) ? 'H3' : editor.isActive('heading', {level: 4}) ? 'H4' : editor.isActive('heading', {level: 5}) ? 'H5' : editor.isActive('heading', {level: 6}) ? 'H6' : 'H1';

    console.log(document.querySelector('.heading-dropdown-menu'));

    useEffect(() => {
      setCurrentHeading((prev) => ({
        H1: <LuHeading1 />,
        H2: <LuHeading2 />,
        H3: <LuHeading3 />,
        H4: <LuHeading4 />,
        H5: <LuHeading5 />,
        H6: <LuHeading6 />,
      }))
    }, [])

    function handleClickHeadingDropdown(event) {
      event.stopPropagation(); // Prevent the click from propagating to the document
      setHeadingDropDownShown((prevState) => {
        const dropDownMenu = document.querySelector('.heading-dropdown-menu');
        if (!prevState) {
          dropDownMenu.classList.add('heading-show'); // Open the menu
        } else {
          dropDownMenu.classList.remove('heading-show'); // Close the menu
        }
        return !prevState; // Toggle the state
      });
    }

    useEffect(() => {
      function handleClickOutside(event) {
        if (
          headingDropDownRef.current &&
          !headingDropDownRef.current.contains(event.target) &&
          headingDropDownButtonRef.current &&
          !headingDropDownButtonRef.current.contains(event.target)
        ) {
          headingDropDownRef.current.classList.remove('heading-show');
          setHeadingDropDownShown(false);
        }
      }
  
      document.addEventListener('mousedown', handleClickOutside);
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    if (!editor) {
      return null
    }
  
    return (
      <div className="control-group">
        <div className="button-group">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleBold()
                .run()
            }
            className={editor.isActive('bold') ? 'is-active' : ''}
          >
            <BiBold />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleItalic()
                .run()
            }
            className={editor.isActive('italic') ? 'is-active' : ''}
          >
            <BiItalic />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleStrike()
                .run()
            }
            className={editor.isActive('strike') ? 'is-active' : ''}
          >
            <BiStrikethrough />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleCode()
                .run()
            }
            className={editor.isActive('code') ? 'is-active' : ''}
          >
            <BiCodeAlt />
          </button>
          {/* <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
            Clear marks
          </button>
          <button onClick={() => editor.chain().focus().clearNodes().run()}>
            Clear nodes
          </button> */}
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={editor.isActive('paragraph') ? 'is-active' : ''}
          >
            Paragraph
          </button>
          <div className='heading-dropdown-menu-div'>
            <button 
              ref={headingDropDownButtonRef}
              className='heading-dropdown-menu-button'
              onClick={handleClickHeadingDropdown}
            >
              {currentHeading[activeHeading]} <LuChevronDown className='chevron-down' style={{transform: headingDropDownShown ? 'scale(-1, -1)' : ''}}/>
            </button>
            <div 
              className='heading-dropdown-menu'
              ref={headingDropDownRef}
            >
              <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
              >
                H1
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
              >
                H2
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
              >
                H3
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
              >
                H4
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
              >
                H5
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
              >
                H6
              </button>
            </div>
          </div>
          
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'is-active' : ''}
          >
            <AiOutlineUnorderedList />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'is-active' : ''}
          >
            <AiOutlineOrderedList />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive('codeBlock') ? 'is-active' : ''}
          >
            <BiCodeBlock />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'is-active' : ''}
          >
            <BsBlockquoteRight />
          </button>
          <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <GoHorizontalRule />
          </button>
          <button onClick={() => editor.chain().focus().setHardBreak().run()}>
          <VscNewline />
          </button>
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .undo()
                .run()
            }
          >
            <BiUndo />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .redo()
                .run()
            }
          >
            <BiRedo />
          </button>
          <button
            onClick={() => editor.chain().focus().setColor('#958DF1').run()}
            className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
          >
            Purple {`(Not working)`}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='editor-container'>
      <EditorProvider extensions={extensions} content={content} slotBefore={<MenuBar />}>    
      </EditorProvider>
      <button className='submit-button' onClick={handleSubmitPost}>Submit</button>
      <div className='submitted-posts-div'>
        {posts.map((item, index) => (
          <div 
            key={`post-number-${index}`} 
            className='post' 
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item) }} 
          />
        ))}
      </div>
    </div>
  )
}

export default Tiptap


// slotBefore={<MyEditorToolbar />} slotAfter={<MyEditorFooter />}