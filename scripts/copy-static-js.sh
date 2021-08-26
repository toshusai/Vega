# Copy Static JavaScript Libraries
cp node_modules/@ffmpeg/core/dist/* static/static/js/ffmpeg
cp node_modules/ccapture.js/build/CCapture.all.min.js static/static/js/ccapture.js/CCapture.all.min.js


sed 's/try{Object.defineProperty(HTMLVideoElement.prototype,"currentTime",{get:t}),Object.defineProperty(HTMLAudioElement.prototype,"currentTime",{get:t})}catch(t){b(t)}//' \
    static/static/js/ccapture.js/CCapture.all.min.js > tmp
cat tmp > static/static/js/ccapture.js/CCapture.all.min.js
rm tmp
