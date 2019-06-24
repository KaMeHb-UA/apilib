import socketIO from './socketIO.mjs'

function uniqueFilter(value, index, self){ 
    return self.indexOf(value) === index
}

function constructorFilter(value){
    return value !== 'constructor'
}

export default controller => {
    const io = socketIO.then(s => s());
    let broadcastMethods;
    io.then(io => io.on('connect', async socket => {
        const ctrlr = new (await controller)(socket);
        const { broadcast } = ctrlr;
        if(typeof broadcast !== 'object') throw new Error((await controller).name || 'Controller' + '.broadcast must be an object');
        broadcastMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(broadcast)).concat(Object.getOwnPropertyNames(broadcast)).filter(constructorFilter).filter(uniqueFilter);
        socket.on('method', async (name, ...args) => {
            const r = args.pop();
            if(ctrlr[name] && typeof ctrlr[name] === 'function'){
                r(await ctrlr[name](...args))
            }
        });
    }));
    const res = {};
    broadcastMethods.forEach(name => {
        res[name] = (...data) => {
            (await io).emit('broadcast', ...data)
        }
    });
    return res
}
