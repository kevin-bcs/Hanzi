/** Shared mutable application/session bindings. No persistence happens here.
 * Bootstrap initializes these in the original order; services own storage writes.
 * Game fields retain their existing names for compatibility during this behavior-preserving refactor. */
export const runtime = {};
