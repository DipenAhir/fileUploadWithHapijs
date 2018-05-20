var fs = require('fs');
var Hapi = require('hapi');
var server = new Hapi.Server();

server.connection({
    port: 8080,
    routes: {
        cors: true
    }
});

server.route({
    method: 'POST',
    path: '/submit',
    config: {
        payload: {
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data'
        },
        handler: function (request, reply) {
            var data = request.payload;
            if (data.file) {
                var name = new Date().getTime() + "" + new Date().getTime() + ".jpg";
                var path = __dirname + "/uploads/" + name;
                var file = fs.createWriteStream(path);

                file.on('error', function (err) {
                    console.error(err)
                });
                data.file.pipe(file);
                data.file.on('end', function (err) {
                    var ret = {
                        path: path
                    }
                    console.log(ret)
                    reply(JSON.stringify(ret));
                })
            }
        }
    }
});

server.start(function () {
    console.log('info', 'Server running at: ' + server.info.uri);
});
