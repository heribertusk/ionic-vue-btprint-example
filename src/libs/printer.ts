import { BluetoothSerial } from "@awesome-cordova-plugins/bluetooth-serial";
import EscPosEncoder from "esc-pos-encoder-ionic";

export class PrinterProvider {

    private bluetoothSerial = BluetoothSerial
    private encoder = new EscPosEncoder()

    private successHandler = (response: any) => {
        return { success: true, result: response };
    }
    private errorHandler = (error: any) => {
        return { success: false, result: error };
    }

    async list() {
        return await this.isEnabled() ?
            this.bluetoothSerial.list().then(this.successHandler, this.errorHandler)
            : { success: false, result: { message: "Bluetooth is disabled" } };
    }

    async isEnabled() {
        let isEnabled = false
        return await this.bluetoothSerial.isEnabled()
            .then(() => {
                isEnabled = true;
                return isEnabled;
            })
            .catch(() => {
                isEnabled = false;
                return isEnabled;
            });
    }

    isConnected() {
        return this.bluetoothSerial.isConnected().then(this.successHandler, this.errorHandler)
    }

    connect(deviceAddress: string) {
        return this.bluetoothSerial.connect(deviceAddress);
    }

    disconnect() {
        return this.bluetoothSerial.disconnect().then(this.successHandler, this.errorHandler);
    }

    async print(encodedData: string) {
        await this.bluetoothSerial.write(encodedData).then((printStatus) => console.log(printStatus));
    }

    getEncodedData(txtTest: string, qrUrlTest: string) {
        return this.encoder
            .text(
                txtTest,
                0
            )
            .newline()
            .qrcode(qrUrlTest)
            .newline()
            .newline()
            .newline()
            .encode();
    }
}

