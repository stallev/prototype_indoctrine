import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // `next dev` otherwise auto-appends an AI-agent notice block to CLAUDE.md
  // on every dev-server start — this repo's CLAUDE.md is hand-authored
  // project instructions, not a file Next.js tooling should rewrite.
  agentRules: false,
};

export default nextConfig;
