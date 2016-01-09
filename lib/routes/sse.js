import {EventEmitter} from 'events';

var instance;

class SSE extends EventEmitter {
  constructor() {
    super();
  }

  route = (req, res) => {
    let eventCount = 0;

    function send(data, type) {
      if (type) {
        res.write(`event: ${type}\n`);
      }
      res.write(`id: ${eventCount++}\n`);
      res.write(`data: ${data}\n\n`);
    }

    this.addListener('send', send);
    res.setTimeout(0);
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write('\n');

    req.on('close', () => this.removeListener('send', send));
  };

  send(data, type) {
    this.emit('send', JSON.stringify(data), type);
  }
}

export default new SSE();
