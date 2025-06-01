declare module '@editorjs/editorjs' {
  interface ToolConstructable {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (config?: any): any;
  }
  
  interface ToolSettings {
    class: ToolConstructable;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config?: any;
    inlineToolbar?: boolean;
    shortcut?: string;
  }
  
  interface EditorConfig {
    holder: string | HTMLElement;
    placeholder?: string;
    tools?: Record<string, ToolSettings>;
    onChange?: () => void;
    i18n?: {
      direction?: 'ltr' | 'rtl';
    };
  }
  
  interface OutputData {
    time: number;
    blocks: Array<{
      id?: string;
      type: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: any;
    }>;
    version: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // Add index signature
  }
  
  export default class EditorJS {
    constructor(config: EditorConfig);
    save(): Promise<OutputData>;
    destroy(): void;
    clear(): void;
  }
}

declare module '@editorjs/header' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Header: any;
  export default Header;
}

declare module '@editorjs/list' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const List: any;
  export default List;
}

declare module '@editorjs/paragraph' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Paragraph: any;
  export default Paragraph;
}

declare module '@editorjs/image' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Image: any;
  export default Image;
}

declare module '@editorjs/quote' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Quote: any;
  export default Quote;
}

declare module '@editorjs/delimiter' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Delimiter: any;
  export default Delimiter;
}

declare module '@editorjs/table' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Table: any;
  export default Table;
}

declare module '@editorjs/code' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Code: any;
  export default Code;
}

declare module '@editorjs/link' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LinkTool: any;
  export default LinkTool;
}

declare module '@editorjs/embed' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Embed: any;
  export default Embed;
}

declare module '@editorjs/simple-image' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SimpleImage: any;
  export default SimpleImage;
}
