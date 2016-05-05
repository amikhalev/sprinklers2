import createLogger from './createLogger';
let log = createLogger('gpioStub');

let pins = [];

for (var i = 0; i <= 40; i++) {
  pins[i] = {
    direction: 'in',
    value: 0
  };
}

export function open(pin, direction, callback) {
  log.trace({method: 'open', pin, direction}, 'open');
  process.nextTick(callback);
}

export function write(pin, value, callback) {
  log.trace({method: 'write', pin, value}, 'write');
  pins[pin].value = value;
  process.nextTick(callback);
}

export function read(pin, callback) {
  log.trace({method: 'read', pin}, 'read');
  process.nextTick(() => callback(null, pins[pin].value));
}

export function close(pin, callback) {
  log.trace({method: 'close', pin}, 'close');
  process.nextTick(callback);
}
