var webSocket = new WebSocket("wss://gunptt.herokuapp.com/gun");
var sink;

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
var uuid = uuidv4();

webSocket.onopen = function(event) {
    console.log(event);
};

webSocket.onmessage = function(event) {
    const msg = JSON.parse(event.data);
    if (!msg.action || msg.uuid == uuid) {
        return;
    }
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
            buffer = null;
            break;
    }
}

function send(data, action) {
    if (window.room == undefined) {
        return;
    }
    // console.log(data.length);
    webSocket.send(JSON.stringify({
        roomId: window.room,
        roomDesc: window.desc,
        data: data,
        action: action,
        uuid: uuid
    }));
}