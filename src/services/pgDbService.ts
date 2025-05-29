import { query, transaction } from './pgDatabase';
import { Database } from '../lib/supabase-types';

type User = Database['public']['Tables']['users']['Row'];
type Article = Database['public']['Tables']['articles']['Row'];

/**
 * PostgreSQL database service for direct database operations
 * This complements the Supabase client by providing direct SQL access when needed
 */
export const pgDbService = {
  /**
   * Get a user by ID
   * @param userId - The user ID
   * @returns Promise with the user
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      const result = await query('SELECT * FROM users WHERE id = $1', [userId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  },

  /**
   * Get all admin users
   * @returns Promise with an array of admin users
   */
  async getAdminUsers(): Promise<User[]> {
    try {
      const result = await query('SELECT * FROM users WHERE is_admin = true');
      return result.rows;
    } catch (error) {
      console.error('Error getting admin users:', error);
      throw error;
    }
  },

  /**
   * Get articles with complex filtering (example of a more complex query)
   * @param options - Filter options
   * @returns Promise with filtered articles
   */
  async getArticlesWithFilters({
    categoryId,
    isPublished = true,
    limit = 10,
    offset = 0,
    searchTerm
  }: {
    categoryId?: number;
    isPublished?: boolean;
    limit?: number;
    offset?: number;
    searchTerm?: string;
  }): Promise<Article[]> {    try {
      let sql = 'SELECT * FROM articles WHERE 1=1';
      const params: (string | number)[] = [];
      
      if (isPublished) {
        sql += ' AND status = $' + (params.length + 1);
        params.push('published');
      }
      
      if (categoryId) {
        sql += ' AND category_id = $' + (params.length + 1);
        params.push(categoryId);
      }
      
      if (searchTerm) {
        sql += ' AND (title ILIKE $' + (params.length + 1) + ' OR content::text ILIKE $' + (params.length + 1) + ')';
        params.push(`%${searchTerm}%`);
      }
      
      sql += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
      params.push(limit, offset);
      
      const result = await query(sql, params);
      return result.rows;
    } catch (error) {
      console.error('Error getting filtered articles:', error);
      throw error;
    }
  },

  /**
   * Example of a transaction to create an article with related data
   * @param articleData - The article data
   * @param tags - Tags to associate with the article
   * @returns Promise with the created article ID
   */
  async createArticleWithTags(
    articleData: Omit<Database['public']['Tables']['articles']['Insert'], 'id'>, 
    tags: string[]
  ): Promise<string> {
    return transaction(async (client) => {
      // Insert the article
      const articleResult = await client.query(
        'INSERT INTO articles(title, heading, content, category_id, user_id, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
        [articleData.title, articleData.heading, articleData.content, articleData.category_id, articleData.user_id, articleData.status || 'draft']
      );
      
      const articleId = articleResult.rows[0].id;
      
      // Update the tags array
      if (tags.length > 0) {
        await client.query(
          'UPDATE articles SET tags = $1 WHERE id = $2',
          [tags, articleId]
        );
      }
      
      return articleId;
    });
  }
};

export default pgDbService;
