# vue-virtual-keyboard

演示(词库较大请耐心等待) https://monaizi.github.io/vue-virtual-keyboard/

## 安装
```bash
yarn add vue-virtual-keyboard-cn

npm install vue-virtual-keyboard-cn

```
## 使用
### 局部使用
```
import keyboard from "vue-virtual-keyboard-cn/keyboardIndex.vue" 
```
### 全局注册
```
import keyboard from "vue-virtual-keyboard-cn"
Vue.use(keyboard) 然后使用 <vue-virtual-keyboard-cn></vue-virtual-keyboard-cn>;
```
<br/>

### 要想让键盘自动绑定上，input或textarea必须设置keyboard="true"属性
data-mode 默认不传是是中文，不传词库默认就是小写英文
### input属性

|  属性   | 说明  | 值 | 备注 
|  ----  | ----  | ---- | ---- |
| data-mode  | 键盘类型 | cn | 中文
| data-mode  | 键盘类型 | en_cap | 英文大写
| data-mode  | 键盘类型 | en | 英文小写
| data-mode  | 键盘类型 | num | 数字键盘
| data-mode  | 键盘类型 | biaodian | 符号键盘
| data-mode  | 键盘类型 | password | 密码键盘
| data-mode  | 键盘类型 | id_card | 身份证键盘
| data-mode  | 键盘类型 | di_git | 带小数点的数字键盘

### 词库在本项目的src/dict目录下
### 引用词库示例
比如我有个词库在 src/dict目录下：
```正确的引用<keyboard :singleDict="'dict/baseDict.json"'"></keyboard> ```

!!! 注意不要把多词汇词库传递给单词汇词库的属性
<br/>
### 词库介绍
|  属性   | 说明  | 备注 
|  ----  | ----  | ---- |
| baseDict.json  | 单词汇词库 | 基础词库
| address.json  | 多词汇词库 | 全国省市区地址(主要)和一些短词句词库
| chowder.json  | 多词汇词库 | 日常生活,成语,人名,全国省市区地址词库
<br/>
### 组件属性
|  属性   | 说明  | 值 | 备注 
|  ----  | ----  | ---- | ---- |
| singleDict  | 单词汇词库 |  baseDict.json | 要想使用汉字拼写功能此项必填
| manyDict  | 多词汇词库 |  请看词库介绍 | 可以根据不同场景使用不同的词库
| maxQuantify  | 显示选词个数 | Number | 默认 10
| showKeyboard  | 手动显示隐藏键盘 | true/false | 默认不需要自己手动传值
| inputEvent  | 手动传入可编辑的对象 | element | 用来处理可编辑元素
| blurHide  | 失去焦点是否自动隐藏键盘 | true/false | 
| transitionTime  | 键盘动画过渡时间 | String | 默认 '0.3s'
<br/>

### 组件事件
|  事件   | 说明  | 值 | 备注 
|  ----  | ----  | ---- | ---- |
| clickNumber  | 点击数字符号触发 | key | 
| clickKey  | 点击字母空格触发 | key | 
| del  | 点击删除触发 | key | 如果是中文，会返回当前的拼音
| changeMode  | 键盘类型改变时触发 | data-mode | 
| changeShow  | 键盘显示和隐藏触发 | true/false | 
| initResult  | 词库加载事件 | success/fail | 成功和错误都会返回对应的结果
| inputBindKeyboard  | 重新给input绑定键盘 |  | 使用：调用组件里面的inputBindKeyboard方法，例子：this.$refs.keyboard.inputBindKeyboard();
| contenteditableInput  | 更改可编辑元素是触发的事件 | value | 

