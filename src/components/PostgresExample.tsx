import { useEffect, useState } from 'react';
import pgDbService from '../services/pgDbService';
import { Database } from '../lib/supabase-types';

type User = Database['public']['Tables']['users']['Row'];
type Article = Database['public']['Tables']['articles']['Row'];

export default function PostgresExample() {
  const [loading, setLoading] = useState(true);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch admin users using direct PostgreSQL connection
        const users = await pgDbService.getAdminUsers();
        setAdminUsers(users);
        
        // Fetch recent articles with filters
        const recentArticles = await pgDbService.getArticlesWithFilters({
          isPublished: true,
          limit: 5
        });
        setArticles(recentArticles);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Check console for details.');
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">PostgreSQL Direct Connection Example</h1>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Admin Users</h2>
        {adminUsers.length === 0 ? (
          <p>No admin users found.</p>
        ) : (
          <ul className="list-disc pl-5">
            {adminUsers.map(user => (
              <li key={user.id}>
                {user.email} (ID: {user.id})
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Recent Articles</h2>
        {articles.length === 0 ? (
          <p>No articles found.</p>
        ) : (
          <ul className="space-y-4">
            {articles.map(article => (
              <li key={article.id} className="border p-3 rounded">
                <h3 className="font-medium">{article.title}</h3>
                <p className="text-sm text-gray-600">
                  Published: {new Date(article.created_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
