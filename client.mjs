import socketIO from './components/socketIO.mjs'
import errorTable from './components/errorTable.mjs'

export default (controller, uri) => {
    let socket = socketIO.then(s => s(uri || ('https://api.' + location.host), {
        transports: ['websocket'],
    }));

    async function method(name, ...args){
        const res = await new Promise(r => {
            socket.then(s => s.emit('method', name, ...args, r))
        });
        if(res.type === 'error') throw new (errorTable[res.code])(res.message);
        else return res.result
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
