# Development

## Setup Environment

### 0. Basic dependency 
- Node.js v14 or later.
- Google Chrome 92 or later.

### 1. Install npm dependencies.

```
npm install
```

### 2. Copy static JavaScript libraries.

```
sh scripts/copy-static-js.sh
```

### 3. Run Nuxt dev server.
```
yarn dev
```

### 5. Develop

### 6. Test
```
npm run cypress:run
```





```
  -r 10
  -i _vega_video.webm
  -i 935a18a4-d2bc-4598-b571-d544914ed8f2.mp3
  -i 263C4DE0-92F5-48C2-8DBD-34854F0349EF.mp4
  -s 1280x720
  -filter_complex [2:a]adelay=5715|5715[out2];[1:a]adelay=260|260[out1];[out1][out2]amix=inputs=2[out]
  -map [out]:a
  -c:a aac
  -map 0:v
  -t 10
  -c:v libx264
  -pix_fmt yuv420p
  -s 1280x720
  out.mp4
```