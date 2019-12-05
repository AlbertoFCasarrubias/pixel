import { Component, OnInit } from '@angular/core';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import {FirebaseService} from '../../services/firebase/firebase.service';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.page.html',
  styleUrls: ['./materials.page.scss'],
})
export class MaterialsPage implements OnInit {

  materials: any = [];
  loading: any;

  constructor(public alertController: AlertController,
              public loadingController: LoadingController,
              public firebaseService: FirebaseService,
              private router: Router) { }

  ngOnInit() {
    this.presentLoading();
    this.firebaseService.getMaterials()
      .subscribe(
        data => {
          this.materials = data;
          this.dismissLoading();
        },
        err => console.error('error get materials ', err));
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

  async presentAlertConfirm(header, message, material) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.firebaseService.deleteMaterial(material.id)
              .then(() => this.materials = this.materials.filter(m => m !== material.id))
              .catch(err => console.error('delete material ', err));
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

  addMaterial(m: any = false) {
    this.router.navigate([m ? '/material/' + m.id : '/material']);
  }

  deleteMaterial(m) {
    this.presentAlertConfirm('Material', `¿Seguro que deseas borrar el material ${m.name}?` , m);
  }

}
