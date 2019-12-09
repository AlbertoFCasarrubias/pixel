import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {AlertController, LoadingController} from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import {RoutingService} from '../../../services/routing/routing.service';

@Component({
  selector: 'app-material',
  templateUrl: './material.page.html',
  styleUrls: ['./material.page.scss']
})
export class MaterialPage implements OnInit {
  material: any;
  form: FormGroup;
  loading: any;

  constructor(
    private formBuilder: FormBuilder,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public firebaseService: FirebaseService,
    private activatedRoute: ActivatedRoute,
    private routingService: RoutingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: new FormControl('', Validators.compose([Validators.required])),
      quantity: new FormControl('')
    });

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.getMaterial(id);
    }
  }

  async presentAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          if (this.routingService.getPreviousUrl() === '/order') {
            this.router.navigate(['/order']);
          }
          else {
            this.router.navigate(['/materials']);
          }
        }
      }]
    });

    await alert.present();
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

  getMaterial(id) {
    this.presentLoading();
    this.firebaseService.getMaterial(id).subscribe(
      data => {
        this.material = data;
        this.form.controls.name.patchValue(this.material.name);
        this.form.controls.quantity.patchValue(this.material.quantity);
        this.form.addControl('id', new FormControl(this.material.id));
        this.dismissLoading();
      },
      err => console.error(err)
    );
  }

  submit(value) {
    this.presentLoading();
    if (this.material) {
      this.firebaseService
        .updateMaterial(value)
        .then(() => this.savedOK(value))
        .catch(err => this.saveError(err));
    } else {
      this.firebaseService
        .createMaterial(value)
        .then(() => this.savedOK(value))
        .catch(err => this.saveError(err));
    }
  }

  savedOK(value){
    this.dismissLoading();
    this.presentAlert('Material', value.name + ' guardado correctamente.');
  }

  saveError(err){
    this.dismissLoading();
    this.presentAlert('Material', err.toString());
  }
}
