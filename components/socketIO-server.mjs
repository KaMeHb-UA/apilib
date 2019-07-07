import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const socketIO = require('socket.io');
export default socketIO
