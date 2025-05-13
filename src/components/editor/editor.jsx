// src/Tiptap.tsx
import './editor.css';
import { EditorProvider, FloatingMenu, BubbleMenu, useCurrentEditor, useEditor, EditorContent } from '@tiptap/react';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Underline from '@tiptap/extension-underline';
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
import { LuAlignCenter, LuAlignJustify, LuAlignLeft, LuAlignRight, LuBlocks, LuBold, LuChevronDown, LuCodeXml, LuCornerDownLeft, LuHeading1, LuHeading2, LuHeading3, LuHeading4, LuHeading5, LuHeading6, LuHighlighter, LuImage, LuItalic, LuList, LuListOrdered, LuMessageSquareQuote, LuPalette, LuPilcrow, LuQuote, LuRedo2, LuSquare, LuSquareCode, LuStrikethrough, LuSubscript, LuSuperscript, LuTextQuote, LuUnderline, LuUndo2 } from 'react-icons/lu';

// define your extension array
const extensions = [
  Underline,
  Superscript,
  Subscript,
  TextAlign.configure({
      types: ['heading', 'paragraph'],
      defaultAlignment: 'center',
    }),
  Highlight,
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
  })
]

const content = '<p>Hey! Write something cool..!</p>'

const Tiptap = () => {

  const editor = useEditor({
    extensions: [
      Underline,
      Superscript,
      Subscript,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'center',
      }),
      Highlight,
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
      })
    ],
    content: '<p>Hey! Write something cool..!</p>'
  })

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
    setPosts(prev => [
      ...prev,
      currentTextBody.innerHTML
    ])
  }

  useEffect(() => {
  console.log('Editor instance:', editor);
  console.log('Available extensions:', editor?.extensionManager?.extensions);
}, [editor]);

  const MenuBar = () => {
    const { editor } = useCurrentEditor();
    const [currentHeading, setCurrentHeading] = useState('');
    const [headingDropDownShown, setHeadingDropDownShown] = useState(false);
    const [colorDropDownShown, setColorDropDownShown] = useState(false);
    const [alignDropDownShown, setAlignDropDownShown] = useState(false);
    const headingDropDownRef = useRef(null);
    const headingDropDownButtonRef = useRef(null);
    const colorDropDownRef = useRef(null);
    const colorDropDownButtonRef = useRef(null);
    const alignDropDownRef = useRef(null);
    const alignDropDownButtonRef = useRef(null);

    const activeHeading = editor.isActive('heading', {level: 2}) ? 'H2' : editor.isActive('heading', {level: 3}) ? 'H3' : editor.isActive('heading', {level: 4}) ? 'H4' : editor.isActive('heading', {level: 5}) ? 'H5' : editor.isActive('heading', {level: 6}) ? 'H6' : 'H1';

    const colorList = [
      "#000000", // Black (still useful for contrast)
      "#1E90FF", // Dodger Blue
      "#4169E1", // Royal Blue
      "#0d6efd", // Standard Link Blue
      "#4B0082", // Indigo
      "#6f42c1", // Purple (Visited link)
      "#8A2BE2", // Blue Violet
      "#DC143C", // Crimson (Red)
      "#FF4500", // Orange Red
      "#FF6347", // Tomato
      "#FF8C00", // Dark Orange
      "#FFA500", // Orange
      "#DAA520", // Goldenrod (Yellow-ish)
      "#FFD700", // Gold
      "#228B22", // Forest Green
      "#32CD32", // Lime Green
      "#20B2AA", // Light Sea Green
      "#00CED1", // Dark Turquoise
      "#FF1493", // Deep Pink
      "#FF69B4"  // Hot Pink
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

    function handleClickAlignDropdown(event) {
      event.stopPropagation(); // Prevent the click from propagating to the document
      setAlignDropDownShown((prevState) => {
        const dropDownMenu = document.querySelector('.align-dropdown-menu');
        if (!prevState) {
          dropDownMenu.classList.add('align-show'); // Open the menu
        } else {
          dropDownMenu.classList.remove('align-show'); // Close the menu
        }
        return !prevState; // Toggle the state
      });
    }

    useEffect(() => {
      function handleClickOutsidealign(event) {
        if (
          alignDropDownRef.current &&
          !alignDropDownRef.current.contains(event.target) &&
          alignDropDownButtonRef.current &&
          !alignDropDownButtonRef.current.contains(event.target)
        ) {
          alignDropDownRef.current.classList.remove('align-show');
          setAlignDropDownShown(false);
        }
      }
  
      document.addEventListener('mousedown', handleClickOutsidealign);
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutsidealign);
      };
    }, []);

    const currentAlign = editor.isActive({textAlign: 'justify'}) ? <LuAlignJustify /> : editor.isActive({textAlign: 'center'}) ? <LuAlignCenter /> : editor.isActive({textAlign: 'right'}) ? <LuAlignRight /> : <LuAlignLeft />;

    const getCurrentTextColor = () => {
      const attributes = editor.getAttributes('textStyle');
      return attributes.color || 'default';
    }

    const currentColor = getCurrentTextColor();

    const addImage = () => {
      const url = window.prompt('Enter image URL')

      if (url) {
        editor.chain().focus().setImage({ src: url }).run()
      }
    }

    // console.log('Editor schema:', editor.schema);

    if (!editor) {
      return null
    }
  
    return (
      <div className="control-group">
        <div className="button-group">
          <div className='button-section-0'>
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
              data-title='Bold'
            >
              <LuBold />
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
              data-title='Italic'
            >
              <LuItalic />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              disabled={
                !editor.can()
                  .chain()
                  .focus()
                  .toggleUnderline()
                  .run()
              }
              className={editor.isActive('underline') ? 'is-active' : ''}
              data-title='Underline'
            >
              <LuUnderline />
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
              data-title='Strike'
            >
              <LuStrikethrough />
            </button>
            {/* <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
              Clear marks
            </button>
            <button onClick={() => editor.chain().focus().clearNodes().run()}>
              Clear nodes
            </button> */}
            
            
            <button
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              className={editor.isActive('superscript') ? 'is-active' : ''}
              data-title='Superscript'
            >
              <LuSuperscript />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              className={editor.isActive('subscript') ? 'is-active' : ''}
              data-title='Subscript'
            >
              <LuSubscript />
            </button>

          </div>
          <div className='button-section-1'>
            <div className='heading-dropdown-menu-div'>
              <button 
                ref={headingDropDownButtonRef}
                className='heading-dropdown-menu-button'
                onClick={handleClickHeadingDropdown}
                data-title='Heading'
              >
                {currentHeading[activeHeading] || <LuHeading1 />} <LuChevronDown className='chevron-down' style={{transform: headingDropDownShown ? 'scale(-1, -1)' : ''}}/>
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
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={editor.isActive('paragraph') ? 'is-active' : ''}
              data-title='Paragraph'
            >
              <LuPilcrow />
            </button>

          </div>
          <div className='button-section-2'>
            <div className='align-dropdown-menu-div'>
              <button 
                ref={alignDropDownButtonRef}
                className='align-dropdown-menu-button'
                onClick={handleClickAlignDropdown}
                data-title='Text Alignment'
              >
                {currentAlign} <LuChevronDown className='chevron-down' style={{transform: alignDropDownShown ? 'scale(-1, -1)' : ''}}/>
              </button>
            <div 
              className='align-dropdown-menu'
              ref={alignDropDownRef}
            >
              <button
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                  className={editor.isActive({textAlign: 'left'}) ? 'is-active' : ''}
                  data-title='Align Left'
                >
                  <LuAlignLeft />
                </button>
                <button
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                  className={editor.isActive({textAlign: 'center'}) ? 'is-active' : ''}
                  data-title='Align Center'
                >
                  <LuAlignCenter />
                </button>
                <button
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                  className={editor.isActive({textAlign: 'right'}) ? 'is-active' : ''}
                  data-title='Align Right'
                >
                  <LuAlignRight />
                </button>
                <button
                  onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                  className={editor.isActive({textAlign: 'justify'}) ? 'is-active' : ''}
                  data-title='Align Justify'
                >
                  <LuAlignJustify />
                </button>
              </div>
            </div>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive('bulletList') ? 'is-active' : ''}
              data-title='Bullet List'
            >
              <LuList />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive('orderedList') ? 'is-active' : ''}
              data-title='Ordered List'
            >
              <LuListOrdered />
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
              data-title='Code'
            >
              <LuCodeXml />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={editor.isActive('codeBlock') ? 'is-active' : ''}
              data-title='Code Block'
            >
              <LuSquareCode />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={editor.isActive('blockquote') ? 'is-active' : ''}
              data-title='Block Quote'
            >
              <LuTextQuote />
            </button>
            <button onClick={() => editor.chain().focus().setHorizontalRule().run()} data-title='Horizontal Line'>
            <GoHorizontalRule />
            </button>
            <button onClick={() => editor.chain().focus().setHardBreak().run()} data-title='New Line'>
            <LuCornerDownLeft />
            </button>
          </div>
        
          <div className='button-section-3'>
            <button
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={editor.isActive('highlight') ? 'is-active' : ''}
              data-title='Highlight'
            >
              <LuHighlighter />
            </button>
            <div className='color-dropdown-menu-div'>
              <button 
                className='color-dropdown-menu-button'
                onClick={handleClickColorDropdown}
                ref={colorDropDownButtonRef}
                data-title='Text Color'
              >
                <LuPalette style={{color: currentColor}}/> <LuChevronDown className='chevron-down' style={{transform: colorDropDownShown ? 'scale(-1, -1)' : ''}}/>
              </button>
              <div className='color-dropdown-menu' ref={colorDropDownRef}>
                {
                  colorList.map(color => {
                    return (
                      <button
                        onClick={() => editor.chain().focus().setColor(color).run()}
                        className={editor.isActive('textStyle', { color: color }) ? 'is-active' : ''}
                        key={`${color}-button`}
                      >
                        <LuSquare style={{color: color, fill: color}}/>
                      </button>
                    )
                  })
                }
              </div>
            </div>
            <button onClick={addImage} data-title='Add Image'>
              <LuImage />
            </button>
          </div>

          <div className='button-section-4'>
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={
                !editor.can()
                  .chain()
                  .focus()
                  .undo()
                  .run()
              }
              data-title='Undo'
            >
              <LuUndo2 />
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
              data-title='Redo'
            >
              <LuRedo2 />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='editor-container'>
      <EditorProvider editor={editor} extensions={extensions} content={content} slotBefore={<MenuBar />}>    
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