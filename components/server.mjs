import socketIO from './socketIO.mjs'

export default async controller => {
    const io = (await socketIO)();
}
