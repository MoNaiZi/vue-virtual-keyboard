// const obj = self.importScripts("/vocabulary.js")

self.addEventListener('message', (e) => {
    // console.log('子线程', e)

    const { method, dataKey } = e.data

    if (method === 'init') {
        self[dataKey] = e.data.data
        self.dataKey = dataKey
    }
    if (method === 'search') {
        let { key } = e.data
        const doubleSpell = self.doubleSpell
        let cn_input = key
        let keys = cn_input.split("'")
        let initial = keys.every((item) => item.length === 1);
        console.log("initial", initial);
        if (initial) {
            let strList = findInitialCn(cn_input);
            self.postMessage({ method: 'search', data: strList });
            return;
        }

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

        let re = new RegExp(`^${cn_input}\\w*`);

        let keyResult = Object.keys(doubleSpell).filter((key) => {
            const result = re.test(key);
            const keys = key.split("'");
            const cn_inputList = cn_input.split("'");
            const isLen = cn_inputList.length === keys.length;
            if (result && isLen) {
                return doubleSpell[key];
            }
        });

        let strList = [];
        for (let key of keyResult) {
            strList.push(doubleSpell[key].split(","));
        }

        strList = strList
            .flat(2)
            .sort((a, b) => {
                if (a.length > b.length) return -1;
            })
            .reverse();


        self.postMessage({ method: 'search', data: strList });
    }

}, false);

const findInitialCn = function (cn_input) {
    console.time("for2");
    const doubleSpell = self.doubleSpell
    let strList = [];
    Object.keys(doubleSpell).filter((key) => {
        const keys = key.split("'");
        let i = 0;
        const bool = keys.every((item, index) => {
            if (index === 0) {
                if (item.charAt(0) === cn_input.charAt(0)) return true;
            } else {
                i += 2;
                if (item.charAt() === cn_input.charAt(i)) return true;
            }
        });
        if (bool) {
            strList.push(doubleSpell[key]);
        }
    });

    let keys = cn_input.split("'")
    strList = strList.filter(item => item.length === keys.length);
    console.timeEnd("for2");
    return strList

}