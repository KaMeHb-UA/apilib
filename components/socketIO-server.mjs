import Module from 'module';
const require = Module.createRequire(import.meta.url);
const socketIO = require('socket.io');
export default socketIO
