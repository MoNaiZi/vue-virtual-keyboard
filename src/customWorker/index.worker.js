// const obj = self.importScripts("/vocabulary.js")

self.addEventListener('message', (e) => {
    console.log('子线程', e)

    const { method } = e.data

    if (method === 'init') {
        self.data = e.data.data
    }
    if (method === 'search') {
        let { key } = e.data
        let result = ''
        key = key.replaceAll("'", "-")
        for (let item in self.data) {
            if (item === key) {
                result = self.data[item]
            }
        }

        let list = result.split(" ").filter(item => item)
        console.log('key', key, list)
        self.postMessage({ method: 'search', data: list });
    }

}, false);