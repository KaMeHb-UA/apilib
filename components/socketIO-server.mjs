import Module from 'module';
let require;
if(Module.createRequire) require = Module.createRequire(import.meta.url); else {
    if(!Module.createRequireFromPath) throw new Error('There is no way to create legacy require function. Please check you are using supported node version. Minimum supported version: 10.12.0. Your version: ' + process.version + '. Aborting...');
    require = Module.createRequireFromPath(decodeURI(import.meta.url).slice(7))
}
const socketIO = require('socket.io');
export default socketIO
