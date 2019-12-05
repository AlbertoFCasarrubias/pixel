import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertController, LoadingController} from '@ionic/angular';
import {FirebaseService} from '../../../services/firebase/firebase.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-client',
  templateUrl: './client.page.html',
  styleUrls: ['./client.page.scss'],
})
export class ClientPage implements OnInit {

  client: any;
  form: FormGroup;
  loading: any;

  constructor(
    private formBuilder: FormBuilder,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public firebaseService: FirebaseService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: new FormControl('', Validators.compose([Validators.required])),
      email: new FormControl('', Validators.compose([Validators.email])),
      phone: new FormControl('' ),
      address: this.formBuilder.group({
        street: new FormControl(''),
        neighborhood: new FormControl(''),
        zip: new FormControl('' ),
        city: new FormControl('' ),
        country: new FormControl('México')
      })
    });

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.getClient(id);
    }
  }

  async presentAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          this.router.navigate(['/clients']);
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

  getClient(id) {
    this.presentLoading();
    this.firebaseService.getClient(id).subscribe(
      data => {
        this.client = data;
        this.form.controls.name.patchValue(this.client.name);
        this.form.controls.email.patchValue(this.client.email);
        this.form.controls.phone.patchValue(this.client.phone);
        this.form.controls.address.patchValue(this.client.address);
        this.form.addControl('id', new FormControl(this.client.id));
        this.dismissLoading();
      },
      err => console.error(err)
    );
  }

  submit(value) {
    this.presentLoading();
    if (this.client) {
      this.firebaseService
        .updateClient(value)
        .then(() => this.savedOK(value))
        .catch(err => this.saveError(err));
    } else {
      console.log('VALUE ', value);
      this.firebaseService
        .createClient(value)
        .then(() => this.savedOK(value))
        .catch(err => this.saveError(err));
    }
  }

  savedOK(value) {
    this.dismissLoading();
    this.presentAlert('Cliente', value.name + ' guardado correctamente.');
  }

  saveError(err) {
    this.dismissLoading();
    this.presentAlert('Cliente', err.toString());
  }

}
