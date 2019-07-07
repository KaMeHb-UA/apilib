import socketIO from './components/socketIO.mjs'

export default (controller, uri) => {
    let socket = socketIO.then(s => s(uri || ('https://api.' + location.host), {
        transports: ['websocket'],
    }));

    function method(name, ...args){
        return new Promise(r => {
            socket.then(s => s.emit('method', name, ...args, r))
        })
    }

    (async () => {
        const sio = await socket;
        const ctrlr = new (await controller)(sio);
        sio.on('broadcast', async (name, ...args) => {
            if(ctrlr[name] && typeof ctrlr[name] === 'function'){
                await ctrlr[name](...args)
            }
        })
    })();

    return new Proxy({}, {
        get(t, p){
            if(!t[p]) t[p] = method.bind(null, p);
            return t[p]
        },
        set(t, p, v){ return false },
    })
}
