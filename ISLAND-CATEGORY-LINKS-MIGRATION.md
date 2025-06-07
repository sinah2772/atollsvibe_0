# Island to Category Links Migration

This document describes the migration to create a many-to-many relationship between the `islands` and `island_categories` tables.

## Background

Previously, the island categories were stored directly in the `islands` table using:
- `island_category` (string): Category name in Dhivehi
- `island_category_en` (string): Category name in English
- `island_categories_id` (integer): Foreign key to island_categories table

While `island_categories_id` created a one-to-many relationship, this structure limited each island to belong to only one category. The new structure allows islands to belong to multiple categories.

## New Structure

The new structure introduces a junction table called `island_category_links` that establishes a many-to-many relationship:

```
islands (1) --< island_category_links >-- (many) island_categories
```

### island_category_links Table Structure

| Column             | Type                  | Description                     |
|--------------------|------------------------|----------------------------------|
| id                 | SERIAL                 | Primary key                     |
| island_id          | INTEGER                | Foreign key to islands.id       |
| island_category_id | INTEGER                | Foreign key to island_categories.id |
| created_at         | TIMESTAMP WITH TIMEZONE | Creation timestamp              |

Constraints:
- Primary key on `id`
- Foreign keys to both parent tables
- Unique constraint on the pair `(island_id, island_category_id)`

## How to Apply the Migration

1. Make sure your Supabase environment is properly set up
2. Run the migration script:

```bash
node create-island-category-links.js
```

This will create the junction table and populate it with existing relationships from the `islands` table.

## Using the New Structure

### Fetching Islands with Categories

```javascript
// Example query to get all categories for an island
const { data, error } = await supabase
  .from('island_category_links')
  .select(`
    island_id,
    island:island_id (name, name_en),
    category:island_category_id (name, name_en)
  `)
  .eq('island_id', islandId);
```

### Adding a Category to an Island

```javascript
// Example query to link an island to a category
const { data, error } = await supabase
  .from('island_category_links')
  .insert([
    { island_id: islandId, island_category_id: categoryId }
  ]);
```

### Removing a Category from an Island

```javascript
// Example query to remove a category link
const { data, error } = await supabase
  .from('island_category_links')
  .delete()
  .match({ island_id: islandId, island_category_id: categoryId });
```

## Benefits

1. Islands can now belong to multiple categories
2. Direct access to all islands in a category
3. Easier to maintain and extend
4. Better data integrity through constraints
