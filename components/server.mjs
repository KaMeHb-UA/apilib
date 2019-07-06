import socketIO from './socketIO.mjs'

export default controller => {
    let io = socketIO.then(s => s());

    function method(name, ...args){
        return new Promise(r => {
            io.then(s => s.emit('broadcast', name, ...args));
            r()
        })
    }

    io.then(io => io.on('connect', async socket => {
        const ctrlr = new (await controller)(socket);
        socket.on('method', async (name, ...args) => {
            const r = args.pop();
            if(ctrlr[name] && typeof ctrlr[name] === 'function'){
                r(await ctrlr[name](...args))
            }
        })
    }));

    return new Proxy({}, {
        get(t, p){
            if(!t[p]) t[p] = method.bind(null, p);
            return t[p]
        },
        set(t, p, v){ return false },
    })
}
