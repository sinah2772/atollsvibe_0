# Supabase Articles Table Analysis

## Table Overview
The `articles` table in your Supabase database stores news articles, blog posts, and other content with comprehensive metadata. It has a rich schema with many fields to support various content publishing needs. Based on our analysis, the database currently has 3 articles in the table.

## Table Structure

### Primary Key and Basic Fields
- `id`: String (UUID format) - Primary key
- `title`: String - The main title of the article
- `heading`: String - Possibly a heading used in the article page
- `social_heading`: String (nullable) - Alternative heading for social media
- `status`: String - Article status (e.g., 'published', 'draft') 
- `created_at`: String (timestamp) - When the article was created
- `updated_at`: String (timestamp) - When the article was last updated
- `publish_date`: String (timestamp, nullable) - When the article was/will be published

### Content Fields
- `content`: JSON object - Stores the article content in a structured format (appears to be using a rich text editor format)
- `cover_image`: String (nullable) - URL to the cover image
- `image_caption`: String (nullable) - Caption for the cover image

### Statistical Fields
- `views`: Number - Number of article views
- `likes`: Number - Number of likes/reactions
- `comments`: Number - Number of comments
- `news_priority`: Number (nullable) - Priority ranking for news articles

### Metadata and Flag Fields
- `is_breaking`: Boolean - Whether the article is breaking news
- `is_featured`: Boolean - Whether the article is featured
- `is_developing`: Boolean - Whether the article is a developing story
- `is_exclusive`: Boolean - Whether the article is exclusive content
- `is_sponsored`: Boolean - Whether the article is sponsored content
- `sponsored_by`: String (nullable) - Name of the sponsor
- `sponsored_url`: String (nullable) - URL related to the sponsor
- `news_type`: String (nullable) - Type of news article
- `news_source`: String (nullable) - Source of the news
- `meta_title`: String (nullable) - SEO title
- `meta_description`: String (nullable) - SEO description
- `meta_keywords`: String[] (nullable) - SEO keywords
- `tags`: String[] (nullable) - Article tags

### Editorial Workflow Fields
- `author_notes`: String (nullable) - Notes from the author
- `editor_notes`: String (nullable) - Notes from editors
- `fact_checked`: Boolean (nullable) - Whether the article has been fact-checked
- `fact_checker_id`: String (nullable) - ID of the fact checker
- `fact_checked_at`: String (timestamp, nullable) - When the article was fact-checked
- `approved_by_id`: String (nullable) - ID of the approver
- `approved_at`: String (timestamp, nullable) - When the article was approved
- `published_by_id`: String (nullable) - ID of the publisher
- `last_updated_by_id`: String (nullable) - ID of the last person to update the article

### Translation Fields
- `original_source_url`: String (nullable) - URL to the original source
- `translation_source_url`: String (nullable) - URL to the translation source
- `translation_source_lang`: String (nullable) - Language of the translation source
- `translation_notes`: String (nullable) - Notes about the translation

### System Fields
- `revision_history`: JSON (nullable) - History of revisions
- `scheduled_notifications`: JSON (nullable) - Scheduled notifications
- `notification_sent`: Boolean (nullable) - Whether notifications have been sent
- `notification_sent_at`: String (timestamp, nullable) - When notifications were sent

## Relationships

### Direct Foreign Key Relationships (One-to-Many)
- `category_id`: Number - References `categories` table
- `subcategory_id`: Number (nullable) - References `subcategories` table
- `user_id`: String - References `users` table (author/creator)

### Array Relationships (Many-to-Many)
- `atoll_ids`: Number[] - Array of IDs referencing `atolls` table
- `island_ids`: Number[] (can be empty) - Array of IDs referencing `islands` table
- `government_ids`: String[] (can be empty) - Array of IDs referencing `government` table
- `related_articles`: String[] (can be empty) - Array of IDs referencing other articles

## Sample Data
- Articles primarily belong to the "ސިޔާސީ" (Politics) category
- Some articles have subcategories like "ސަރުކާރު" (Government Affairs) or "އިންތިޚާބު" (Elections)
- Articles can be linked to multiple atolls, such as "ނޫނު އަތޮޅު" (Noon Atoll), "އައްޑޫ ސިޓީ" (Addu City)
- The table uses Row Level Security (based on migration files)

## Current Status
- 3 articles in database with status distribution: { published: 2, draft: 1 }
- Most optional fields are not being actively used (null values)
- Content is stored in a structured JSON format that appears to support text and images

## Recommendations
1. Consider creating proper indexes on frequently queried fields like `status`, `category_id`, and `is_featured`
2. If using PostgreSQL arrays for many-to-many relationships, consider creating GIN indexes for `atoll_ids`, `island_ids`, etc.
3. Ensure proper validation for required fields in the application layer
4. Consider implementing a versioning system for content if not already present
5. Use proper timestamp handling for date fields to ensure consistency
6. Review Row Level Security policies to ensure proper access control
