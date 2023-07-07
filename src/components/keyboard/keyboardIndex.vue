<template>
  <transition :name="!transitionTime ? '' : 'keyboardTransition'">
    <div
      v-show="show"
      :class="['my-keyboard', equipmentType]"
      @mousedown="mousedown"
      :style="{ transition: `all ${transitionTime}` }"
    >
      <div
        v-if="mode === 'cn' && !showDiction && cn_input?.length"
        class="pinyin"
      >
        <div>
          <span>{{ cn_input }}</span>
        </div>
      </div>
      <div
        v-if="mode === 'cn' && !showDiction && cn_input?.length"
        class="select-list"
        :style="{ height: cut_cn_list.length ? '' : '40px' }"
      >
        <div>
          <div class="item_main">
            <span
              class="select-text"
              v-for="(text, index) in cut_cn_list"
              :key="index"
              @click="clickCN($event, text)"
              >{{ index + 1 + "." + text }}</span
            >
          </div>

          <div class="page" v-if="equipmentType === 'pc'">
            <p :style="previousStyleFn" @[keyEvent]="previous_page">
              <fullTriangle></fullTriangle>
            </p>
            <p :style="nextPageStyleFn" class="next" @[keyEvent]="next_page">
              <fullTriangle></fullTriangle>
            </p>
          </div>
          <div class="page" v-else>
            <p class="next" @[keyEvent]="isShowDiction">
              <fullTriangle></fullTriangle>
            </p>
          </div>
        </div>
      </div>
      <!-- 12键盘 -->
      <div
        v-if="['id_card', 'di_git', 'biaodian', 'num'].includes(mode)"
        :class="[
          'main-keyboard',
          mode != 'biaodian' && old_mode === '' ? 'no_del_box' : '',
        ]"
      >
        <div :class="['number-box', mode]">
          <div
            v-if="mode != 'biaodian' && old_mode === ''"
            @click="HideKey"
            class="hide12key"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M36 18L24 30L12 18"
                stroke="rgb(141 141 141)"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <template v-for="(key, index) in number_keys2">
            <span
              v-if="
                (index != number_keys2.length - 1 ||
                  old_mode != '' ||
                  mode === 'biaodian') &&
                key != ''
              "
              :key="'key' + index"
              class="key number"
              @[keyEvent]="clickNumber($event, key)"
              :class="{ disabled_key: key === '' ? true : false }"
              >{{ key }}</span
            >
          </template>
          <keyDel v-if="mode != 'biaodian' && old_mode === ''"></keyDel>
        </div>

        <div class="del-box" v-if="mode === 'biaodian' || old_mode != ''">
          <keyDel></keyDel>
          <span class="key number" @[keyEvent]="cn_change('cn')">
            <template v-if="mainMode != 'noCn'">中/</template>英</span
          >
          <span
            class="key key_hide number"
            style="margin-left: 0px"
            @[keyEvent]="HideKey"
          >
            <svg
              class="jp"
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
              v-if="equipmentType === 'pc'"
            >
              <path
                d="M390.94044445 560.84859262h97.39377777V463.45481485H390.94044445v97.39377777zM560.24177778 317.81925929H463.75822222v97.39377778h97.39377778V317.81925929z m-145.63555556 0H318.12266667v97.39377778h97.39377778V317.81925929z m291.27111111 0H609.39377778v97.39377778h97.39377777V317.81925929zM536.576 560.84859262h97.39377778V463.45481485H536.576v97.39377777zM268.97066667 317.81925929H172.48711111v97.39377778h97.39377778V317.81925929z m486.05866666 97.39377778h97.39377778V317.81925929H755.02933333v97.39377778z m145.63555556-243.02933334H123.33511111c-53.70311111 0-97.39377778 43.69066667-97.39377778 97.39377778V754.72592595c0 53.70311111 43.69066667 97.39377778 97.39377778 97.39377778h776.41955556c53.70311111 0 97.39377778-43.69066667 97.39377778-97.39377778V269.57748151c0-53.70311111-43.69066667-97.39377778-96.48355556-97.39377778z m48.24177778 582.54222222c0 26.39644445-21.84533333 48.24177778-48.24177778 48.24177778H123.33511111c-26.39644445 0-48.24177778-21.84533333-48.24177778-48.24177778V269.57748151c0-26.39644445 21.84533333-48.24177778 48.24177778-48.24177778h776.41955556c26.39644445 0 48.24177778 21.84533333 48.24177778 48.24177778l0.91022222 485.14844444zM682.21155555 560.84859262h97.39377778V463.45481485H682.21155555v97.39377777z m-388.66488888 145.63555556h436.90666666V609.0903704H293.54666667v97.39377778zM341.78844445 463.45481485H245.30488889v97.39377777h97.39377778V463.45481485z"
              />
            </svg>
            <span>
              {{ equipmentType === "pc" ? "隐藏" : "隐藏键盘" }}
              <template v-if="equipmentType === 'pc'">
                <br />
                <i style="display: block; transform: scaleX(2)">v</i>
              </template>
            </span>
          </span>
          <span class="key number" @[keyEvent]="Fanhui()">返回</span>
        </div>
      </div>
      <!-- 26键盘 -->
      <div
        v-if="['cn', 'en_cap', 'en', 'password'].includes(mode) && !showDiction"
        class="main-keyboard"
      >
        <template v-if="equipmentType === 'pc'">
          <span
            class="key"
            v-for="(key, index) in number_keys"
            :key="index + 50"
            @[keyEvent]="clickNumber($event, key)"
            >{{ key }}</span
          >
          <br />
        </template>
        <span
          class="key letter"
          v-for="(key, index) in letter_keys.slice(0, 10)"
          :key="index + 11"
          @[keyEvent]="clickKey($event, key)"
          >{{ key }}</span
        >
        <br />
        <span
          class="key letter"
          v-for="(key, index) in letter_keys.slice(10, 19)"
          :key="index + 21"
          @[keyEvent]="clickKey($event, key)"
          >{{ key }}</span
        >
        <br />

        <span
          v-if="mode === 'cn' && mode != 'password'"
          @[keyEvent]="cn_change('en')"
          class="key blue"
        >
          中 /
          <i class="blue_default">英</i>
        </span>
        <span v-else @[keyEvent]="cn_change('cn')" class="key blue">
          英<template v-if="mainMode != 'noCn'">
            /
            <i class="blue_default">中</i>
          </template>
        </span>

        <span
          class="key letter"
          v-for="(key, index) in letter_keys.slice(19, 26)"
          :key="index + 31"
          @[keyEvent]="clickKey($event, key)"
          >{{ key }}</span
        >
        <keyDel></keyDel>
        <br />
        <span
          class="key key_hide"
          style="width: 140px; margin-left: 10px"
          @[keyEvent]="HideKey"
        >
          <svg
            class="jp"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            v-if="equipmentType === 'pc'"
          >
            <path
              d="M390.94044445 560.84859262h97.39377777V463.45481485H390.94044445v97.39377777zM560.24177778 317.81925929H463.75822222v97.39377778h97.39377778V317.81925929z m-145.63555556 0H318.12266667v97.39377778h97.39377778V317.81925929z m291.27111111 0H609.39377778v97.39377778h97.39377777V317.81925929zM536.576 560.84859262h97.39377778V463.45481485H536.576v97.39377777zM268.97066667 317.81925929H172.48711111v97.39377778h97.39377778V317.81925929z m486.05866666 97.39377778h97.39377778V317.81925929H755.02933333v97.39377778z m145.63555556-243.02933334H123.33511111c-53.70311111 0-97.39377778 43.69066667-97.39377778 97.39377778V754.72592595c0 53.70311111 43.69066667 97.39377778 97.39377778 97.39377778h776.41955556c53.70311111 0 97.39377778-43.69066667 97.39377778-97.39377778V269.57748151c0-53.70311111-43.69066667-97.39377778-96.48355556-97.39377778z m48.24177778 582.54222222c0 26.39644445-21.84533333 48.24177778-48.24177778 48.24177778H123.33511111c-26.39644445 0-48.24177778-21.84533333-48.24177778-48.24177778V269.57748151c0-26.39644445 21.84533333-48.24177778 48.24177778-48.24177778h776.41955556c26.39644445 0 48.24177778 21.84533333 48.24177778 48.24177778l0.91022222 485.14844444zM682.21155555 560.84859262h97.39377778V463.45481485H682.21155555v97.39377777z m-388.66488888 145.63555556h436.90666666V609.0903704H293.54666667v97.39377778zM341.78844445 463.45481485H245.30488889v97.39377777h97.39377778V463.45481485z"
            />
          </svg>
          <span>
            {{ equipmentType === "pc" ? "隐藏" : "隐藏键盘" }}
            <template v-if="equipmentType === 'pc'">
              <br />
              <i style="display: block; transform: scaleX(2)">v</i>
            </template>
          </span>
        </span>

        <span
          v-if="mode === 'en_cap'"
          class="key blue case"
          @[keyEvent]="cap_change()"
        >
          {{ equipmentType === "pc" ? "已锁定大写" : "大写" }}
        </span>
        <span v-else class="key blue case" @[keyEvent]="cap_change()">{{
          equipmentType === "pc" ? "切换大写" : "小写"
        }}</span>
        <span class="key space" @[keyEvent]="clickKey($event, ' ', true)"
          >空格</span
        >
        <span @[keyEvent]="() => (this.mode = 'biaodian')" class="key blue"
          >符号</span
        >
        <span @[keyEvent]="() => (this.mode = 'num')" class="key blue"
          >数字</span
        >
      </div>
      <!--选词板-->
      <div v-if="mode === 'cn' && showDiction" class="main-keyboard">
        <div class="number-box select_cn">
          <div class="select_cn_main">
            <span
              class="item"
              :key="index"
              v-for="(item, index) in cn_list_str"
              @click="clickCN($event, item)"
            >
              {{ item }}
            </span>
          </div>
        </div>
        <div class="del-box">
          <keyDel></keyDel>
          <span
            class="key number blue"
            @[keyEvent]="Fanhui()"
            style="font-size: 36px"
            >返回</span
          >
          <span
            class="key key_hide number"
            style="margin-left: 0px"
            @[keyEvent]="HideKey"
          >
            <svg
              class="jp"
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
              v-if="equipmentType === 'pc'"
            >
              <path
                d="M390.94044445 560.84859262h97.39377777V463.45481485H390.94044445v97.39377777zM560.24177778 317.81925929H463.75822222v97.39377778h97.39377778V317.81925929z m-145.63555556 0H318.12266667v97.39377778h97.39377778V317.81925929z m291.27111111 0H609.39377778v97.39377778h97.39377777V317.81925929zM536.576 560.84859262h97.39377778V463.45481485H536.576v97.39377777zM268.97066667 317.81925929H172.48711111v97.39377778h97.39377778V317.81925929z m486.05866666 97.39377778h97.39377778V317.81925929H755.02933333v97.39377778z m145.63555556-243.02933334H123.33511111c-53.70311111 0-97.39377778 43.69066667-97.39377778 97.39377778V754.72592595c0 53.70311111 43.69066667 97.39377778 97.39377778 97.39377778h776.41955556c53.70311111 0 97.39377778-43.69066667 97.39377778-97.39377778V269.57748151c0-53.70311111-43.69066667-97.39377778-96.48355556-97.39377778z m48.24177778 582.54222222c0 26.39644445-21.84533333 48.24177778-48.24177778 48.24177778H123.33511111c-26.39644445 0-48.24177778-21.84533333-48.24177778-48.24177778V269.57748151c0-26.39644445 21.84533333-48.24177778 48.24177778-48.24177778h776.41955556c26.39644445 0 48.24177778 21.84533333 48.24177778 48.24177778l0.91022222 485.14844444zM682.21155555 560.84859262h97.39377778V463.45481485H682.21155555v97.39377777z m-388.66488888 145.63555556h436.90666666V609.0903704H293.54666667v97.39377778zM341.78844445 463.45481485H245.30488889v97.39377777h97.39377778V463.45481485z"
              />
            </svg>
            <span>
              {{ equipmentType === "pc" ? "隐藏" : "隐藏键盘" }}
              <template v-if="equipmentType === 'pc'">
                <br />
                <i style="display: block; transform: scaleX(2)">v</i>
              </template>
            </span>
          </span>
          <span
            class="key number blue"
            style="font-size: 36px; visibility: hidden"
            >英文</span
          >
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import AllKey from "./key";
// import Worker from "./index.worker.js";

let dict = {};
let doubleSpell = {};
let input = {};
export default {
  created() {
    // const that = this;
    if (window.screen.width < this.screen) {
      // 当前设备是移动设备
      this.equipmentType = "phone";
    }
    // this.worker = new Worker();
    // 注册监听函数，接收子线程消息
    // this.worker.onmessage = (event) => {
    //   let txtList = event.data.data;
    //   const array = Array.isArray(this.cn_list_str);
    //   const cn_input = event.data.cn_input;
    //   const method = event.data.method;
    //   if (cn_input) this.cn_input = cn_input;
    //   if (method === "setCn_input") {
    //     this.findChinese();
    //     return;
    //   }
    //   if (txtList?.length) {
    //     if (array) {
    //       this.cn_list_str = txtList;
    //     } else {
    //       let str = txtList.join("");
    //       this.cn_list_str = str + this.cn_list_str;
    //     }
    //   }
    // };
    let promiseList = [];
    if (this.singleDict) {
      const promise = import("@/" + this.singleDict).then((res) => {
        dict = res;
        Object.freeze(dict);
        // this.worker.postMessage({
        //   method: "init",
        //   data: dict,
        //   dataKey: "dict",
        // });
      });

      promiseList.push(promise);
    }
    if (this.manyDict) {
      const promise = import("@/" + this.manyDict).then((res) => {
        doubleSpell = res;
        Object.freeze(doubleSpell);
        // this.worker.postMessage({
        //   method: "init",
        //   data: doubleSpell,
        //   dataKey: "doubleSpell",
        // });
      });
      promiseList.push(promise);
    }

    Promise.all(promiseList)
      .then(() => {
        this.$emit("initResult", "success");
      })
      .catch((err) => {
        console.error("词库错误", err);
        this.$emit("initResult", "fail");
      });
  },
  mounted() {
    this.$nextTick(() => {
      this.inputBindKeyboard();
    });
  },
  components: {
    keyDel: {
      data() {
        return {
          interval: null,
          isIntervalDel: false,
        };
      },
      methods: {
        touchstartDel(e) {
          e.preventDefault();
          if (!this.interval) {
            e.currentTarget.style.background = "#d0d0d0";
            // e.currentTarget.classList.add(this.$parent.keyDownClass);
            this.interval = setInterval(() => {
              this.isIntervalDel = true;
              this.$parent.del(e);
            }, 100);
          }
        },
        touchendDel(e) {
          e.preventDefault();

          this.interval = clearInterval(this.interval);
          if (!this.isIntervalDel) {
            this.$parent.del(e);
          }
          e.currentTarget.style.background = "#fff";
          this.isIntervalDel = false;
        },
      },
      render() {
        let data = this.$parent.$data;
        let def_mode = data.def_mode;
        let className = "key def-del";
        let sWidth = "50";
        let sHeight = "50";
        if (
          !["cn", "en_cap", "en", "password"].includes(def_mode) ||
          data.showDiction
        ) {
          className = "key number num-del";
          sWidth = "65";
          sHeight = "65";
          if (data.showDiction) {
            sWidth = "75";
            sHeight = "75";
          }
        }
        return (
          <span
            class={className}
            onTouchend={this.touchendDel}
            onTouchstart={this.touchstartDel}
            onMouseup={this.touchendDel}
            onMousedown={this.touchstartDel}
          >
            <svg
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
              width={sWidth}
              height={sHeight}
            >
              <path d="M938.8 227.7H284.6L0.1 511.3l284.4 284.4v0.8h654.2c47.1 0 85.3-38.2 85.3-85.3V313c0.1-47.1-38.1-85.3-85.2-85.3z m-172.1 385l-40.2 40.2-100.6-100.6-100.6 100.6-40.2-40.2 100.6-100.6-100.6-100.5 40.2-40.2L625.9 472l100.6-100.6 40.2 40.2-100.6 100.5 100.6 100.6z" />
            </svg>
          </span>
        );
      },
    },
    fullTriangle: {
      functional: true,
      render() {
        // console.warn("h", h);
        return (
          <svg
            width="14"
            height="14"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M22.2692 6.98965C23.0395 5.65908 24.9605 5.65908 25.7309 6.98965L44.262 38.9979C45.0339 40.3313 44.0718 42 42.5311 42H5.4689C3.92823 42 2.96611 40.3313 3.73804 38.9979L22.2692 6.98965Z"
              fill="#fff"
              stroke="#fff"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        );
      },
    },
  },
  props: {
    manyDict: {
      type: String,
      default: "",
    },
    singleDict: {
      type: String,
      default: "",
    },
    screen: { type: Number, default: 700 },
    blurHide: { type: Boolean, default: true },
    EnterActiveClass: { type: String, default: "fadeInUp" },
    LeaveActiveClass: { type: String, default: "fadeOutDown" },
    showKeyboard: { type: Boolean, default: false },
    maxQuantify: { type: Number, default: 10 },
    transitionTime: { type: String, default: "0.3s" },
    keyUpClass: { type: String, default: "keyUp" },
    keyDownClass: { type: String, default: "keyDown" },
    inputEvent: null,
  },
  data() {
    return {
      show: this.showKeyboard,
      showDiction: false,
      equipmentType: "pc",
      input_top: 0,
      def_mode: "cn",
      old_mode: "",
      mainMode: "",
      cn_input: "",
      cn_list_str: [],
      l_min: 0,
      l_max: this.maxQuantify,
      cursorPosition: -1,
    };
  },
  watch: {
    inputEvent: function (val) {
      const showKeyboard = this.showKeyboard;
      let show = false;

      if (val && val.target && showKeyboard) {
        input = val.target;
        this.mode = val.mode || "cn";
        show = true;
        this.getCaretPosition(val.target);
      }
      this.show = show;
    },
    show: function (val) {
      if (!val) this.showDiction = false;
      this.$emit("changeShow", val);
    },
    showDiction: function () {
      this.initKeyColor();
    },
  },
  computed: {
    number_keys() {
      let list = AllKey.number || [];

      return list.filter((num) => {
        if (isNaN(Number(num))) return false;
        return true;
      });
    },
    keyEvent() {
      const equipmentType = this.equipmentType;
      let result = "mousedown";

      if (
        equipmentType === "phone" ||
        "ontouchstart" in document.documentElement
      ) {
        result = "touchstart";
      }

      return result;
    },
    previousStyleFn() {
      let result = {
        background: "#a7a7a7",
      };
      const l_min = this.l_min;
      if (l_min > 0) {
        result.background = "#344a5d";
      }
      return result;
    },
    nextPageStyleFn() {
      let result = {
        background: "#a7a7a7",
      };
      const cn_list_str = this.cn_list_str || [];

      const l_max = this.l_max;
      if (cn_list_str.length > l_max) {
        result.background = "#344a5d";
      }
      return result;
    },
    number_keys2() {
      let numKeyList = AllKey.number;
      let biaodianKeyList = AllKey.biaodian;

      let resultArray = numKeyList;
      if (["num", "id_card", "di_git"].includes(this.mode)) {
        if (!this.old_mode) {
          resultArray = numKeyList.map((key) => {
            if (["X", "."].includes(key) && this.mode === "num") {
              // if (key === "X") {
              //   return " ";
              // }
              return "";
            }
            if (["."].includes(key) && this.mode === "id_card") {
              return "";
            }
            if (["X", "."].includes(key) && this.mode === "di_git") {
              if (key === ".") {
                return "";
              }
              return ".";
            }
            return key;
          });
        }
      } else {
        resultArray = biaodianKeyList;
      }
      return resultArray;
    },
    letter_keys() {
      return this.mode === "en_cap" ? AllKey.cap_letter : AllKey.letter;
    },
    cut_cn_list() {
      if (this.cn_list_str) {
        const equipmentType = this.equipmentType;
        let result = this.cn_list_str.slice(this.l_min, this.l_max);
        if (equipmentType === "phone") result = this.cn_list_str;

        return result;
      }
      return [];
    },
    mode: {
      get() {
        return this.def_mode;
      },
      set(val) {
        if (JSON.stringify(dict) === "{}") {
          if (["cn", "password"].includes(val)) {
            val = "password";
          }
          this.mainMode = "noCn";
        }
        if (["password"].includes(val)) {
          this.mainMode = "noCn";
        }
        this.old_mode = this.def_mode;
        this.def_mode = val;
        if (val != "cn") {
          this.cn_list_str = [];
          this.cn_input = "";
        }
        this.initKeyColor();
        this.showDiction = false;
        this.$emit("changeMode", val);
      },
    },
  },
  methods: {
    initKeyColor() {
      this.$nextTick(() => {
        let keyDivList = document.querySelectorAll(
          ".my-keyboard .key:not([bindtouchendAndmouseup])"
        );

        let fn = function (e) {
          if (!Array.from(e.currentTarget.classList).includes("key_hide")) {
            e.currentTarget.style.background = "#fff";
          }
        };
        for (let item of keyDivList) {
          item.setAttribute("bindtouchendAndmouseup", "true");
          item.addEventListener("touchend", fn);
          item.addEventListener("touchmove", fn);
          item.addEventListener("mouseup", fn);
          item.addEventListener("mousemove", fn);
        }
      });
    },
    isShowDiction(e) {
      e.preventDefault();
      this.showDiction = true;
    },
    showNumberKey(key) {
      console.log("key", key);
      const def_mode = this.def_mode;

      if (def_mode === "num") {
        if ([".", "X"].includes(key)) {
          key = "";
        }
      }
      return key;
    },
    inputBindKeyboard() {
      const that = this;
      this.$nextTick(() => {
        //每个input添加事件
        const inputAll = document.querySelectorAll(
          "[keyboard='true']:not([bindkeyboard])"
        );
        inputAll.forEach((e) => {
          // if (e.dataset.mode) {
          e.setAttribute("bindkeyboard", "true");
          e.addEventListener("focus", that.showKeyBoardFn);
          e.addEventListener("click", () => {
            setTimeout(() => {
              // console.log("selectionStart", input.selectionStart);
            }, 100);
          });
          if (that.blurHide) {
            e.addEventListener("blur", () => {
              that.show = false;
            });
          }
          // }
        });
      });
    },
    setInputValue(key, type = "set") {
      let cursor = input.selectionStart;
      let tagName = input.tagName;

      let isContenteditable = !!input.getAttribute("contenteditable");
      let value = input.value;
      if (isContenteditable) {
        cursor = this.getCaretPosition(input);
        value = input.innerText;
      }
      if (type === "del") {
        if (cursor > 0) {
          let cursorEnd = input.selectionEnd;
          if (cursorEnd != cursor && tagName === "INPUT ") {
            value = value
              ?.split("")
              ?.filter((item, index) => {
                if (index < cursor || index >= cursorEnd) {
                  return item;
                }
              })
              ?.join("");
          } else {
            value = this.delStringLast(value, cursor);
            cursor -= 1;
          }
        }
      } else {
        value = this.insertString(value, key, cursor);
        if (key.charCodeAt(key) > 127 || key.charCodeAt(key) > 94) {
          cursor += key.length;
        } else {
          cursor += 1;
        }
      }

      if (isContenteditable) {
        input.innerText = value;
        let range = document.createRange();
        let sel = window.getSelection();
        range.setStart(input.childNodes[0], cursor);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        this.$emit("contenteditableInput", input.innerText);
      } else {
        input.value = value;
        input.selectionStart = cursor;
        input.selectionEnd = cursor;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    },
    getCaretPosition(element) {
      let carePos = 0,
        sel,
        range;

      if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
          range = sel.getRangeAt(0);

          if (range.commonAncestorContainer.parentNode == element) {
            carePos = range.endOffset;
            // console.log(range);
            if (
              range.commonAncestorContainer.length !=
              range.commonAncestorContainer.data.trim().length
            ) {
              carePos -= 1;
            }
          }
        }
      }

      this.cursorPosition = carePos;
      return carePos;
    },
    showKeyBoardFn(e) {
      this.mainMode = "";
      const showKeyboard = this.showKeyboard;
      if (showKeyboard) return;
      input = e.target;
      this.show = true;
      this.mode = e.target.dataset.mode || "cn";
      this.old_mode = "";
    },
    HideKey() {
      this.show = false;
      input.blur();
    },
    mousedown(e) {
      // console.log(input);
      e.preventDefault();
    },
    //点击按钮
    clickKey(e, key, pass) {
      e.preventDefault();
      e.stopImmediatePropagation();
      e.target.style.background = "#d0d0d0";
      if (input !== document.activeElement) return;

      if (this.mode === "cn" && !pass) {
        this.cn_input += key;
        const specialPinYin = ["u", "v", "i"].includes(
          this.cn_input.split("")[0]
        );
        if (specialPinYin) {
          if (!this.cn_list_str.length) {
            this.cn_list_str = [key];
          } else {
            const value = this.cn_list_str[0] + key;
            this.$set(this.cn_list_str, 0, value);
          }

          return;
        }
        this.findChinese("add", key);
      } else {
        this.setInputValue(key);
      }

      this.$emit("clickKey", key);
    },
    mergeChinese(strList) {
      let endList = [];
      strList.reduce((totalList, list) => {
        if (!totalList.length) return list;
        for (let i = 0; i < totalList.length; i++) {
          let t = totalList[i] || "";
          let l = list[i] || "";
          totalList[i] = t + l;
          if (totalList.length - 1 === i) {
            endList.push(list.slice(i + 1));
          }
        }

        return totalList;
      }, []);
      const list = strList.flat(2);
      return list; //list.concat(endList);
    },
    clickNumber(e, key) {
      if (
        !AllKey.number.find((k) => k === key) &&
        this.def_mode != "biaodian"
      ) {
        return;
      }

      if (input !== document.activeElement) return;
      e.preventDefault();
      e.target.style.background = "#d0d0d0";
      if (this.mode === "cn" && this.cn_input !== "") {
        let value = this.cut_cn_list[parseInt(key) - 1];
        if (!value) return;
        this.selectCN(value);
        this.setInputValue(value);
      } else {
        this.setInputValue(key);
      }

      this.$emit("clickNumber", key);
    },
    selectCN(text) {
      let strList = this.cn_input.split("'");

      // let pingYinList = [];
      if (strList.length === 1 || text.length >= strList.length) {
        this.cn_input = "";
        this.cn_list_str = [];
        this.l_min = 0;
        this.l_max = this.maxQuantify;
        return;
      }
      this.setCn_input(text);
      // this.worker.postMessage({
      //   method: "setCn_input",
      //   cn_input: this.cn_input,
      //   text,
      // });
    },
    setCn_input(text) {
      let cn_input = this.cn_input;
      const singleDict = dict;
      let itemList = [];
      for (let key in singleDict) {
        let value = singleDict[key];
        if (typeof value === "string") {
          let valueList = value.split("");
          let item = valueList.find((item) => item === text);
          if (item) {
            itemList.push(key);
          }
        }
      }
      let str = "";

      const cn_inputList = cn_input.split("'");
      for (let i = 0; i < cn_inputList.length; i++) {
        let item = cn_inputList[i];
        for (let key of itemList) {
          let list = key.split("");
          let count = 0;
          for (let k = 0; k < list.length; k++) {
            if (key.charAt(k) === item.charAt(k)) {
              count += 1;
              if (
                k === 0 &&
                item.length != key.length &&
                key.length > item.length
              ) {
                // 用于处理首单词缩写法
                str = item;
              }
            }
            if (count === list.length) {
              str = item;
            }
          }
        }
      }
      this.cn_input = cn_inputList.filter((item) => item != str).join("'");
      this.findChinese();
    },
    clickCN(e, text) {
      e.preventDefault();
      e.stopImmediatePropagation();
      this.showDiction = false;

      this.setInputValue(text);
      this.selectCN(text);

      this.$emit("clickCN", text);
    },
    findChinese(type, key) {
      // type = del key不需要传，type = add key必须要传
      this.l_min = 0;
      this.l_max = this.maxQuantify;
      const pinYinList = this.cn_input.split("'");
      let pinYin = pinYinList[pinYinList.length - 1];

      let re = new RegExp(`^${pinYin}\\w*`);
      let keys = Object.keys(dict)
        .filter((item) => {
          let strList = pinYin.split("");

          const temp = ["h", "o", "n", "a", "e"].includes(
            strList[strList.length - 1]
          );
          if (pinYin.length >= 2 && !temp) {
            if (item === pinYin) return true;
          } else {
            let result = re.test(item);
            return result;
          }
        })
        .sort();

      this.cn_list_str =
        keys.length > 1
          ? keys.reduce((a, b) => a + dict[b], "")
          : dict[keys[0]];

      if (!this.cn_list_str || (!this.cn_list_str.length && type === "del")) {
        this.cn_input = this.cn_input.replace(
          new RegExp(`(.*)${key}`),
          `$1'${key}`
        );
      }

      if (!this.cn_list_str && !Array.isArray(this.cn_list_str)) {
        this.cn_list_str = [];
      }

      keys = this.cn_input.split("'");

      if (keys.length >= 2) {
        this.cn_list_str = [];
        this.findDoubleSpell();
        // this.worker.postMessage({
        //   method: "search",
        //   key: this.cn_input,
        // });
      }
    },
    findDoubleSpell() {
      let cn_input = this.cn_input;
      let keys = cn_input.split("'");
      const partDict = doubleSpell[cn_input.charAt(0)];
      if (!partDict) return;
      if (["an"].includes(keys[keys.length - 1])) {
        let tempStr = keys[keys.length - 2];
        if (["n"].includes(tempStr.charAt(tempStr.length - 1))) {
          let newTempStr = tempStr.slice(0, tempStr.length - 1);
          keys = [
            newTempStr,
            tempStr.slice(tempStr.length - 1) + keys[keys.length - 1],
          ];
          cn_input = keys.join("'");
          this.cn_input = cn_input;
        }
      }

      let keyResult = Object.keys(partDict).filter((key) => {
        const keys = key.split("'");
        const cn_inputList = cn_input.split("'");
        const isLen = cn_inputList.length === keys.length;
        if (!isLen) return;
        let result = true;
        for (let i = 0; i < keys.length; i++) {
          if (keys[i].charAt(0) != cn_inputList[i].charAt(0)) {
            result = false;
          } else {
            const keyItemList = keys[i].split("");
            const strList = cn_inputList[i].split("");
            for (let j = 0; j < strList.length; j++) {
              if (!strList[j]) break;
              if (keyItemList[j] != strList[j]) {
                result = false;
              }
            }
          }
        }
        if (result && isLen) {
          return partDict[key];
        }
      });

      let strList = [];
      let singleDictList = [];
      const singleDict = dict;
      for (let key of keyResult) {
        let keyList = key.split("'");
        strList.push(partDict[key].split(","));
        for (let item of keyList) {
          // console.log('singleDict[item]', singleDict[item])
          if (singleDict[item]) {
            singleDictList.push(singleDict[item].split(""));
          }
        }
      }
      if (!keyResult.length && keys.length) {
        for (let item of keys) {
          if (singleDict[item]) {
            singleDictList.push(singleDict[item].split(""));
          }
        }
      }

      singleDictList = Array.from(new Set(singleDictList.flat(2)));
      strList = strList
        .flat(2)
        .sort((a, b) => {
          if (b.length > a.length) return -1;
        })
        .reverse();
      this.cn_list_str = strList.concat(singleDictList);
    },
    del(e) {
      e.stopImmediatePropagation();
      e.preventDefault();
      if (input !== document.activeElement) return;
      const showDiction = this.showDiction;
      if (this.mode === "cn" && this.cn_input !== "" && !showDiction) {
        this.cn_input = this.delStringLast(this.cn_input, this.cn_input.length);

        if (this.cn_input === "") {
          this.cn_list_str = [];
          return;
        }
        const specialPinYin = ["u", "v", "i"].includes(
          this.cn_input.split("")[0]
        );
        if (
          this.cn_list_str &&
          this.cn_list_str.length === 1 &&
          specialPinYin
        ) {
          this.cn_list_str = [this.cn_input];
          return;
        }
        let re = new RegExp(`^${this.cn_input}\\w*`);
        let keys = Object.keys(dict)
          .filter((key) => {
            const result = re.test(key);
            return result;
          })
          .sort();

        this.cn_list_str =
          (keys.length > 1
            ? keys.reduce((a, b) => a + dict[b], "")
            : dict[keys[0]]) || "".split("");

        this.findChinese("del");
        this.$emit("del", JSON.parse(JSON.stringify(this.cn_input)));
      } else {
        this.setInputValue(null, "del");
      }
    },
    /**字符串插入文字 */
    insertString(text, input, index) {
      let arrText = text.split("");
      arrText.splice(index, 0, input);
      return arrText.join("");
    },
    /**删除字符串的某个字符*/
    delStringLast(text, index) {
      if (index < 0) return;
      let arrText = text.split("");
      if (index > 0) {
        arrText[index - 1] = "";
      } else {
        arrText[index] = "";
      }

      arrText = arrText.filter((item) => item);
      const endIndex = arrText.length - 1;
      if (arrText[endIndex] === "'") {
        arrText[endIndex] = "";
      }
      let result = arrText.join("");

      return result;
    },
    cap_change() {
      if (this.mainMode === "noCn") {
        this.mode = this.mode === "en_cap" ? "password" : "en_cap";
        return;
      }
      this.mode = this.mode === "en_cap" ? "en" : "en_cap";
    },
    cn_change(mode) {
      if (this.mainMode === "noCn") {
        this.mode = mode === "en" ? "cn" : "en";
      } else {
        this.mode = mode;
      }
      this.cn_input = "";
      this.cn_list_str = [];
    },
    Fanhui() {
      if (this.showDiction) {
        this.showDiction = false;
        return;
      }

      if (["num", "biaodian"].includes(this.old_mode) || !this.old_mode) {
        this.mode = "cn";
        return;
      }

      this.mode = this.old_mode;
    },
    previous_page(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (this.l_min > 0) {
        this.l_min = this.l_min - this.maxQuantify;
        this.l_max = this.l_max - this.maxQuantify;
      }
    },
    next_page(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (this.cn_list_str.length > this.l_max) {
        this.l_min += this.maxQuantify;
        this.l_max += this.maxQuantify;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.keyUp {
}
.keyDown {
  background: #d0d0d0;
}
.keyboardTransition-enter-active,
.keyboardTransition-leave-active {
  max-height: 500px;
}
.keyboardTransition-enter,
.keyboardTransition-leave-to {
  max-height: 0px;
}

.disabled_key {
  background: #f2f2f2 !important;
  cursor: default !important;
  color: rgb(170, 170, 170);
  border-color: rgba(118, 118, 118, 0.3);
}
i {
  font-style: normal;
}
.num-del > svg {
  margin-top: -5px;
}
.def-del > svg {
  margin-top: 0px;
}
.hand-del > svg {
  margin-top: 0px;
}
.my-keyboard {
  position: fixed;
  left: 0px;
  z-index: 10;
  bottom: 0px;
  width: 100%;
  // min-width: 1024px;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  .pinyin,
  .select-list {
    > div {
      width: 100%;
      margin: 0 auto;
    }
    .item_main {
      width: 86%;
    }
  }
  .pinyin {
    // height: 30px;
    background: #fff;
    border: 1px solid rgba(209, 209, 209, 1);
    padding: 0 20px;
    text-align: left;
    > div span {
      font-size: 20px;
      line-height: 30px;
      font-weight: bold;
    }
  }
  .select-list {
    background: #fff;
    border: 1px solid rgba(209, 209, 209, 1);
    border-top: none;
    padding: 0 20px;
    text-align: left;
    > div {
      position: relative;
    }
    .select-text {
      cursor: pointer;
      line-height: 40px;
      font-size: 24px;
      font-weight: bold;
      & + .select-text {
        margin-left: 15px;
      }
    }
    .page {
      position: absolute;
      top: 0;
      right: 0px;
      width: 120px;
      height: 40px;
      .next {
        transform: scaleX(2) rotate(180deg);
      }
      > p {
        margin-top: 0px;
        margin-bottom: 0px;
        display: inline-block;
        text-align: center;
        transform: scaleX(2);
        width: 30px;
        height: 38px;
        line-height: 38px;
        background: #344a5d;
        color: #fff;
        border: 1px solid #d7d7d7;
        border-radius: 5px;
        cursor: pointer;
        &:active {
          background: #fff;
          color: #344a5d;
        }
        & + p {
          margin-left: 30px;
        }
      }
    }
  }

  .main-keyboard {
    padding: 0 14px;
    background: #e6e6e6;
    height: 305px;
    .key {
      height: 50px;
      line-height: 50px;
      font-size: 25px;
      font-weight: 700;
      width: 80px;
      background: #fff;
      display: inline-block;
      vertical-align: middle;
      border-radius: 8px;
      margin-top: 8px;
      box-shadow: 1px 1px 2px rgba(20, 20, 20, 0.3);
      margin-left: 10px;
      cursor: pointer;
      &:active {
        background: #d0d0d0;
      }

      // & + .key {
      //   margin-left: 10px;
      // }
    }

    .number-box {
      width: 720px;
      display: inline-block;
      vertical-align: middle;
    }
    .number {
      width: 210px;
      height: 65px;
      font-size: 46px;
      line-height: 65px;
    }
    .del-box {
      width: 260px;
      display: inline-block;
      vertical-align: middle;
      .key {
        margin-left: 0px;
      }
    }
    .hand-left-box {
      width: 155px;
      display: inline-block;
      vertical-align: middle;
      .key {
        margin-left: 0px;
        //margin-top: 20px;
        &:nth-of-type(1) {
          margin-top: 0px;
        }
      }
      > span {
        width: 140px;
      }
    }

    .cap_change {
      width: 140px;
      color: #fff;
      background: #344a5d;
      // &:active {
      //   background: #728fa8;
      // }
    }
    .key_hide {
      background: #d6d1d0;
      > .jp {
        height: 50px;
        display: inline-block;
        vertical-align: middle;
      }
      > span {
        padding-left: 10px;
        font-size: 18px;
        line-height: 18px;
        display: inline-block;
        vertical-align: middle;
      }
    }
    .blue {
      // color: #fff;
      width: 140px;
      // background: #ff9213; // #344a5d;
      &:active {
        // background: #728fa8;
      }
      .blue_default {
        font-size: 16px;
        font-weight: 500;
      }
    }
    .red {
      color: #fff;
      background: #f56c6c;
      &:active {
        background: #f89e9e;
      }
    }
    .space {
      width: 357px;
    }
  }
}

.no_del_box {
  .num {
    .number:nth-last-child(2) {
      width: 430px;
    }
  }
}
.pc {
  min-width: 1100px;
  .def-del {
    width: 140px !important;
  }
  .no_del_box {
    height: 333px !important;
  }
  .hide12key {
    height: 30px;
  }
}
.phone {
  .hide12key {
    height: 25px;
    svg {
      width: 30px;
      height: 30px;
    }
  }
  .select-list {
    white-space: nowrap;
    .item_main {
      overflow: auto;
      width: 91%;
      .select-text {
        font-size: 19px;
      }
    }
    .page {
      right: 17px;
      text-align: right;
      width: 0px;
      height: 0px;
      .next {
        width: 23px;
        height: 38px;
      }
    }
  }
  .no_del_box {
    height: 253px !important;
  }
  .main-keyboard {
    padding: 0px;
    height: 235px;
    margin-left: -8px;
    .select_cn {
      overflow: auto;
      width: 71% !important;
      height: 94%;
      background: #fff;
      margin-top: 7px;
      border-radius: 10px;
      .select_cn_main {
        display: flex;
        // height: 100%;
        flex-wrap: wrap;
        .item {
          height: 20px;
          padding: 10px;
          border-bottom: 1px solid;
          font-size: 19px;
          font-weight: bold;
        }
      }
    }
    .number-box {
      width: 75%;
      .number {
        font-size: 26px;
        width: 29%;
        height: 45px;
      }
    }
    .del-box {
      width: 25%;
      span {
        width: 80%;
      }
      .number {
        font-size: 20px;
      }
      .key_hide {
        width: 80% !important;

        span {
          margin-bottom: 2px;
          padding-left: 0px;
          font-size: 15px;
        }
      }
      .num-del {
        svg {
          width: 48%;
          height: 9%;
          margin-top: -26px;
          position: relative;
          top: 13px;
        }
      }
      .blue {
        font-size: 26px !important;
      }
    }
    .key {
      width: 8%;
      height: 18%;
      margin-left: 6px !important;
      line-height: 45px;
    }

    .letter {
      font-size: 24px;
    }
    .blue {
      width: 12%;
      font-size: 15px;
      .blue_default {
        font-size: 12px;
      }
    }
    ::v-deep .num-del {
      height: 45px;
      svg {
        height: 38px;
        margin-left: -3px;
        position: relative;
        top: 5px;
      }
    }
    ::v-deep .def-del {
      width: 12% !important;
      svg {
        margin-top: 6px;
        height: 31px;
        margin-left: -3px;
      }
    }

    .key_hide {
      width: 20% !important;
      span {
        padding-left: 0px;
        font-size: 15px;
      }
    }
    .case {
    }
    .space {
      width: 30%;
      font-size: 20px;
    }
  }
}
</style>
