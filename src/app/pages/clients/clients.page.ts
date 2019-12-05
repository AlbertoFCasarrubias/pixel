import { Component, OnInit } from '@angular/core';
import {AlertController, LoadingController} from '@ionic/angular';
import {FirebaseService} from '../../services/firebase/firebase.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
})
export class ClientsPage implements OnInit {

  clients: any = [];
  loading: any;

  constructor(public alertController: AlertController,
              public loadingController: LoadingController,
              public firebaseService: FirebaseService,
              private router: Router) { }

  ngOnInit() {
    this.presentLoading();
    this.firebaseService.getClients()
      .subscribe(
        data => {
          this.clients = data;
          this.dismissLoading();
        },
        err => console.error('error get clients ', err));
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Cargando'
    });
    await this.loading.present();
  }

  dismissLoading() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }

  async presentAlertConfirm(header, message, client) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.firebaseService.deleteClient(client.id)
              .then(() => this.clients = this.clients.filter(m => m !== client.id))
              .catch(err => console.error('delete client ', err));
            ;
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }
      ]
    });

    await alert.present();
  }

  add(m: any = false) {
    this.router.navigate([m ? '/client/' + m.id : '/client']);
  }

  delete(m) {
    this.presentAlertConfirm('Cliente', `¿Seguro que deseas borrar al cliente ${m.name}?` , m);
  }

}
