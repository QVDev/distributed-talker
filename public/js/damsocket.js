var opt = { peers: ['https://gunptt.herokuapp.com/gun'], localStorage: false, radisk: false };
const gun = Gun(opt);

var sink;

gun.on("in", function(msg) {
    switch (msg.action) {
        case "join":
            joiner(msg.roomId);
            break;
        case "leave":
            leaver(msg.roomId);
            break;
        case "create":
            addRoom(msg.roomId, msg.roomDesc);
            break;
        case "audio":
            if (msg.roomId !== window.room || window.room == undefined) {
                addRoom(msg.roomId, msg.roomDesc);
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
            break;
    }
})

function send(data, action) {
    if (window.room == undefined) {
        return;
    }
    gun.on("out", {
        roomId: window.room,
        roomDesc: window.desc,
        data: data,
        action: action
    });
}