/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true'

const nextConfig = {
  // Static export for GitHub Pages
  output: 'export',
  trailingSlash: true,

  // Required for static export – Next.js image optimisation needs a server
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },

  // Set this to your GitHub repo name when deploying to GitHub Pages
  // e.g.  basePath: '/salonshop'
  // Leave empty for a custom domain or root Pages deployment
  basePath: isGithubPages ? (process.env.BASE_PATH ?? '') : '',
  assetPrefix: isGithubPages ? (process.env.BASE_PATH ?? '') : '',

  experimental: {
    serverComponentsExternalPackages: ['stripe'],
  },
}

export default nextConfig
