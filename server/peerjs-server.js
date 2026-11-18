// =============================================================
// Self-hosted PeerJS signaling server
// ---------------------------------------------
// This replaces the public PeerJS cloud signaling (0.peerjs.com)
// with your OWN server. It is the first half of guaranteeing a
// connection on any laptop network. The other half is the TURN
// relay (see coturn.conf / docker-compose.yml).
//
// Run:
//   npm install peer      (once)
//   node peerjs-server.js
// =============================================================

const fs = require('fs');
const { PeerServer } = require('peer');

const PORT = process.env.PORT || 9000;
const PATH = process.env.PEERJS_PATH || '/peerjs';

// Public URL of this server. Needed so the browser knows where to
// reach signaling. Set to your server's public HTTPS address.
// Examples:
//   https://screencast.example.com
//   http://192.168.1.10:9000        (LAN only)
const PUBLIC_HOST = process.env.PUBLIC_HOST || 'localhost';

const options = {
  port: PORT,
  path: PATH,
  // Allow anyone to connect (no auth) — fine for your own relay.
  // For stricter setups see https://github.com/peers/peerjs-server
  allow_discovery: true,
  config: { iceServers: [] }
};

// Optional HTTPS. If you want the public internet to work (browsers
// block getDisplayMedia on plain HTTP), provide a certificate and
// uncomment the `ssl` block.
//
// const SSL_KEY  = '/etc/letsencrypt/live/' + PUBLIC_HOST + '/privkey.pem';
// const SSL_CERT = '/etc/letsencrypt/live/' + PUBLIC_HOST + '/fullchain.pem';
// if (fs.existsSync(SSL_KEY) && fs.existsSync(SSL_CERT)) {
//   options.ssl = {
//     key:  fs.readFileSync(SSL_KEY),
//     cert: fs.readFileSync(SSL_CERT)
//   };
// }

const server = PeerServer(options);

console.log('=============================================');
console.log(' PeerJS signaling server running');
console.log('   URL: ' + (options.ssl ? 'https' : 'http') + '://' + PUBLIC_HOST + ':' + PORT + PATH);
console.log(' Set this as ?peerhost=... on sender/receiver pages.');
console.log('=============================================');
