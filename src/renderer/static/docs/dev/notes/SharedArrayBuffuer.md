# FFmpeg js used shared array buffer

Not work ffmpeg with only nuxt server hosting,
because you cannot add http headers to nuxt responses.

You have to use other proxy middleware (like nginx).

Add HTTP Headers to avoid `SharedArrayBuffer is not defined` Error

```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

Details here

https://developer.chrome.com/blog/enabling-shared-array-buffer/
