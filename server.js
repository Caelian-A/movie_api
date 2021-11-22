const http = require('http'),
url = require('url'),
fs = require('fs');

http.createServer((request, response) => {
  let addr = request.url,
  q = url.parse(addr, true),
  filepath = '';

  if (q.pathname.includes('documentation')) {
    filepath = (__dirname + '/documentation.html');
  } else {
    filepath = 'index.html';
  }
  fs.readFile(filepath, (err, data) => {
    if (err) {
      throw err;
    }

    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write(data);
    response.end();
  });

)}.listen(8080);

console.log('My Node test server is running on port 8080.');
