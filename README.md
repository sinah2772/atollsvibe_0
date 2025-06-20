# AtollsVibe

A news and information website focused on the Maldives and its beautiful atolls.

## Setup & Installation

1. Clone the repository

   ```bash
   git clone https://github.com/your-username/atollsvibe.git
   cd atollsvibe/project
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Supabase credentials

   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Start the development server

   ```bash
   npm run dev
   ```

## Troubleshooting

If you encounter issues with the application, we've added several diagnostic tools:

### Supabase Connection Issues

Check your Supabase connection and database setup:

```bash
npm run check-supabase
```

### Image Fetching Issues

If you're experiencing "Failed to fetch images" errors:

- Check the Edge Function status:

  ```bash
  npm run check-edge-function
  ```

- Read the troubleshooting guide:

```bash
cat IMAGE-FETCH-TROUBLESHOOTING.md
```

### Populating Sample Data

To populate the database with sample atoll data:

```bash
npm run populate-atolls
```

## Edge Functions

This project uses Supabase Edge Functions to handle image fetching and other server-side operations. See the [Edge Function README](supabase/functions/README.md) for details on deployment and configuration.
# atollsvibe_0
