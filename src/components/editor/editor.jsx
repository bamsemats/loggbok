// src/Tiptap.tsx
import './editor.css';
import { EditorProvider, FloatingMenu, BubbleMenu, useCurrentEditor } from '@tiptap/react';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useEffect, useRef, useState } from 'react';
import { BiBold, BiCodeAlt, BiRedo, BiStrikethrough, BiUndo } from "react-icons/bi";
import { BiItalic } from "react-icons/bi";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { AiOutlineOrderedList } from "react-icons/ai";
import { BiCodeBlock } from "react-icons/bi";
import DOMPurify from 'dompurify';
import { BsBlockquoteRight } from 'react-icons/bs';
import { GoHorizontalRule } from 'react-icons/go';
import { VscNewline } from 'react-icons/vsc';
import { LuChevronDown, LuHeading1, LuHeading2, LuHeading3, LuHeading4, LuHeading5, LuHeading6, LuImage, LuPalette, LuSquare } from 'react-icons/lu';

// define your extension array
const extensions = [
  Image,
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
]

const content = '<p>Hey! Write something cool..!</p>'

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
    const { editor } = useCurrentEditor();
    const [currentHeading, setCurrentHeading] = useState('');
    const [headingDropDownShown, setHeadingDropDownShown] = useState(false);
    const [colorDropDownShown, setColorDropDownShown] = useState(false);
    const headingDropDownRef = useRef(null);
    const headingDropDownButtonRef = useRef(null);
    const colorDropDownRef = useRef(null);
    const colorDropDownButtonRef = useRef(null);

    const activeHeading = editor.isActive('heading', {level: 2}) ? 'H2' : editor.isActive('heading', {level: 3}) ? 'H3' : editor.isActive('heading', {level: 4}) ? 'H4' : editor.isActive('heading', {level: 5}) ? 'H5' : editor.isActive('heading', {level: 6}) ? 'H6' : 'H1';

    const colorList = [
      "#000000", // Pure Black
      "#111111", // Jet Black
      "#212121", // Charcoal
      "#2E2E2E", // Dark Slate Gray
      "#4F4F4F", // Dim Gray
      "#6E6E6E", // Gray
      "#708090", // Slate Gray
      "#A0A0A0", // Light Gray
      "#DCDCDC", // Gainsboro
      "#F5F5F5", // White Smoke
      "#FFFFFF", // Pure White
      "#0d6efd", // Blue (Link)
      "#6f42c1", // Blue (Visited)
      "#1E90FF", // Dodger Blue
      "#4169E1", // Royal Blue
      "#DC143C", // Crimson
      "#B22222", // Firebrick
      "#228B22", // Forest Green
      "#DAA520", // Goldenrod
      "#FF1493"  // Deep Pink
    ]

    const ColorElement = () => {
      colorList.map(color => {
        return (
          <button
            onClick={() => editor.chain().focus().setColor(color).run()}
            className={editor.isActive('textStyle', { color: color }) ? 'is-active' : ''}
          >
            <LuSquare style={{color: color, fill: color}}/>
          </button>
        )
      })
    }

    // <button
    //             onClick={() => editor.chain().focus().setColor('#958DF1').run()}
    //             className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
    //           >
    //             <LuSquare style={{color: '#958DF1', fill: '#958DF1'}}/>
    //           </button>

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
      function handleClickOutsideHeading(event) {
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
  
      document.addEventListener('mousedown', handleClickOutsideHeading);
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutsideHeading);
      };
    }, []);

    function handleClickColorDropdown(event) {
      event.stopPropagation(); // Prevent the click from propagating to the document
      setColorDropDownShown((prevState) => {
        const dropDownMenu = document.querySelector('.color-dropdown-menu');
        if (!prevState) {
          dropDownMenu.classList.add('color-show'); // Open the menu
        } else {
          dropDownMenu.classList.remove('color-show'); // Close the menu
        }
        return !prevState; // Toggle the state
      });
    }

    useEffect(() => {
      function handleClickOutsidecolor(event) {
        if (
          colorDropDownRef.current &&
          !colorDropDownRef.current.contains(event.target) &&
          colorDropDownButtonRef.current &&
          !colorDropDownButtonRef.current.contains(event.target)
        ) {
          colorDropDownRef.current.classList.remove('color-show');
          setColorDropDownShown(false);
        }
      }
  
      document.addEventListener('mousedown', handleClickOutsidecolor);
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutsidecolor);
      };
    }, []);

    const getCurrentTextColor = () => {
      const attributes = editor.getAttributes('textStyle');
      return attributes.color || 'default';
    }

    const currentColor = getCurrentTextColor();

    const addImage = () => {
      const url = window.prompt('URL')

      if (url) {
        editor.chain().focus().setImage({ src: url }).run()
      }
    }

    console.log(currentColor)

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
          <button onClick={addImage}>
            <LuImage />
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
                <LuHeading1 />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
              >
                <LuHeading2 />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
              >
                <LuHeading3 />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
              >
                <LuHeading4 />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
              >
                <LuHeading5 />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
              >
                <LuHeading6 />
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
          <div className='color-dropdown-menu-div'>
            <button 
              className='color-dropdown-menu-button'
              onClick={handleClickColorDropdown}
            >
              <LuPalette style={{color: currentColor}}/>
            </button>
            <div className='color-dropdown-menu'>
              {
                colorList.map(color => {
                  return (
                    <button
                      onClick={() => editor.chain().focus().setColor(color).run()}
                      className={editor.isActive('textStyle', { color: color }) ? 'is-active' : ''}
                    >
                      <LuSquare style={{color: color, fill: color}}/>
                    </button>
                  )
                })
              }
            </div>
          </div>
          
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