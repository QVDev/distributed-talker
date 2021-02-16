var opt = { peers: ['https://gunptt.herokuapp.com/gun'], localStorage: false, radisk: false };
const gun = Gun(opt);

var sink;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const room = urlParams.get('room')
console.log(room);

gun.on("in", function(msg) {
    if (msg.roomId !== room) {
        return;
    }

    if (document.launchedContext == undefined) {
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
        roomId: room,
        data: data
    });
}