let _get;

if(typeof fetch === 'function'){
    _get = url => fetch(url).then(r => r.text());
} else if(typeof XMLHttpRequest !== 'undefined'){
    _get = url => new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.send();
        xhr.onreadystatechange = () => {
            if (xhr.readyState != 4) return;
            if (xhr.status != 200) reject(xhr.status + ': ' + xhr.statusText); else resolve(xhr.responseText)
        }
    })
} else {
    // Node.js?
    const protocolControllers = {
        http: import('http'),
        https: import('https'),
    };
    const isLink = RegExp.prototype.test.bind(/^https?:\/\//);
    const protocol = url => {
        if(isLink(url)){
            switch(url[4]){
                case 's': return 'https';
                case ':': return 'http';
            }
        } else throw new TypeError('there is no supported protocol')
    }
    _get = url => {
        return protocolControllers[protocol(url)].then(pc => new Promise((resolve, reject) => {
            pc.get(url, resp => {
                let data = '';
                resp.on('data', chunk => {
                    data += chunk;
                });
                resp.on('end', () => resolve(data));
            }).on('error', reject)
        }))
    }
}

export const get = _get
