// const obj = self.importScripts("/vocabulary.js")

self.addEventListener('message', (e) => {
    // console.log('子线程', e)

    const { method, dataKey } = e.data

    if (method === 'init') {
        self[dataKey] = Object.freeze(e.data.data)
        self.dataKey = dataKey
    }
    if (method === 'setCn_input') {
        setCn_input(e)
    }
    if (method === 'search') {
        console.time("searchDict");
        let { key } = e.data
        const doubleSpell = self.doubleSpell || {}

        let cn_input = key
        let keys = cn_input.split("'")
        const dict = doubleSpell[cn_input.charAt(0)]
        if (!dict) return

        if (["an"].includes(keys[keys.length - 1])) {
            let tempStr = keys[keys.length - 2];
            if (["n"].includes(tempStr.charAt(tempStr.length - 1))) {
                let newTempStr = tempStr.slice(0, tempStr.length - 1);
                keys = [
                    newTempStr,
                    tempStr.slice(tempStr.length - 1) + keys[keys.length - 1],
                ];
                cn_input = keys.join("'");
            }
        }

        let keyResult = Object.keys(dict).filter((key) => {
            const keys = key.split("'");
            const cn_inputList = cn_input.split("'");
            const isLen = cn_inputList.length === keys.length;
            if (!isLen) return
            let result = true
            for (let i = 0; i < keys.length; i++) {
                if (keys[i].charAt(0) != cn_inputList[i].charAt(0)) {
                    result = false
                } else {
                    const keyItemList = keys[i].split('')
                    const strList = cn_inputList[i].split('')
                    for (let j = 0; j < strList.length; j++) {
                        if (!strList[j]) break
                        if (keyItemList[j] != strList[j]) {
                            result = false
                        }
                    }
                }
            }
            if (result && isLen) {
                return dict[key];
            }
        });


        let strList = [];
        let singleDictList = []
        const singleDict = self.dict
        for (let key of keyResult) {
            let keyList = key.split("'")
            // console.log('dict[key]', dict[key])
            strList.push(dict[key].split(","));
            for (let item of keyList) {
                // console.log('singleDict[item]', singleDict[item])
                if (singleDict[item]) {
                    singleDictList.push(singleDict[item].split(""));
                }

            }
        }

        singleDictList = Array.from(new Set(singleDictList.flat(2)))
        strList = strList
            .flat(2)
            .sort((a, b) => {
                if (b.length > a.length) return -1;
            })
            .reverse();
        const result = strList.concat(singleDictList)
        console.timeEnd("searchDict");
        self.postMessage({ method: 'search', data: result, cn_input });
    }

}, false);

const setCn_input = function (e) {
    let { cn_input, text } = e.data
    const singleDict = self.dict
    let itemList = []
    for (let key in singleDict) {
        let value = singleDict[key]
        let valueList = value.split('')
        let item = valueList.find(item => item === text)
        if (item) {
            itemList.push(key)
        }
    }
    let str = ''
    const cn_inputList = cn_input.split("'")
    for (let i = 0; i < cn_inputList.length; i++) {
        let item = cn_inputList[i]
        for (let key of itemList) {
            let list = key.split('')
            for (let k = 0; k < list.length; k++) {
                if (key.charAt(k) === item.charAt(k)) {
                    str = item
                }
            }
        }
    }
    let result = cn_inputList.filter(item => item != str).join("'")

    self.postMessage({ method: 'setCn_input', cn_input: result });
}

// const findInitialCn = function (cn_input, data) {
//     console.time("for2");
//     let strList = [];
//     let count = 0
//     Object.keys(data).filter((key) => {
//         const keys = key.split("'");
//         let i = 0;
//         const bool = keys.every((item, index) => {
//             ++count
//             if (index === 0) {
//                 if (item.charAt(0) === cn_input.charAt(0)) {
//                     return true;
//                 }

//             } else {
//                 i += 2;
//                 if (item.charAt() === cn_input.charAt(i)) return true;
//             }
//         });
//         if (bool) {
//             strList.push(data[key]);
//         }

//     });
//     console.log('count', count, strList)
//     console.timeEnd("for2");
//     let keys = cn_input.split("'")
//     strList = strList.filter(item => item.length === keys.length);

//     return strList

// }