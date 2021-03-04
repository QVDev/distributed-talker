var dataSocket;

function startReceiveAudio(room) {
    dataSocket = new WebSocket(`wss://de.meething.space/${room}`);
    dataSocket.binaryType = "arraybuffer";
    var sink;

    dataSocket.onopen = function(event) {
        console.log(event);
    };

    dataSocket.onmessage = function(msg) {
        let sender = new Float32Array(msg.data, 0, 3);
        if (sender[0] == uuid.toString().charAt(0) && sender[1] == uuid.toString().charAt(1) && sender[2] == uuid.toString().charAt(2)) {
            return
        }

        if (window.launchedContext == undefined || window.launchedContext == false) {
            return;
        }
        if (sink == undefined) {
            sink = new XAudioServer(CHANNELS, TO_SAMPLE_RATE, MIN_BUFFER_SIZE, MAX_BUFFER_SIZE, function(samplesRequested) {}, 0);
        }

        let buffer = new Float32Array(msg.data, 12, msg.data.length);

        sink.writeAudio(buffer);
        buffer = null;
    }
}

function stopReceiveAudio() {
    dataSocket.close();
}

function sendAudio(data) {
    if (window.room == undefined || dataSocket.readyState != dataSocket.OPEN) {
        return;
    }
    var id = new Float32Array(3);
    id[0] = uuid.toString().charAt(0);
    id[1] = uuid.toString().charAt(1);
    id[2] = uuid.toString().charAt(2);
    data = Float32Concat(id, data);
    dataSocket.send(data);
}

function Float32Concat(first, second) {
    var firstLength = first.length,
        result = new Float32Array(firstLength + second.length);

    result.set(first);
    result.set(second, firstLength);

    return result;
}