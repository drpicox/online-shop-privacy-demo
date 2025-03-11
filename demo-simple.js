#!/usr/bin/env node
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Starting demo setup...');

// Check if ngrok is installed
exec('which ngrok', (error, stdout) => {
  if (error) {
    console.error('❌ ngrok not found. Please install ngrok: npm install -g ngrok');
    process.exit(1);
  }
  
  console.log('✅ ngrok found, starting setup...');
  
  // Prompt for the ngrok URL
  rl.question('Please run "ngrok http 3000" in another terminal, then paste the https URL here: ', (ngrokUrl) => {
    if (!ngrokUrl.startsWith('http')) {
      console.error('❌ Invalid URL. Must start with http:// or https://');
      process.exit(1);
    }
    
    console.log(`🌐 Using ngrok URL: ${ngrokUrl}`);
    
    // Save the URL to the lib/ngrokUrl.js file
    const ngrokUrlFile = path.join(__dirname, 'lib', 'ngrokUrl.js');
    fs.writeFileSync(ngrokUrlFile, `export const NGROK_URL = '${ngrokUrl}';\n`);
    
    console.log('✅ URL saved to lib/ngrokUrl.js');
    console.log('📱 QR code will point to:', `${ngrokUrl}/shop`);
    console.log('🔗 View the demo at:', `${ngrokUrl}/viewer`);
    
    // Start the application
    console.log('🔄 Starting the application...');
    rl.close();
    
    const app = exec('npm run dev', { 
      env: {
        ...process.env,
        NGROK_URL: ngrokUrl
      }
    });
    
    app.stdout.pipe(process.stdout);
    app.stderr.pipe(process.stderr);
    
    app.on('exit', (code) => {
      console.log(`Application exited with code ${code}`);
      process.exit(code);
    });
  });
});