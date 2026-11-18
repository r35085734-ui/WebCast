# 📡 ScreenCast — Wireless Screen Mirroring (Browser to Browser)

Mirror your Windows laptop screen onto your smart TV's browser over the internet —
no cables, no apps, no router setup. Just a browser on each device.

- **TV (Receiver):** `receiver.html` — shows a 6-letter code, displays your laptop's screen **and sound**.
- **Laptop (Sender):** `sender.html` — enter the code and stream your screen **and audio**.
- **Home:** `index.html` — landing page that links to both.

---

## How it works

The app uses **WebRTC** to stream your screen peer-to-peer:

1. The TV page creates a "peer" with a random 6-letter code as its ID.
2. The laptop page connects to that ID via the **PeerJS cloud signaling server**.
3. Once connected, the laptop captures its screen and system/tab audio with `getDisplayMedia()`
   and sends the stream over WebRTC straight to the TV.
4. The video and audio flow **directly between your devices** (or via a public TURN relay only
   when direct peer-to-peer is blocked by NAT/firewall). They are encrypted in transit.

---

## Important — you must host it over HTTPS

Both screen capture (`getDisplayMedia`) and the shared video require a **secure (HTTPS)** context.
If you just open the files from your disk (`file://`), sharing will NOT work.

### Easiest free hosting options

Pick one, upload the 3 HTML files (or save the 3 files individually), and they'll be live at an HTTPS URL.
Both your TV and laptop visit the *same* URL.

1. **GitHub Pages** — create a repo, push `index.html`, `receiver.html`, `sender.html`, enable Pages → free & permanent.
2. **Netlify / Vercel** — drag-and-drop the folder into their dashboard → immediate HTTPS link.
3. **Cloudflare Pages** — connect a folder, free HTTPS.

All three are free and give you a stable link like `https://yourname.something` you can
bookmark on your TV's browser.

### If you have a home server (optional)
Run a tiny static server, then expose it with HTTPS via a tunnel:
```powershell
# in this folder
python -m http.server 8080
# then expose it, e.g.:
#   npx localtunnel --port 8080
#   or  cloudflared tunnel --url http://localhost:8080
```

---

## Usage step-by-step

1. **On the TV:** open your TV's browser, go to the hosted URL, choose **"I'm the TV (Receiver)"**.
   You'll see a 6-letter code.
2. **On the laptop:** on your Windows laptop, open the **same URL**, choose **"I'm the Laptop (Sender)"**.
3. Enter the 6-letter code and click **Connect**.
4. Click **Start Sharing Screen**, then select **"Entire screen"** in the Windows picker (or a single
   window). To also share sound to the TV, tick **"Share system audio"** in that picker (Chrome/Edge).
5. Your screen and audio appear on the TV. Use the Windows capture bar or the **Stop Sharing** button to end.

---

## Tips for best quality

- Put both devices on the **same Wi‑Fi** for the lowest latency and best quality (though
  different networks work too via the relay).
- Keep the TV page **open and in the foreground** while streaming.
- The sender captures at up to **60fps** for smooth, near real-time video (WebRTC already encodes
  as fast as your CPU/network allow). For the snappiest feel, use a wired connection or 5 GHz Wi‑Fi.
- To hear audio on the TV, enable **"Share system audio"** in the screen (icker. To fully mute your
  laptop's own speakers, lower the laptop sound (browsers can't change system volume automatically).
- For 1080p smoothness, make sure the TV's browser is reasonably modern (WebRTC support).
- If video never connects but the code/connection succeeds, your network may block P2P;
  the relay should still get you a working (if slightly lower-quality) stream.

## Notes / limitations

- `getDisplayMedia` may not be available in some older TV in-app browsers. If your TV's browser
  lacks it, consider using the TV's built-in **Google Cast**/**AirPlay** feature instead for a
  more native experience.
- This is a best-effort free solution; for commercial TV casting use dedicated software.
- No login, no data storage, no account. All traffic is encrypted end-to-end over WebRTC.
