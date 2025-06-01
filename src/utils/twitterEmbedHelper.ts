// Twitter Widget Helper
// This utility helps initialize Twitter embeds in EditorJS

declare global {
  interface Window {
    twttr: {
      widgets: {
        load: (element?: HTMLElement) => void;
      };
    };
  }
}

export const initializeTwitterWidgets = () => {
  // Load Twitter widgets script if not already loaded
  if (!window.twttr) {
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.charset = 'utf-8';
    document.head.appendChild(script);
    
    script.onload = () => {
      if (window.twttr && window.twttr.widgets) {
        window.twttr.widgets.load();
      }
    };
  } else {
    // If already loaded, just refresh the widgets
    window.twttr.widgets.load();
  }
};

export const refreshTwitterWidget = (element: HTMLElement) => {
  if (window.twttr && window.twttr.widgets) {
    window.twttr.widgets.load(element);
  }
};

// CSS for better tweet embed styling
export const twitterEmbedStyles = `
  .twitter-tweet {
    margin: 20px auto !important;
    max-width: 550px !important;
  }
  
  .ce-block__content .twitter-tweet {
    margin-left: auto !important;
    margin-right: auto !important;
  }
  
  /* Dark mode support for tweets */
  @media (prefers-color-scheme: dark) {
    .twitter-tweet {
      color-scheme: dark;
    }
  }
  
  /* Responsive design for mobile */
  @media (max-width: 768px) {
    .twitter-tweet {
      max-width: 100% !important;
      margin: 15px 0 !important;
    }
  }
`;

// Inject styles into the document
export const injectTwitterStyles = () => {
  const styleId = 'twitter-embed-styles';
  
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = twitterEmbedStyles;
    document.head.appendChild(style);
  }
};
