# EditorJS with Tweet Embed Integration

## Overview

Your EditorJS component now includes Twitter/Tweet embed functionality along with all existing features:

### Available Tools

1. **Header** - Multiple heading levels (H1-H6)
2. **Paragraph** - Rich text with inline formatting
3. **List** - Ordered and unordered lists
4. **Image** - Upload images with Supabase storage integration
5. **Quote** - Block quotes with attribution
6. **Table** - Interactive tables
7. **Link** - Smart link embedding
8. **Embed** - Social media embeds including **Twitter tweets**

## Twitter Embed Usage

### How to embed a tweet

1. **In the Editor:**
   - Click the "+" button to add a new block
   - Select "Embed" from the tools menu
   - Paste any Twitter URL in this format:

     ```text
     https://twitter.com/username/status/1234567890
     ```

2. **Supported Twitter URL formats:**
   - `https://twitter.com/username/status/1234567890`
   - `https://twitter.com/#!/username/status/1234567890`
   - Both old and new Twitter URL formats are supported

3. **The embed will automatically:**
   - Extract the tweet ID
   - Generate proper Twitter embed code
   - Load Twitter's widget script
   - Display the tweet with full formatting, images, and interactivity

### Example Tweet URLs you can test

```text
https://twitter.com/twitter/status/20
https://twitter.com/elonmusk/status/1234567890123456789
```

## Other Embed Services Supported

- **YouTube** - Video embeds
- **Instagram** - Post embeds  
- **Facebook** - Post embeds
- **Vimeo** - Video embeds
- **CodePen** - Code demos
- **Coub** - Short video loops

## Technical Implementation

### EditorJS Configuration

```typescript
embed: {
  class: Embed,
  config: {
    services: {
      twitter: {
        regex: /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)$/,
        embedId: (ids: string[]) => ids[2],
        html: "<blockquote class=\"twitter-tweet\"><a href=\"https://twitter.com/{{username}}/status/{{id}}\"></a></blockquote> <script async src=\"https://platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>",
        height: 300,
        width: 600,
        id: (ids: string[]) => ids[2]
      },
      // ... other services
    }
  }
}
```

### Data Structure

When a tweet is embedded, it creates this data structure:

```json
{
  "type": "embed",
  "data": {
    "service": "twitter",
    "source": "https://twitter.com/username/status/1234567890",
    "embed": "https://twitter.com/username/status/1234567890",
    "width": 600,
    "height": 300,
    "caption": ""
  }
}
```

## Integration with Your Article System

### Content Storage

- Content is now stored as EditorJS OutputData format (JSON)
- The `content` field in your database stores: `{ text: OutputData }`
- All existing validation and save functions have been updated

### Collaborative Features

- Real-time collaborative editing supported
- Field locking for content editing
- Auto-save functionality with EditorJS integration

## Benefits of This Implementation

1. **Rich Content Creation** - Writers can now embed tweets directly in articles
2. **Professional Layout** - Tweets render with full Twitter styling and interactivity
3. **Multiple Media Types** - Support for various social media and content platforms
4. **Responsive Design** - Embeds work across all device sizes
5. **SEO Friendly** - Proper embed code for search engine indexing
6. **User Experience** - No need to manually copy/paste embed codes

## Usage in NewArticle Component

The NewArticle page now uses EditorJSComponent instead of a simple textarea:

```tsx
<EditorJSComponent
  placeholder={language === 'dv' ? 'އާޓިކަލުގެ ތުންތައް ލިޔުއްވާ...' : 'Write your article content...'}
  data={content || undefined}
  onChange={setContent}
  className="min-h-96"
  collaborative={collaborative}
/>
```

## Next Steps

1. Test the tweet embed functionality in your development environment
2. Consider adding more social media platforms if needed
3. Add custom styling for embedded content if desired
4. Monitor performance with large articles containing multiple embeds

## Troubleshooting

- Ensure Twitter URLs are properly formatted
- Check browser console for any JavaScript errors
- Verify internet connection for loading Twitter's widget script
- Test with different tweet URLs to ensure regex matching works correctly
