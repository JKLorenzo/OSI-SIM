import Host from './devices/host.js';
import Cable from './modules/cable.js';

const host1 = new Host('192.168.1.10', '13:21:12:af:ac:12');
const host2 = new Host('192.168.1.20', 'ac:15:fa:sf:51:ab');
const host3 = new Host('192.168.1.30', 'ab:32:df:f1:d1:3c');

const cable12 = new Cable();
const cable13 = new Cable();
const cable23 = new Cable();

host1.connect(cable12);
host1.connect(cable13);

host2.connect(cable12);
host2.connect(cable23);

host3.connect(cable13);
host3.connect(cable23);

await host1.send('192.168.1.20', 'ping');
console.log('-----------------------------------------------');
await host2.send('192.168.1.10', 'pong');
console.log('-----------------------------------------------');
await host1.send('192.168.1.30', 'ping');
console.log('-----------------------------------------------');
await host3.send('192.168.1.10', 'pong');
console.log('-----------------------------------------------');
await host1.send('192.168.1.20', 'ping');
console.log('-----------------------------------------------');
await host2.send('192.168.1.10', 'pong');

(function wait() {
  setTimeout(wait, 10000);
})();
