import { get } from './http.mjs'
const socketIOURL = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js';

function compileSocketIO(src){
    const compiledFunction = new Function('module', 'exports', src),
        module = { exports: {} };
    compiledFunction(module, module.exports);
    return module.exports
}

export default get(socketIOURL).then(compileSocketIO)
