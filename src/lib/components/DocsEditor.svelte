<script>
  import { onMount, onDestroy } from "svelte";
  import InsertTable from "$lib/components/InsertTable.svelte";
  import { Editor } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import TaskItem from "@tiptap/extension-task-item";
  import TaskList from "@tiptap/extension-task-list";
  import Table from "@tiptap/extension-table";
  import TableCell from "@tiptap/extension-table-cell";
  import TableHeader from "@tiptap/extension-table-header";
  import TableRow from "@tiptap/extension-table-row";
  import Image from "@tiptap/extension-image";
  import CharacterCount from "@tiptap/extension-character-count";
  import ImageResize from "tiptap-extension-resize-image";
  import CodeBlock from "@tiptap/extension-code-block";
  import Blockquote from "@tiptap/extension-blockquote";
  import Bold from "@tiptap/extension-bold";
  import Code from "@tiptap/extension-code";
  import Highlight from "@tiptap/extension-highlight";
  import Subscript from "@tiptap/extension-subscript";
  import Superscript from "@tiptap/extension-superscript";
  import TextStyle from "@tiptap/extension-text-style";
  import { Color } from "@tiptap/extension-color";
  import Underline from "@tiptap/extension-underline";

  let element;
  let editor;

  let currentFontFamily = "";
  let currentFontSize = "12px";

  $: displayFontSize = currentFontSize.replace("px", "");

  function handleInsertTable(event) {
    const { rows, cols } = event.detail;
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .run();
  }

  function updateSelectionFormat() {
    if (!editor) return;

    const marks = editor.getAttributes("textStyle");

    if (marks.fontFamily) {
      currentFontFamily = marks.fontFamily;
    }

    if (marks.fontSize) {
      currentFontSize = marks.fontSize;
    }
  }

  onMount(() => {
    const CustomTextStyle = TextStyle.extend({
      addAttributes() {
        return {
          ...this.parent?.(),
          fontFamily: {
            default: null,
            parseHTML: (element) => element.style.fontFamily || null,
            renderHTML: (attributes) => {
              if (!attributes.fontFamily) return {};
              return {
                style: `font-family: ${attributes.fontFamily}`,
              };
            },
          },
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        };
      },

      addCommands() {
        return {
          ...this.parent?.(),
          setFontFamily:
            (fontFamily) =>
            ({ chain }) => {
              return chain().setMark("textStyle", { fontFamily }).run();
            },
          setFontSize:
            (fontSize) =>
            ({ chain }) => {
              return chain().setMark("textStyle", { fontSize }).run();
            },
        };
      },
    });

    editor = new Editor({
      element: element,
      editorProps: {
        attributes: {
          class: "element",
          style: "padding: 20px 56px",
        },
      },
      extensions: [
        StarterKit,
        Blockquote,
        Bold,
        Subscript,
        Superscript,
        Color,
        CustomTextStyle,
        Highlight.configure({ multicolor: true }),
        TaskItem.configure({
          nested: true,
        }),
        TaskList,
        CodeBlock,
        Code,
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
        Image,
        ImageResize,
        CharacterCount.configure({
          wordCounter: (text) =>
            text.split(/\s+/).filter((word) => word !== "").length,
        }),
        Underline,
      ],
      content: ``,
      onTransaction: () => {
        editor = editor;
        updateSelectionFormat();
      },
      onSelectionUpdate: () => {
        updateSelectionFormat();
      },
      onFocus: () => {
        updateSelectionFormat();
      },
    });

    // Set initial font size and family
    editor.commands.setFontSize("12px");
    editor.commands.setFontFamily("Readex Pro");
    currentFontFamily = "Readex Pro";
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });

  // Font size input
  function handleFontSizeInput(e) {
    let size = parseInt(e.target.value);
    if (isNaN(size) || size < 1) return;

    // Minimum font size
    size = Math.max(size, 4);
    const sizeWithUnit = `${size}px`;

    currentFontSize = sizeWithUnit;

    if (editor) {
      editor.chain().focus().setFontSize(sizeWithUnit).run();
    }
  }

  // Font size adjustment
  function handleFontSizeAdjust(change) {
    if (!editor) return;

    let size = parseInt(currentFontSize);
    if (isNaN(size)) size = 16;

    size = Math.max(size + change, 4);
    const newSize = `${size}px`;

    currentFontSize = newSize;

    editor.chain().focus().setFontSize(newSize).run();
  }
</script>

<div class="editor-wrapper">
  <div class="editor-tools-wrapper">
    <div class="editor-tools-info">
      <button>File</button>
      {#if editor?.storage?.characterCount}
        <div class="character-counter">
          <p>{editor.storage.characterCount.characters()} characters</p>
          <p>{editor.storage.characterCount.words()} words</p>
        </div>
      {/if}
    </div>
    <div class="editor-tools">
      <div class="tools">
        {#if editor}
          <!-- Font Family and Font Size Controls -->
          <div class="tooltip-container">
            <label for="font-select" class="sr-only">Font Family</label>
            <select
              id="font-select"
              aria-label="Font Family"
              on:change={(e) => {
                editor.chain().focus().setFontFamily(e.target.value).run();
                currentFontFamily = e.target.value;
              }}
              value={currentFontFamily}
            >
              <option value="Arial" style="font-family: Arial">Arial</option>
              <option value="Inter" style="font-family: Inter">Inter</option>
              <option value="Roboto" style="font-family: Roboto">Roboto</option>
              <option value="Open Sans" style="font-family: Open Sans"
                >Open Sans</option
              >
              <option
                value="Playfair Display"
                style="font-family: Playfair Display">Playfair Display</option
              >
              <option value="Work Sans" style="font-family: Work Sans"
                >Work Sans</option
              >
              <option value="Merriweather" style="font-family: Merriweather"
                >Merriweather</option
              >
              <option
                value="Times New Roman"
                style="font-family: Times New Roman">Times New Roman</option
              >
              <option value="Georgia" style="font-family: Georgia"
                >Georgia</option
              >
              <option value="Readex Pro" style="font-family: Readex Pro"
                >Readex Pro</option
              >
            </select>
            <div class="tooltip">Font</div>
          </div>

          <div class="tooltip-container" style="margin-right: -4px">
            <button
              aria-label="Decrease Font Size"
              on:click={() => handleFontSizeAdjust(-2)}
            >
              <i class="fi fi-br-minus-small"></i>
            </button>
            <div class="tooltip">Decrease Font Size</div>
          </div>

          <div class="tooltip-container">
            <input
              type="text"
              id="font-size-input"
              aria-label="Font Size"
              value={displayFontSize}
              on:blur={handleFontSizeInput}
              on:keydown={(e) => e.key === "Enter" && handleFontSizeInput(e)}
            />
            <div class="tooltip">Font Size</div>
          </div>

          <div class="tooltip-container" style="margin-left: -6px;">
            <button
              aria-label="Increase Font Size"
              on:click={() => handleFontSizeAdjust(2)}
            >
              <i class="fi fi-br-plus-small"></i>
            </button>
            <div class="tooltip">Increase Font Size</div>
          </div>

          <div class="tooltip-container">
            <button
              on:click={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()}
              class:active={editor.isActive("heading", { level: 1 })}
              aria-label="Heading 1"
            >
              H1
            </button>
            <div class="tooltip">Heading 1</div>
          </div>
          <div class="tooltip-container">
            <button
              on:click={() => editor.chain().focus().toggleBulletList().run()}
              class:active={editor.isActive("bulletList")}
              aria-label="Bullet List"
            >
              <i class="fa-solid fa-list-ul"></i>
            </button>
            <div class="tooltip">Bullet List</div>
          </div>
          <div class="tooltip-container">
            <button
              on:click={() => editor.chain().focus().toggleTaskList().run()}
              class:active={editor.isActive("taskList")}
              aria-label="Task List"
            >
              <i class="fa-solid fa-list-check"></i>
            </button>
            <div class="tooltip">Task List</div>
          </div>
          <div class="tooltip-container">
            <button
              on:click={() => editor.chain().focus().toggleOrderedList().run()}
              class:active={editor.isActive("orderedList")}
              aria-label="Numbered List"
            >
              <i class="fa-solid fa-list-ol"></i>
            </button>
            <div class="tooltip">Numbered List</div>
          </div>
          <div class="tooltip-container">
            <button
              on:click={() => editor.chain().focus().toggleBold().run()}
              class:active={editor.isActive("bold")}
              aria-label="Bold"
            >
              <i class="fa-solid fa-bold"></i>
            </button>
            <div class="tooltip">Bold</div>
          </div>
          <div class="tooltip-container">
            <button
              on:click={() => editor.chain().focus().toggleUnderline().run()}
              class:active={editor.isActive("underline")}
              aria-label="Underline"
            >
              <i class="fa-solid fa-underline"></i>
            </button>
            <div class="tooltip">Underline</div>
          </div>
          <div class="tooltip-container">
            <button
              on:click={() => editor.chain().focus().toggleBlockquote().run()}
              class:active={editor.isActive("blockquote")}
              aria-label="Blockquote"
            >
              <i class="fa-solid fa-quote-right"></i>
            </button>
            <div class="tooltip">Blockquote</div>
          </div>
          <div class="tooltip-container">
            <button
              on:click={() => editor.chain().focus().toggleCode().run()}
              class:active={editor.isActive("code")}
              aria-label="Inline Code"
            >
              <i class="fa-solid fa-code"></i>
            </button>
            <div class="tooltip">Inline Code</div>
          </div>
          <div class="tooltip-container">
            <button
              on:click={() => editor.chain().focus().toggleCodeBlock().run()}
              class:active={editor.isActive("codeBlock")}
              aria-label="Code Block"
            >
              <i class="fa-solid fa-file-code"></i>
            </button>
            <div class="tooltip">Code Block</div>
          </div>
          <div class="tooltip-container">
            <button
              on:click={() => editor.chain().focus().toggleSubscript().run()}
              class:active={editor.isActive("subscript")}
              aria-label="Subscript"
            >
              <i class="fa-solid fa-subscript"></i>
            </button>
            <div class="tooltip">Subscript</div>
          </div>
          <div class="tooltip-container">
            <button
              on:click={() => editor.chain().focus().toggleSuperscript().run()}
              class:active={editor.isActive("superscript")}
              aria-label="Superscript"
            >
              <i class="fa-solid fa-superscript"></i>
            </button>
            <div class="tooltip">Superscript</div>
          </div>
          <div class="tooltip-container">
            <button
              on:click={() => editor.chain().focus().toggleHighlight().run()}
              class:active={editor.isActive("highlight")}
              aria-label="Highlight"
            >
              <i class="fa-solid fa-highlighter"></i>
            </button>
            <div class="tooltip">Highlight</div>
          </div>

          <div class="tooltip-container">
            <InsertTable
              on:insertTable={handleInsertTable}
              maxRows={10}
              maxCols={10}
            />
            <div class="tooltip">Insert Table</div>
          </div>

          <div class="tooltip-container">
            <button
              on:click={() =>
                editor
                  .chain()
                  .focus()
                  .setImage({ src: "https://placehold.co/100x100" })
                  .run()}
              aria-label="Insert Image"
            >
              <i class="fa-solid fa-image"></i>
            </button>
            <div class="tooltip">Image</div>
          </div>
          <div class="tooltip-container">
            <label for="text-color-picker" class="sr-only">Text Color</label>
            <input
              type="color"
              id="text-color-picker"
              on:change={(e) =>
                editor.chain().focus().setColor(e.target.value).run()}
              value="#000000"
              aria-label="Text Color"
            />
            <div class="tooltip">Text Color</div>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <div class="scroll-wrapper">
    <div class="docseditor-container">
      <div bind:this={element} class="editor"></div>
    </div>
  </div>
</div>
