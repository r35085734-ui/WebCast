# 🖥️ Self-hosted relay for ScreenCast

This folder gives you a **guaranteed-connect** backend for ScreenCast. It replaces the
two weak points of the free version:

| Weak point (free) | This fixes it |
|---|---|
| Public PeerJS cloud signaling (`0.peerjs.com`) can be slow/unreliable | Your own **PeerJS signaling server** |
| No TURN → laptop with blocked NAT/firewall gets stuck on "Connecting" | Your own **coturn TURN relay** (media always gets through) |

After you deploy this, the laptop connects **no matter what network it is on**.

---

## What's here

- `peerjs-server.js` — the signaling server (Node.js, uses the `peer` npm package).
- `coturn.conf` — config for the TURN relay.
- `docker-compose.yml` — starts both in one command (requires Docker).
- `README.md` — this file.

---

## Option A — Run with Docker (recommended)

On any machine with Docker (a small $5 VPS, or a PC at home that's always on):

```bash
cd server
# 1. Edit coturn.conf — set a strong password (user=screencast:YOUR_PASSWORD)
#    and set external-ip to your server's PUBLIC IP (or keep AUTO).
# 2. Edit docker-compose.yml -> PUBLIC_HOST to your server's public address.
# 3. Start everything:
docker compose up -d --build
```

That brings up signaling on port **9000** and TURN on **3478** (UDP/TCP).

> **Note:** The browser blocks `getDisplayMedia` on plain HTTP. So for the Sender to
> work from a laptop on the public internet, your relay needs **HTTPS** (see below).
> For **LAN-only** use (TV + laptop on the same Wi-Fi), plain HTTP is fine.

---

## Option B — Run the signaling server without Docker

```bash
cd server
npm install peer
node peerjs-server.js
# → http://localhost:9000/peerjs
```

---

## Making it HTTPS (for public internet)

The most reliable way is a reverse proxy with a free certificate (Caddy makes this a 2-line
config). Example with Caddy:

```
your.domain.com {
    reverse_proxy localhost:9000
}
```

Then set `PUBLIC_HOST=https://your.domain.com` for the signaling. Keep TURN on its UDP ports.

---

## Pointing the front-end at your server

The Sender and Receiver pages read their connection settings from **URL parameters**, so you
don't edit code. Append these to the page URL:

| Param | Meaning | Example |
|---|---|---|
| `peerhost` | Your signaling server host (no scheme) | `peerhost=your.domain.com` |
| `peerport` | Port (default 443) | `peerport=9000` |
| `peersecure` | `1` for HTTPS, `0` for HTTP | `peersecure=1` |
| `peerpath` | Path (default `/`) | `peerpath=/peerjs` |
| `turnurl` | TURN server URL | `turnurl=turn:your.domain.com:3478` |
| `turnuser` | TURN username | `turnuser=screencast` |
| `turnpass` | TURN password | `turnpass=YOUR_PASSWORD` |

Example (Receiver on the TV):

```
https://your-pages-url/receiver.html?peerhost=your.domain.com&peerport=443&peersecure=1&peerpath=/peerjs&turnurl=turn:your.domain.com:3478&turnuser=screencast&turnpass=secret
```

Example (Sender on the laptop — same values):

```
https://your-pages-url/sender.html?code=ABCDEF&peerhost=your.domain.com&peerport=443&peersecure=1&peerpath=/peerjs&turnurl=turn:your.domain.com:3478&turnuser=screencast&turnpass=secret
```

If the params are **absent**, the pages fall back to the public PeerJS cloud and STUN
(the current default), so nothing breaks if you don't use the relay.

---

## QA / test

After starting the relay, check:

- Signaling answers: open `http://your-server:9000/peerjs` → shows a JSON/hello response.
- TURN is reachable: `nmap -p 3478 your-server` or `coturn` logs show allocation requests.

If the laptop still won't connect, all the usual laptop-side causes still apply:
**VPN off**, **Windows Firewall "Allow access" popup accepted**, same Wi-Fi, and
router device-isolation off.
