# Coding Guideline

# Vue

There are some rules in Vega Project

basically use vue gudeline -> https://vuejs.org/v2/style-guide/

Check also `eslint` and `prettier` (`.eslintrc.json` `.prettierrc.json`)

These are not eslint plugins.([TODO] create a plugin)

## ️Vue templete
- use `:` insted of `v-bind:`
- use `@` insted of `v-on:`
- use `@change` and `:value` insted of `v-model`
- use `PascalCase` instead of `kebab-case` to custom component tag


## ️SFC tags order

```vue
<template>
<style scoped>
<script>
```

## ️Style tag
- reset by `~/asset/reset.css`
- global style only `~/asset/global.css`
- use `scoped` always
- use pure `css` not `scss`, `sass`

## ️Component declaration order

basically use this order
- props
- refs
- data
- computed
- emits
- mounted
- methods
- OTHRES

wrap by method named `${eventName}Emit`
do not call diarect `this.$emit` 

use `mounted` instead of `created`.

```ts
import Vue from "vue";
import { Component, Prop, Ref } from "vue-property-decorator";

@Component({})
export default class Snakbar extends Vue {
  @Prop() x!: number;

  @Ref() el?: HTMLElement;

  y: number = 0;

  get getter() {
    return true
  }

  clickEmit(e: MouseEvent) {
    this.$emit("click", e)
  }

  mounted() {

  }

  method() {
    return false
  }

  // Others
}
```
