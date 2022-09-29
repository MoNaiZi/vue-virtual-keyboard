<template>
  <div id="app">
    <div>
      <div>
        中文：<input
          type="text"
          v-model="value"
          keyboard="true"
          data-mode="cn"
        />
      </div>
      <div>英文大写：<input type="text" data-mode="en_cap" /></div>
      <div>英文小写：<input type="text" data-mode="en" /></div>
      <div>数字：<input type="text" data-mode="num" /></div>
      <div>符号：<input type="text" data-mode="biaodian" /></div>
      <div>不需要输入法<input type="text" /></div>
      <keyboard all float :blurHide="true" hand></keyboard>
    </div>
  </div>
</template>

<script>
import keyboard from "./components/keyboard/keyboardIndex.vue";

export default {
  name: "App",
  components: {
    keyboard,
  },
  data() {
    return {
      value: "",
    };
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
