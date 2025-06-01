# Testing EditorJS Tweet Embed Integration

## Test Cases for Tweet Embed Functionality

### 1. Basic Twitter URLs to Test

Try embedding these Twitter URLs in your EditorJS component:

```text
https://twitter.com/twitter/status/20
https://twitter.com/elonmusk/status/1234567890123456789
https://twitter.com/openai/status/1234567890
https://twitter.com/vercel/status/1234567890
```

### 2. Testing Steps

1. **Navigate to New Article Page**
   - Go to `/new-article` in your application
   - You should see the enhanced EditorJS component instead of a simple textarea

2. **Add Tweet Embed**
   - Click the "+" button to add a new block
   - Select "Embed" from the tools menu
   - Paste a Twitter URL
   - The embed should automatically detect it as a Twitter URL and create a tweet embed

3. **Verify Tweet Rendering**
   - The tweet should render with proper Twitter styling
   - Interactive elements should work (like expanding media)
   - The embed should be responsive

### 3. Expected Behavior

**When you paste a Twitter URL:**

- EditorJS should recognize it as a Twitter embed
- The regex pattern should match the URL format
- The embed block should be created with proper Twitter embed code
- Twitter's widget script should load automatically

**Data Structure Created:**

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

### 4. Troubleshooting

If embeds don't work:

1. **Check Browser Console**
   - Look for JavaScript errors
   - Verify Twitter's widget script loads properly

2. **Verify URL Format**
   - Ensure URLs match the regex pattern: `/^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)$/`
   - Try both old and new Twitter URL formats

3. **Network Issues**
   - Ensure internet connection for loading external scripts
   - Check if Twitter's domain is accessible

### 5. Additional Features to Test

**Other Embed Services:**

- YouTube: `https://www.youtube.com/watch?v=VIDEO_ID`
- Instagram: `https://www.instagram.com/p/POST_ID/`
- CodePen: `https://codepen.io/username/pen/PEN_ID`

**EditorJS Core Features:**

- Headers (H1-H6)
- Paragraphs with inline formatting
- Lists (ordered/unordered)
- Image uploads with Supabase
- Quotes with attribution
- Tables
- Link tool

### 6. Collaborative Features

Test that the collaborative editing still works with embeds:

- Multiple users editing the same article
- Real-time updates for embedded content
- Field locking during embed insertion

### 7. Save and Validation

Verify that articles with embedded tweets:

- Save correctly as drafts
- Publish successfully
- Send to review properly
- Maintain embed data integrity

## Success Criteria

✅ **Tweet URLs are recognized and embedded automatically**
✅ **Embeds render with proper Twitter styling**
✅ **Interactive features work (expand media, etc.)**
✅ **Article save/publish functions work with embedded content**
✅ **Collaborative editing works with embeds**
✅ **Validation accepts articles with embedded content**
✅ **Mobile responsiveness is maintained**

## Next Steps After Testing

1. **Performance Optimization**
   - Consider lazy loading for embeds
   - Implement embed caching if needed

2. **UI/UX Improvements**
   - Add embed preview in the editor
   - Implement embed settings/configuration

3. **Additional Social Platforms**
   - TikTok embeds
   - LinkedIn posts
   - Reddit posts

4. **Analytics Integration**
   - Track embed usage
   - Monitor embed performance

5. **SEO Optimization**
   - Ensure proper meta tags for embedded content
   - Implement structured data for embeds
