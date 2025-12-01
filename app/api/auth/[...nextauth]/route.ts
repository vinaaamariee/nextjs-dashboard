import authHandler from '@/auth'

// Log the imported handler shape to help diagnose interop issues.
try {
	// eslint-disable-next-line no-console
	console.log('Imported authHandler type:', typeof authHandler, 'keys:', authHandler ? Object.keys(authHandler) : null)
} catch (e) {
	// ignore logging errors
}

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
