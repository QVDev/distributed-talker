var isStarted = false;

function initVisualizer() {
    if (isStarted == true) {
        return;
    }
    isStarted = true;

    // grab the mute button to use below

    var mute = document.querySelector('.mute');

    //set up the different audio nodes we will use for the app

    var analyser = audioContextHandle.createAnalyser();
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.85;


    // set up canvas context for visualizer

    var canvas = document.querySelector('.visualizer');
    var canvasCtx = canvas.getContext("2d");

    var intendedWidth = 75; //document.getElementById('room-grid').clientWidth;

    canvas.setAttribute('width', intendedWidth);

    var visualSelect = "frequencybars"; //;document.getElementById("visual");

    var drawVisual;

    //main block for doing the audio recording

    audioNode.connect(analyser);
    visualize();



    function visualize() {
        WIDTH = 75; //canvas.width;
        HEIGHT = 50; //canvas.height;


        var visualSetting = visualSelect; //.value;        

        if (visualSetting === "sinewave") {
            analyser.fftSize = 2048;
            var bufferLength = analyser.fftSize;
            var dataArray = new Uint8Array(bufferLength);

            canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

            var draw = function() {
                canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
                drawVisual = requestAnimationFrame(draw);

                analyser.getByteTimeDomainData(dataArray);

                // canvasCtx.fillStyle = 'rgb(200, 200, 200)';
                // canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

                canvasCtx.lineWidth = 2;
                canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

                canvasCtx.beginPath();

                var sliceWidth = WIDTH * 1.0 / bufferLength;
                var x = 0;

                for (var i = 0; i < bufferLength; i++) {

                    var v = dataArray[i] / 128.0;
                    var y = v * HEIGHT / 2;

                    if (i === 0) {
                        canvasCtx.moveTo(x, y);
                    } else {
                        canvasCtx.lineTo(x, y);
                    }

                    x += sliceWidth;
                }

                canvasCtx.lineTo(canvas.width, canvas.height / 2);
                canvasCtx.stroke();
            };

            draw();

        } else if (visualSetting == "frequencybars") {
            analyser.fftSize = 256;
            var bufferLengthAlt = analyser.frequencyBinCount;
            var dataArrayAlt = new Uint8Array(bufferLengthAlt);

            canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

            var drawAlt = function() {
                canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
                drawVisual = requestAnimationFrame(drawAlt);

                analyser.getByteFrequencyData(dataArrayAlt);

                // canvasCtx.fillStyle = 'rgb(0, 0, 0)';
                // canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

                var barWidth = (WIDTH / bufferLengthAlt) * 2.5;
                var barHeight;
                var x = 0;

                for (var i = 0; i < bufferLengthAlt; i++) {
                    barHeight = dataArrayAlt[i];

                    canvasCtx.fillStyle = 'rgb(50,' + (barHeight + 100) + ',50)';
                    canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

                    x += barWidth + 1;
                }
            };

            drawAlt();

        } else if (visualSetting == "off") {
            canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
            canvasCtx.fillStyle = "red";
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        }

    }

    // event listeners to change visualize and voice settings

    // visualSelect.onchange = function() {
    //     window.cancelAnimationFrame(drawVisual);
    //     visualize();
    // };

    // mute.onclick = voiceMute;

    // function voiceMute() {
    //     if (mute.id === "") {
    //         gainNode.gain.value = 0;
    //         mute.id = "activated";
    //         mute.innerHTML = "Unmute";
    //     } else {
    //         gainNode.gain.value = 1;
    //         mute.id = "";
    //         mute.innerHTML = "Mute";
    //     }
    // }
}