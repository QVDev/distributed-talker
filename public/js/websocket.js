var webSocket = new WebSocket("wss://gunptt.herokuapp.com/gun");
var sink;

function uuidv4() {
    return new Date().getUTCMilliseconds();
}
var uuid = uuidv4();

webSocket.onopen = function(event) {
    // console.log(event);
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
            break;
            if (window.launchedContext == undefined || window.launchedContext == false) {
                return;
            }
            if (sink == undefined) {
                sink = new XAudioServer(CHANNELS, TO_SAMPLE_RATE, MIN_BUFFER_SIZE, MAX_BUFFER_SIZE, function(samplesRequested) {}, 0);
            }

            let buffer = new Float32Array(Object.values(msg.data));
            sink.writeAudio(buffer);
            buffer = null;
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
        action: action,
        uuid: uuid
    }));

    if (data !== null) {
        sendAudio(data);
    }
}