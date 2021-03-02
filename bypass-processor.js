// Copyright (c) 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * A simple bypass node demo.
 *
 * @class BypassProcessor
 * @extends AudioWorkletProcessor
 */
class BypassProcessor extends AudioWorkletProcessor {

    constructor() {
        super();
        this.port.onmessage = (event) => {
            // Handling data from the node.
            console.log(event.data);
        };
        this.empty = [new Float32Array(128)];

    }

    // When constructor() undefined, the default constructor will be
    // implicitly used.

    process(inputs, outputs) {
        const input = inputs[0]
        const output = outputs[0]
        const bits = 12
        const downsampling = 1

        for (let channelIndex = 0; channelIndex < output.length; ++channelIndex) {
            for (let sampleIndex = 0; sampleIndex < output[channelIndex].length; ++sampleIndex) {

                if (!input[channelIndex]) return false

                // sample and hold: update last sample value every <downsample>th sample 
                if (sampleIndex % downsampling === 0) {
                    const step = Math.pow(0.5, bits)
                    this._lastSampleValue = step * Math.floor(input[channelIndex][sampleIndex] / step)
                }

                this.empty[channelIndex][sampleIndex] = this._lastSampleValue
            }
        }
        this.port.postMessage(this.input);

        return true
    }
}

registerProcessor('bypass-processor', BypassProcessor);