import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';

import { Storage } from '@ionic/storage';
import { NavController, ToastController } from '@ionic/angular';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {
  
  nombreArchivo: string = 'registrosMapApp.csv';
  guardados: Registro[] = [];

  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private inAppbrowser: InAppBrowser,
    private file: File,
    private emailComposer: EmailComposer,
    private toastController: ToastController
  ) {
    this.obtenerRegistro();
  }

  async guardarRegistro( format: string, text: string ) {
    await this.obtenerRegistro();

    const nuevoRegistro = new Registro(format, text);
    this.guardados.unshift( nuevoRegistro );
    this.storage.set('registrosQrScanner', this.guardados);
    this.abrirRegistro(nuevoRegistro);
  }

  async obtenerRegistro() {
    this.guardados = (await this.storage.get('registrosQrScanner')) || [];
  }

  abrirRegistro( registro: Registro ) {
    this.navCtrl.navigateForward('/scan/history');
    switch(registro.type) {
      case 'http':
        this.inAppbrowser.create(registro.text, '_system');
        break;
      case 'geo':
        this.navCtrl.navigateForward(`/scan/history/map/${registro.text}`);
        break;
      default:
        this.presentToast(registro.text);
        break;
    }
  }

  enviarCorreo() {
    const arrTemp = [];
    const titulos = 'Tipo, Formato, Creado en, Texto\n';

    arrTemp.push( titulos );

    this.guardados.forEach( registro => {
      const linea = `${ registro.type }, ${ registro.format }, ${ registro.createdDate }${ registro.text.replace(',', ' ') }\n`;

      arrTemp.push( linea );
    });

    this.crearArchivoCsv( arrTemp.join('') );
  }

  crearArchivoCsv( text: string) {
    this.file.checkFile( this.file.dataDirectory, this.nombreArchivo )
      .then( existe => {
        console.log('Existe el archivo');
        return this.escribirEnArchivo( text );
      })
      .catch( error => {
        return this.file.createFile( this.file.dataDirectory, this.nombreArchivo, false)
          .then( creado => this.escribirEnArchivo( text ))
          .catch( error => console.log('No se pudo crear el archivo') );
      });
  }

  async escribirEnArchivo( text: string ) {
    await this.file.writeExistingFile( this.file.dataDirectory, this.nombreArchivo, text);

    const archivoPath = this.file.dataDirectory + this.nombreArchivo;

    this.sendEmail(archivoPath);
  }

  sendEmail( archivoPath: string) {
     const email = {
       to: 'root.luissoto@gmail.com',
      //  cc: 'erika@mustermann.de',
      //  bcc: ['john@doe.com', 'jane@doe.com'],
       attachments: [
        archivoPath
       ],
       subject: 'Backup de scan app',
       body: '¡ <strong>Hola mundo</strong> !',
       isHtml: true
     }
     
     // Send a text message using default options
     this.emailComposer.open(email);
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
