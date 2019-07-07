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
} else throw new Error('Cannot find any suitable http/https transport to download needed libs')

export const get = _get
