import * as T from "three";
import { Vector3 } from "three";
import { radToDeg } from "three/src/math/MathUtils";
import { AudioStripEffect } from "./AudioStripEffect";
import { audioCtx, firstInterfact } from "./Global";
import { IAsset } from "./IAsset";
import { Strip } from "./Strip";
import { VideoStripEffect } from "./VideoStripEffect";

export class AudioStripEffectObject {
  type = "Audio";
  loaded = false;
  videoOffset = 0;
  inProgress = false;
  audio: HTMLAudioElement;

  event: EventTarget = new EventTarget();
  constructor(iface: AudioStripEffect, src: string) {
    this.audio = document.createElement("video");

    this.audio.volume = iface.volume;
    this.updateAsset(src);
  }

  public updateAsset(src: string) {
    this.loaded = false;
    const onLoad = () => {
      if (this.loaded) return;
      this.loaded = true;
      this.event.dispatchEvent(new CustomEvent("update"));

      setTimeout(() => {
        const canvas = document.createElement("canvas");
        canvas.width = 6084;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("context2d error");
        if (!audioCtx) throw new Error("audioCtx error");
        const audioSrc = audioCtx.createMediaElementSource(this.audio);
        const analyser = audioCtx.createAnalyser();
        audioSrc.connect(analyser);
        audioSrc.connect(audioCtx.destination);
        analyser.fftSize = 2048;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        analyser.getByteTimeDomainData(dataArray);
        // for (let i = 0; i < dataArray.length; i++) {
        //   // console.log(dataArray[i]);
        //   if (!ctx) return;
        //   // console.log(value);
        //   const x = i;
        //   const y = dataArray[i];
        //   console.log(x, y);
        //   ctx.fillStyle = `red`;
        //   ctx.fillRect(x, 75, 1, y);
        // }

        const filterData = (audioBuffer: AudioBuffer) => {
          const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
          const samples = 6084; // Number of samples we want to have in our final data set
          const blockSize = Math.floor(rawData.length / samples); // Number of samples in each subdivision
          const filteredData = [];
          console.log(rawData.length);

          for (let i = 0; i < samples; i++) {
            filteredData.push(rawData[i * blockSize]);
          }
          return filteredData;
        };

        document.body.append(canvas);
        document.body.style.position = "relative";
        canvas.style.position = "absolute";
        canvas.style.top = "0";
        canvas.style.left = "0";
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        function visualize(audioBuffer: AudioBuffer) {
          const data = filterData(audioBuffer);
          data.forEach((value, index) => {
            if (!ctx) return;
            // console.log(value);
            const x = index;
            const y = value * 100;
            // console.log(x, y);
            ctx.fillStyle = `red`;
            ctx.fillRect(x, 75, 1, y);
          });
        }

        const visualizeAudio = (src: string) => {
          fetch(src)
            .then((response) => response.arrayBuffer())
            .then((arrayBuffer) => audioCtx?.decodeAudioData(arrayBuffer))
            .then((audioBuffer) => audioBuffer && visualize(audioBuffer));
        };
        visualizeAudio(src);
        // for (let i = 0; i < frequencyData.length; i++) {
        // console.log(frequencyData[i]);
        // }
      }, 1000);
    };
    this.audio.onloadedmetadata = () => onLoad();
    this.audio.src = src;
    this.audio.load();
  }

  prevTime = 0;

  public async update(
    strip: Strip,
    effect: AudioStripEffect,
    time: number,
    isPlay: boolean,
    jump: boolean
  ) {
    if (!this.loaded) {
      this.audio.volume = 0;
      return;
    }

    if (strip.start < time && time < strip.start + strip.length) {
      this.audio.volume = effect.volume;

      // When move strip and
      if (this.prevTime !== strip.start) {
        this.audio.currentTime = time - strip.start + effect.start;
      }

      if ((isPlay && this.audio.paused) || jump) {
        // cannot play without user interaction
        if (firstInterfact) {
          if (!this.inProgress) {
            this.inProgress = true;
            this.audio.play().then(() => {
              this.inProgress = false;
            });
          }
          this.audio.currentTime = time - strip.start + effect.start;
        }
      }
      if (!isPlay && !this.inProgress) {
        this.audio.pause();
      }
    } else {
      this.audio.volume = 0;
      if (!this.audio.paused && !this.inProgress) {
        this.audio.pause();
      }
    }
    this.prevTime = strip.start;
  }
}
