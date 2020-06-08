import { Component } from '@angular/core';

import { ToastController } from '@ionic/angular';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DataLocalService } from '../../services/data-local.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  slideOpt = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

  constructor(
    private barcodeScanner: BarcodeScanner,
    private dataLocalService: DataLocalService,
    private toastController: ToastController
  ) {}

  ionViewWillEnter() {
    this.scan();
  }

  scan() {
    this.barcodeScanner.scan()
      .then(barcodeData => {
        if(!barcodeData.cancelled) {
          this.dataLocalService.guardarRegistro( barcodeData.format, barcodeData.text );
        }
      }).catch(err => {
        this.presentToast('¡Ups! Algo falló, por favor vuelve a intentarlo.');
      });
  }

  async presentToast( message: string) {
    const toast = await this.toastController.create({
      duration: 2000,
      message,
      mode: 'ios',
      position: 'top'
    });
    toast.present();
  }

}
