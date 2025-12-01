// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    // ... any existing configuration
    
    // Add the Webpack configuration function
    webpack: (config: { externals: string[]; module: { rules: { test: RegExp; use: string; }[]; }; }, { isServer }: any) => {
        // If we are building for the server, we can treat these as externals
        // because they will be resolved at runtime on the server (Node.js).
        if (isServer) {
            // Mark native addons/modules as external to exclude them from the client bundle.
            // You might need to add other related packages here (e.g., 'fsevents', 'sqlite3')
            config.externals.push('@mapbox/node-pre-gyp');
        }

        // Add a rule to handle the HTML file error (optional but safer)
        // If an HTML file is found, treat it as text or raw data, not a JS module.
        config.module.rules.push({
            test: /\.html$/,
            use: 'raw-loader', // Use raw-loader to handle it as raw text
        });

        return config;
    },
};

module.exports = nextConfig;