import socketIO from './socketIO.mjs'

export default async controller => {
    const io = (await socketIO)();
    io.on('connect', async socket => {
        const ctrlr = new (await controller)(socket);
        socket.on('method', (name, ...args) => {
            const r = args.pop();
        })
    })
}
