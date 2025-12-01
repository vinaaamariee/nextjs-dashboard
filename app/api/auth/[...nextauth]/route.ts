import authHandler from '@/auth'

// Ensure we export route handlers that Next expects (functions).
// Some bundling/interop can cause the imported value to be an object
// instead of a callable function. Detect that and wrap if necessary.
function makeHandlerMaybe(h: any) {
	if (typeof h === 'function') return h
	// Try common interop shapes
	if (h && typeof h.default === 'function') return h.default
	// Fallback: create a handler that returns a 500 with a helpful message
	return async function _missingHandler() {
		console.error('NextAuth handler is not a function. Imported value:', h)
		return new Response('Auth handler misconfigured on server', { status: 500 })
	}
}

const handler = makeHandlerMaybe(authHandler)

export { handler as GET, handler as POST, handler as PUT, handler as DELETE }
