// Type declarations for Deno edge functions
// This file helps TypeScript recognize Deno-specific imports without errors

declare module 'https://deno.land/std@*/http/server.ts' {
  export function serve(handler: (request: Request) => Response | Promise<Response>): void;
}

declare module 'npm:@supabase/supabase-js@*' {
  export interface SupabaseClientOptions {
    auth?: {
      autoRefreshToken?: boolean;
      persistSession?: boolean;
      detectSessionInUrl?: boolean;
    };
    global?: {
      headers?: Record<string, string>;
      fetch?: typeof fetch;
    };
  }
  export interface PostgrestQueryBuilder {
    select(columns?: string): PostgrestFilterBuilder;
    insert(values: unknown): PostgrestFilterBuilder;
    upsert(values: unknown): PostgrestFilterBuilder;
    update(values: unknown): PostgrestFilterBuilder;
    delete(): PostgrestFilterBuilder;
  }
  
  export interface PostgrestFilterBuilder {
    eq(column: string, value: unknown): PostgrestFilterBuilder;
    neq(column: string, value: unknown): PostgrestFilterBuilder;
    gt(column: string, value: unknown): PostgrestFilterBuilder;
    lt(column: string, value: unknown): PostgrestFilterBuilder;
    gte(column: string, value: unknown): PostgrestFilterBuilder;
    lte(column: string, value: unknown): PostgrestFilterBuilder;
    like(column: string, pattern: string): PostgrestFilterBuilder;
    order(column: string): PostgrestFilterBuilder;
    limit(count: number): PostgrestFilterBuilder;
    single(): Promise<{ data: unknown; error: unknown }>;
    then(onfulfilled?: ((value: { data: unknown; error: unknown }) => unknown)): Promise<unknown>;
  }
  
  export interface StorageBucketApi {
    upload(path: string, fileBody: File, options?: unknown): Promise<{ data: unknown; error: unknown }>;
    download(path: string): Promise<{ data: unknown; error: unknown }>;
    list(options?: unknown): Promise<{ data: unknown; error: unknown }>;
    remove(paths: string[]): Promise<{ data: unknown; error: unknown }>;
    getPublicUrl(path: string): { data: { publicUrl: string } };
  }
  
  export interface SupabaseClient {
    from: (tableName: string) => PostgrestQueryBuilder;
    storage: {
      from: (bucketName: string) => StorageBucketApi;
    };
    auth: {
      getSession(): Promise<{ data: { session: unknown | null } }>;
      signIn(params: unknown): Promise<unknown>;
      signOut(): Promise<unknown>;
    };
  }
  
  export function createClient(url: string, key: string, options?: SupabaseClientOptions): SupabaseClient;
}

// Deno namespace declaration
declare namespace Deno {
  export namespace env {
    function get(key: string): string | undefined;
    function set(key: string, value: string): void;
  }
}
