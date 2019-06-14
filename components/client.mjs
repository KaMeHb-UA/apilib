import socketIO from './socketIO.mjs'

export default controller => {
    let socket = socketIO.then(s => s());

    function method(name, ...args){
        return new Promise(r => {
            socket.emit('method', name, ...args, r)
        })
    }

    (async () => {
        const sio = await socket;
        const ctrlr = new (await controller)(sio);
        sio.on('broadcast', (name, ...args) => {
            if(ctrlr[name] && typeof ctrlr[name] === 'function'){
                ctrlr[name](...args)
            }
        });
        sio.on('client_update', (name, ...args) => {
            if(ctrlr[name] && typeof ctrlr[name] === 'function'){
                ctrlr[name](...args)
            }
        });
    })();

    return new Proxy({}, {
        get(t, p){
            if(!t[p]) t[p] = method.bind(null, p);
            return t[p]
        },
        set(t, p, v){ return false },
    })
}
