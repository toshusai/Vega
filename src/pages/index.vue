<script setup lang="ts">

</script>

<template>
  <div>
    <div style="justify-content: center;">
      <div class="thumbnail">
        <img class="image" src="/vega/screenshot.png">
        <div style="margin: auto; z-index: 1; text-align: center;">
          <h1 style="font-size: 32px">
            Vega
          </h1>
          <h2>
            a open source video editor
          </h2>
          <!-- <v-button>
            Download
          </v-button> -->
        </div>
      </div>
    </div>
    <div class="body" style="">
      <div class="section-title">
        Open Source
      </div>
      <div class="section">
        <div>All source code is available on <a href="https://github.com/toshusai/vega">GitHub</a></div>
        <div>You can use it for any purpose under the MIT License.</div>
      </div>

      <div class="section-title">
        Platforms
      </div>
      <div class="section">
        <div>It is made with web technology and works on many platforms including Mac, Windows, and Linux.</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section-title {
    margin-top: 12px;
    font-size: 20px;
}

.section {
    margin-top: 6px;
}

.body {
    margin: 12px 24px
}

.thumbnail {
    width: 100%;
    height: 300px;
    display: flex;
    position: relative;
    overflow: hidden;
    border-bottom: 1px solid white;
}

.image {
    width: 100%;
    position: absolute;
    transform: perspective(800px) rotate3d(0, 1, 0, 34deg) scale(1.5) translateY(-200px);
    opacity: 0.5;
}

@media screen and (max-width: 768px) {
    .image {
        transform: perspective(800px) rotate3d(0, 1, 0, 34deg) scale(1.5);
    }
    .body{
        margin: 12px 12px;
    }
}
</style>
