import React from 'react';

import * as ZXing from "@zxing/library";

class BarcodeScanner extends React.Component {

    render() {
        return <video
            id="scanBarcode"
            width="100%"
        />
    }

    componentDidMount() {
        this.readBarcode();
    }

    readBarcode() {
        const codeReader = new ZXing.BrowserBarcodeReader(100);

        codeReader
            .getVideoInputDevices()
            .then(videoInputDevices => {
                if (videoInputDevices.length > 0) {
                    codeReader.decodeFromInputVideoDevice(undefined, 'scanBarcode').then((result) => {
                        this.props.onDetected(result);
                    }).catch((err) => {
                        console.log(err);
                    })
                }
            })

    }

}

export default BarcodeScanner;