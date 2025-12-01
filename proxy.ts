// Re-export our local middleware to avoid runtime mismatch with next-auth middleware
export { middleware, config } from './middleware';

// Proxy matcher — exclude Next internals and static assets
// proxy.ts is kept for compatibility; middleware/config are re-exported from middleware.ts
