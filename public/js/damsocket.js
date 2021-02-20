var opt = { peers: ['https://gunptt.herokuapp.com/gun'], localStorage: false, radisk: false };
const gun = Gun(opt);

var sink;

gun.on("in", function(msg) {
    if ((msg.data.action !== null || msg.data.action !== undefined) && msg.data.action == "join") {
        joiner(msg.roomId);
    }

    if ((msg.data.action !== null || msg.data.action !== undefined) && msg.data.action == "leave") {
        leaver(msg.roomId);
    }

    if (msg.data == undefined || (window.room == undefined && msg.roomId && msg.roomDesc)) {
        addRoom(msg.roomId, msg.roomDesc);
        return;
    }

    if (msg.roomId !== window.room || window.room == undefined) {
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
    if (window.room == undefined) {
        return;
    }
    gun.on("out", {
        roomId: window.room,
        roomDesc: window.desc,
        data: data
    });
}