import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertController, LoadingController} from '@ionic/angular';
import {FirebaseService} from '../../services/firebase/firebase.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  client: any;
  form: FormGroup;
  itemForm: FormGroup;
  loading: any;

  items: FormArray;
  arrayItems: {
    pieces: any;
    width: any;
    height: any;
    total: any;
  }[];

  constructor(
    private formBuilder: FormBuilder,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public firebaseService: FirebaseService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.arrayItems = [];

    this.form = this.formBuilder.group({
      date: new FormControl(''),
      client: new FormControl(''),
      notes: new FormControl(''),
      items: this.formBuilder.array([this.createItem()])
    });

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.getClient(id);
    }
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      pieces: new FormControl(''),
      width: new FormControl(''),
      height: new FormControl('' ),
      areaTotal: new FormControl('' ),
      areaUnit: new FormControl('' )
    });
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

  removeItem() {
    const items = this.form.controls.item.value;
    this.arrayItems.pop();
    items.removeAt(items.length - 1);
  }

  addItemForm() {
    this.items = this.form.get('items') as FormArray;
    this.items.push(this.createItem());
  }

  updateTotal(item) {
    item.controls.areaTotal.patchValue(item.value.width * item.value.height * item.value.pieces);
    item.controls.areaUnit.patchValue(item.value.width * item.value.height);
    
    console.log(this.form);
  }

}
