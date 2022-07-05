<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Test Bluetooth Print</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Setup Bluetooth</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-item :color="topInfo.color">
        <ion-label class="ion-text-wrap"> {{ topInfo.text }} </ion-label>
      </ion-item>

      <section>
        <ion-item-group>
          <header>List and pick bluetooth print device</header>
          <ion-button color="primary" @click="listDevices"
            >List Bluetooth Devices</ion-button
          >
          <ion-item>
            <ion-select
              placeholder="Select Bluetooth Printer"
              v-model="selectedDevice"
            >
              <ion-select-option
                v-for="dev in btLists"
                :key="dev.id"
                :value="dev.id"
                >{{ dev.name }} - {{ dev.address }}</ion-select-option
              >
            </ion-select>
          </ion-item>
        </ion-item-group>
      </section>

      <section>
        <ion-item>
          <ion-label position="floating">Text to print</ion-label>
          <ion-textarea rows="6" v-model="txtTest"></ion-textarea>
        </ion-item>
      </section>

      <section>
        <ion-item>
          <ion-label position="floating">QR Code Text</ion-label>
          <ion-textarea v-model="qrTest"></ion-textarea>
        </ion-item>
      </section>

      <section>
        <ion-button color="success" @click="print">Test Print</ion-button>
        <ion-button color="danger" @click="disconnect"
          >Disconnect Bluetooth</ion-button
        >
      </section>

      <!-- <ExploreContainer name="Tab 1 page" /> -->
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonItemGroup,
  IonButton,
  IonTextarea,
  alertController,
  // IonIcon,
} from "@ionic/vue";

import { PrinterProvider } from "@/libs/printer";

// import ExploreContainer from '@/components/ExploreContainer.vue';

export default defineComponent({
  name: "Tab1Page",
  components: {
    // ExploreContainer,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonItemGroup,
    IonButton,
    IonTextarea,
    // IonIcon,
  },

  async mounted() {
    let isBTEnabled = await this.printer.isEnabled();
    this.topInfo.text = isBTEnabled
      ? "Press [List Bluetooth Device] and select active Printer"
      : "Bluetooth disabled, please enable first then try press [List Bluetooth Devices]";
  },

  data() {
    return {
      printer: new PrinterProvider(),
      btLists: null,
      topInfo: {
        color: "warning",
        text: "Standby",
      },
      selectedDevice: "",
      txtTest:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tellus sapien, aliquam id mattis et, pretium eu libero. In dictum mauris vel lorem porttitor, et tempor neque semper. Aliquam erat volutpat. Aliquam vel malesuada urna, a pulvinar augue. Nunc ac fermentum massa. Proin efficitur purus fermentum tellus fringilla, fringilla aliquam nunc dignissim. Duis et luctus tellus, sed ullamcorper lectus.",

      qrTest: "https://google.com",
    };
  },

  methods: {
    getEncodedData() {
      return this.printer.getEncodedData(this.txtTest, this.qrTest);
    },

    print() {
      this.printer.isConnected().then((res) => {
        if (res.success) {
          this.presentAlert("Printing...");
          this.printer.print(this.getEncodedData());
        } else {
          console.log("Try connect to printer...");
          this.printer.connect(this.selectedDevice).subscribe(
            () => {
              this.presentAlert("Printing...");
              this.printer.print(this.getEncodedData());
            },
            (error) => console.log(error)
          );
        }
      });
    },

    disconnect() {
      this.printer.disconnect().then((res) => {
        if (res.success) this.presentAlert("Bluetooth disconnected");
      });
    },

    listDevices() {
      this.printer.list().then((res) => {
        if (res.success) {
          console.log("berhasil:");
          this.btLists = res.result;
          this.topInfo.text =
            "Select correct Bluetooth printer device from list, then press [Test Print]";
        } else {
          console.log("gagal:");
          this.btLists = null;
          this.topInfo.text = res.result.message
            ? res.result.message
            : JSON.stringify(res.result);
        }
        console.log(JSON.stringify(res.result));
      });
    },

    async presentAlert(msg: string) {
      const alert = await alertController.create({
        header: "Alert",
        subHeader: "Important message",
        message: msg,
        buttons: ["OK"],
      });

      await alert.present();
    },
  },
});
</script>

<style scoped>
:root {
  --ion-safe-area-top: 20px;
  --ion-safe-area-bottom: 22px;
}

header {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  margin-bottom: 1.25em;
  text-transform: uppercase;
}

section {
  margin-top: 1em;
  margin-bottom: 2.5em;
}

section:not(.full-width),
.full-width > header {
  padding: 0 10px;
}
</style>
