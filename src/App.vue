<template>
  <div id="app">
    <div>
      <input type="text" data-mode="cn" />
      <keyboard all float :blurHide="true" hand></keyboard>
    </div>
  </div>
</template>

<script>
import keyboard from "./components/keyboard/VueHzjKeyboard.vue";

export default {
  name: "App",
  components: {
    keyboard,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
