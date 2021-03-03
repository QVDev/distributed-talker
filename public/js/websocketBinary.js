var webSocket;
var sendedData;

function startWebsocket(room) {
    webSocket = new WebSocket(`wss://de.meething.space:443/${room}`);
    webSocket.binaryType = 'arraybuffer';
    var sink;

    webSocket.onopen = function(event) {
        console.log(event);
    };

    webSocket.onmessage = function(msg) {

        if (msg.data instanceof ArrayBuffer) {
            if (window.launchedContext == undefined || window.launchedContext == false) {
                return;
            }
            if (sink == undefined) {
                sink = new XAudioServer(CHANNELS, TO_SAMPLE_RATE, MIN_BUFFER_SIZE, MAX_BUFFER_SIZE, function(samplesRequested) {}, 0);
            }

            let buffer = new Float32Array(msg.data);
            if (buffer.entries == sendedData.entries()) {
                return;
            }
            sink.writeAudio(buffer);
            buffer = null;
            return;
        }
    }
}

function sendData(data) {
    if (window.room == undefined) {
        return;
    }
    webSocket.send(data)
    sendedData = data;
}