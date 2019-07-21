import socketIO from './components/socketIO-server.mjs'
import errorTable from './components/errorTable.mjs'

function errorParse(err){
    let i = 0;
    for(; i < errorTable.length; i++) if(err instanceof errorTable[i]) return i
}

export default (controller, port = 443) => {
    let io = socketIO(port, {
        serveClient: false,
    });

    function method(name, ...args){
        return new Promise(r => {
            io.emit('broadcast', name, ...args);
            r()
        })
    }

    io.on('connect', async socket => {
        const ctrlr = new (await controller)(socket);
        socket.on('method', async (name, ...args) => {
            const r = args.pop();
            if(ctrlr[name] && typeof ctrlr[name] === 'function'){
                try{
                    r({
                        type: 'success',
                        result: await ctrlr[name](...args),
                    })
                } catch(e){
                    r({
                        type: 'error',
                        code: errorParse(e),
                        message: e.message
                    })
                }
            }
        })
    });

    return new Proxy({}, {
        get(t, p){
            if(!t[p]) t[p] = method.bind(null, p);
            return t[p]
        },
        set(t, p, v){ return false },
    })
}
