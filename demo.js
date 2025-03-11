#!/usr/bin/env node
const { spawn, exec } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Check if ngrok is installed
exec('which ngrok', (error, stdout) => {
  if (error) {
    console.error('❌ ngrok not found. Please install ngrok: npm install -g ngrok');
    process.exit(1);
  }
  
  console.log('✅ ngrok found, starting demo...');
  startDemo();
});

function startDemo() {
  console.log('🚀 Starting demo environment...');
  
  // Use the ngrok API instead of parsing output
  console.log('🔄 Getting ngrok URL via HTTP API...');
  
  // Start ngrok in a separate process
  const ngrok = spawn('ngrok', ['http', '3000'], { 
    stdio: ['pipe', 'pipe', 'pipe'],
    detached: true 
  });
  
  // Wait a moment for ngrok to start and set up its API
  setTimeout(() => {
    // Use ngrok's API to get the URL instead of parsing stdout
    http.get('http://localhost:4040/api/tunnels', (res) => {
      let data = '';
      
      // A chunk of data has been received
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      // The whole response has been received
      res.on('end', () => {
        try {
          const tunnels = JSON.parse(data).tunnels;
          const secureTunnel = tunnels.find(t => t.proto === 'https');
          const httpTunnel = tunnels.find(t => t.proto === 'http');
          const ngrokUrl = secureTunnel ? secureTunnel.public_url : httpTunnel ? httpTunnel.public_url : null;
          
          if (ngrokUrl) {
            console.log(`🌐 ngrok URL: ${ngrokUrl}`);
            startApp(ngrokUrl);
          } else {
            console.error('❌ Could not find ngrok tunnel URL');
            ngrok.kill();
            process.exit(1);
          }
        } catch (e) {
          console.error('❌ Error parsing ngrok API response:', e);
          console.log('Raw response:', data);
          ngrok.kill();
          process.exit(1);
        }
      });
    }).on('error', (err) => {
      console.error('❌ Error connecting to ngrok API:', err.message);
      console.log('Falling back to manual ngrok configuration...');
      console.log('Please enter your ngrok URL from the ngrok dashboard:');
      
      // Set up stdin to read the URL manually
      process.stdin.resume();
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', (input) => {
        const manualUrl = input.toString().trim();
        if (manualUrl.startsWith('http')) {
          console.log(`Using manually entered URL: ${manualUrl}`);
          startApp(manualUrl);
        } else {
          console.log('That doesn\'t look like a valid URL. Please enter a URL starting with http:// or https://');
        }
      });
    });
  }, 2000); // Wait 2 seconds for ngrok to initialize
  
  // Handle ngrok output for debugging
  ngrok.stdout.on('data', (data) => {
    console.log('ngrok: ' + data.toString());
  });
  
  ngrok.stderr.on('data', (data) => {
    console.error('ngrok error: ' + data.toString());
  });
  
  ngrok.on('close', (code) => {
    console.log(`ngrok process exited with code ${code}`);
    process.exit(code);
  });
  
  // Handle shutdown
  process.on('SIGINT', () => {
    console.log('Shutting down...');
    ngrok.kill();
    process.exit(0);
  });
}

function startApp(ngrokUrl) {
  // Replace the baseUrl in the viewer page with ngrok URL
  console.log('🔧 Setting up QR code with ngrok URL in the viewer...');
  
  // Make a temporary copy of lib/ngrokUrl.js to store the URL
  const ngrokUrlFile = path.join(__dirname, 'lib', 'ngrokUrl.js');
  fs.writeFileSync(ngrokUrlFile, `export const NGROK_URL = '${ngrokUrl}';\n`);
  
  console.log('📱 QR code will point to:', `${ngrokUrl}/shop`);
  console.log('🔗 View the demo at:', `${ngrokUrl}/viewer`);
  
  // Start the Next.js application
  const app = spawn('npm', ['run', 'dev'], { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NGROK_URL: ngrokUrl
    }
  });
  
  app.on('close', (code) => {
    console.log(`Next.js process exited with code ${code}`);
    process.exit(code);
  });
}