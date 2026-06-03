Quick guide to run the local stats mock server for `statistic.html` testing

Prerequisites:
- Python 3.8+
- Install dependencies: `pip install aiohttp websockets`

Run mock server (from workspace root):

```bash
python tools/stats_server.py
```

- WebSocket endpoint: `ws://localhost:8765`
- HTTP fallback endpoint: `http://localhost:8000/api/stats`

If you host the static site on the same host, `statistic.html` will try `ws` at the same origin `/ws/stats` and fallback to `/api/stats`.
If you want statistic.html to point to the local mock server, open it with the browser and edit the `CLOUD` constant in the page or host via a small static server such as `python -m http.server 8080` from the site root.
