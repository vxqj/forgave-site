const fs = require('fs');
const path = require('path');
const UglifyJS = require('uglify-js');
const CleanCSS = require('clean-css');
const htmlMinifier = require('html-minifier');

// Read your HTML file
const html = fs.readFileSync('index.html', 'utf8');

// Extract CSS
const cssMatch = html.match(/<style>([\s\S]*?)<\/style>/);
const css = cssMatch ? cssMatch[1] : '';

// Extract JS
const jsMatch = html.match(/<script>([\s\S]*?)<\/script>/);
const js = jsMatch ? jsMatch[1] : '';

// Minify CSS
const minifiedCSS = new CleanCSS().minify(css).styles;

// Minify & Obfuscate JS
const minifiedJS = UglifyJS.minify(js, {
  compress: {
    drop_console: true,        // Remove console logs
    drop_debugger: true,
    pure_funcs: ['console.log', 'console.debug']
  },
  mangle: {
    reserved: ['session', 'C', 'slug']  // Keep these names readable
  },
  output: {
    beautify: false
  }
}).code;

// Build final HTML
const finalHTML = html
  .replace(/<style>[\s\S]*?<\/style>/, `<style>${minifiedCSS}</style>`)
  .replace(/<script>[\s\S]*?<\/script>/, `<script>${minifiedJS}</script>`);

// Write output
fs.writeFileSync('dist/index.html', finalHTML);
console.log('✅ Built to dist/index.html');
