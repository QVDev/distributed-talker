var opt = { peers: ['https://gunptt.herokuapp.com/gun'], localStorage: false, radisk: false };
const gun = Gun(opt);

var sink;

gun.on("in", function(msg) {
    if (msg.roomId !== window.room) {
        return;
    }

    if (window.launchedContext == undefined || window.launchedContext == false) {
        return;
    }
    if (sink == undefined) {
        sink = new XAudioServer(1, 8000, 320, 512, function(samplesRequested) {}, 0);
    }

    let buffer = new Float32Array(Object.values(msg.data));
    sink.writeAudio(buffer);
})

function send(data) {
    gun.on("out", {
        roomId: window.room,
        data: data
    });
}