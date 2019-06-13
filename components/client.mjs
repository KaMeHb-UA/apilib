import socketIO from './socketIO.mjs'

export default async controller => {
    const socket = (await socketIO)();
}
