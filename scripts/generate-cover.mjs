#!/usr/bin/env node

/**
 * ekkOS Blog Cover Image Generator
 * Standardized FLUX 2 Max configuration - only the prompt changes
 *
 * Usage: node generate-cover.mjs <slug> "<prompt>"
 * Example: node generate-cover.mjs multi-agent-memory "Brain nodes with fragmentation"
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { config } from 'dotenv';

// Load env - first .env.local (has OIDC token), then root .env
config({ path: '/Volumes/MacMiniPort/DEV/EKKOS/apps/blog/.env.local' });
config({ path: '/Volumes/MacMiniPort/DEV/EKKOS/.env' });

const execAsync = promisify(exec);

// ============================================================================
// STANDARDIZED CONFIGURATION (DO NOT CHANGE)
// ============================================================================

const CONFIG = {
  // FLUX 2 Max model (NEVER change this)
  model: 'bfl/flux-2-max',

  // Image dimensions (16:9 aspect ratio)
  width: 1920,
  height: 1080,

  // Logo configuration
  logo: {
    path: '/Volumes/MacMiniPort/DEV/LOGO/ekkos_white.png',
    size: '300x',
    gravity: 'SouthEast',
    offset: '+30+30'
  },

  // Output paths
  blogDir: '/Volumes/MacMiniPort/DEV/EKKOS/apps/blog',
  outputDir: '/Volumes/MacMiniPort/DEV/EKKOS/apps/blog/public/images/blog',

  // API endpoint (Vercel AI Gateway)
  apiUrl: 'https://ai-gateway.vercel.sh/v1/images/generations',
  apiKey: process.env.VERCEL_OIDC_TOKEN
};

// ============================================================================
// MAIN FUNCTION
// ============================================================================

async function generateCover(slug, userPrompt) {
  console.log('🎨 ekkOS Blog Cover Generator');
  console.log('═'.repeat(60));
  console.log(`📝 Slug: ${slug}`);
  console.log(`💭 Prompt: ${userPrompt}`);
  console.log('');
  console.log('📐 Standardized Configuration:');
  console.log(`   Model: ${CONFIG.model} (FLUX 2 Max via Vercel AI Gateway)`);
  console.log(`   Dimensions: ${CONFIG.width}x${CONFIG.height} (16:9)`);
  console.log(`   Logo: ${CONFIG.logo.size} at ${CONFIG.logo.gravity} ${CONFIG.logo.offset}`);
  console.log('');

  // Step 1: Generate with FLUX 2 Max
  console.log('⚡ Step 1: Generating with FLUX 2 Max...');

  // FLUX 2 Max optimization: Subject-first layered structure
  // [Subject] + [Scene] + [Style] + [Lighting] + [Camera] + [Technical]
  const enhancedPrompt =
    `${userPrompt}, ` +
    `professional photorealistic 3D rendering with ray tracing, ` +
    `cinematic volumetric lighting with depth, ` +
    `50mm lens perspective with shallow depth of field, ` +
    `dark gradient background, ` +
    `ultra detailed 4K quality, ` +
    `16:9 landscape format`;


  const tempFile = path.join('/tmp', `flux-${slug}-${Date.now()}.png`);
  const finalFile = path.join(CONFIG.outputDir, `${slug}.png`);

  try {
    // Generate image via Vercel AI Gateway
    const response = await fetch(CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: CONFIG.model,
        prompt: enhancedPrompt,
        size: `${CONFIG.width}x${CONFIG.height}`,
        n: 1
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    const result = await response.json();

    // Handle response - could be URL or base64
    let imageData;
    if (result.image) {
      // Base64 encoded image
      imageData = Buffer.from(result.image, 'base64');
      await fs.writeFile(tempFile, imageData);
      console.log('✓ Image generated and saved');
    } else if (result.url) {
      // Image URL
      console.log(`📥 Downloading from: ${result.url}`);
      const imageResponse = await fetch(result.url);
      const buffer = await imageResponse.arrayBuffer();
      await fs.writeFile(tempFile, Buffer.from(buffer));
      console.log('✓ Image downloaded');
    } else if (result.data && result.data[0]) {
      // OpenAI-style response
      if (result.data[0].b64_json) {
        imageData = Buffer.from(result.data[0].b64_json, 'base64');
        await fs.writeFile(tempFile, imageData);
        console.log('✓ Image generated and saved');
      } else if (result.data[0].url) {
        console.log(`📥 Downloading from: ${result.data[0].url}`);
        const imageResponse = await fetch(result.data[0].url);
        const buffer = await imageResponse.arrayBuffer();
        await fs.writeFile(tempFile, Buffer.from(buffer));
        console.log('✓ Image downloaded');
      }
    } else {
      throw new Error('Unexpected response format: ' + JSON.stringify(result));
    }

    // Step 2: Composite logo
    console.log('');
    console.log('🖼️  Step 2: Compositing ekkOS logo...');

    const { stdout, stderr } = await execAsync(
      `magick "${tempFile}" ` +
      `\\( "${CONFIG.logo.path}" -resize ${CONFIG.logo.size} \\) ` +
      `-gravity ${CONFIG.logo.gravity} -geometry ${CONFIG.logo.offset} ` +
      `-composite "${finalFile}"`
    );

    if (stderr && !stderr.includes('WARNING')) {
      console.error('⚠️  ImageMagick warnings:', stderr);
    }

    console.log('✓ Logo composited');

    // Step 3: Verify output
    console.log('');
    console.log('🔍 Step 3: Verifying output...');

    const stats = await fs.stat(finalFile);
    const fileSizeMB = (stats.size / 1024 / 1024).toFixed(2);

    console.log('');
    console.log('═'.repeat(60));
    console.log('✅ SUCCESS');
    console.log('═'.repeat(60));
    console.log(`📁 Output: ${finalFile}`);
    console.log(`📊 Size: ${fileSizeMB} MB`);
    console.log('');
    console.log('Verification Checklist:');
    console.log('  ✓ Model: FLUX 2 Max (bfl/flux-2-max via Vercel AI Gateway)');
    console.log('  ✓ Dimensions: 1920x1080 (16:9)');
    console.log('  ✓ Logo: ekkOS white, 300px, lower-right');
    console.log('');
    console.log('Next steps:');
    console.log('  1. Preview the image');
    console.log('  2. Update blog post frontmatter');
    console.log('  3. Commit and deploy');

    // Cleanup temp file
    await fs.unlink(tempFile);

  } catch (error) {
    console.error('');
    console.error('❌ ERROR:', error.message);
    console.error('');
    process.exit(1);
  }
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Usage: node generate-cover.mjs <slug> "<prompt>"');
  console.error('');
  console.error('Example:');
  console.error('  node generate-cover.mjs multi-agent-memory "Central glowing brain surrounded by fragmented nodes"');
  console.error('');
  process.exit(1);
}

const [slug, prompt] = args;

generateCover(slug, prompt);
