import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {AlertController, LoadingController} from '@ionic/angular';
import {FirebaseService} from '../../services/firebase/firebase.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import * as moment from 'moment';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  order: any;
  clients: any;
  materials: any;
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
    private location: Location,
    private formBuilder: FormBuilder,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public firebaseService: FirebaseService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.arrayItems = [];

    this.getInfo();

    this.form = this.formBuilder.group({
      date: new FormControl(moment().format('YYYY-MM-DD')),
      client: new FormControl(''),
      material: new FormControl(''),
      notes: new FormControl(''),
      items: this.formBuilder.array([this.createItem()])
    });

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      // this.getClient(id);
    }
  }

  getInfo() {
    const promises = [];
    this.presentLoading().then(()=>
    {
      promises.push(new Promise((resolve, reject) => {
        this.firebaseService.getClients()
          .subscribe(clients => {
              this.clients = clients;
              resolve(true);
            },
            err => {
              reject(false);
            });
      }));

      promises.push(new Promise((resolve, reject) => {
        this.firebaseService.getMaterials()
          .subscribe(materials => {
              this.materials = materials;
              resolve(true);
            },
            err => {
              reject(false);
            });
      }));

      Promise.all(promises)
        .then(() => {
          this.dismissLoading();
        })
        .catch(err => console.error(err));
    });
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      id: new FormControl(new Date().getTime()),
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

  submit(value) {
    this.presentLoading();
    if (this.order) {
      this.firebaseService
        .updateOrder(value)
        .then(() => this.savedOK(value))
        .catch(err => this.saveError(err));
    } else {
      this.firebaseService
        .createOrder(value)
        .then(() => this.savedOK(value))
        .catch(err => this.saveError(err));
    }
  }

  savedOK(value) {
    this.dismissLoading();
    this.presentAlert('Orden', 'Orden guardada correctamente.');
  }

  saveError(err) {
    this.dismissLoading();
    this.presentAlert('Cliente', err.toString());
  }

  removeItem(item) {
    this.items = this.form.get('items') as FormArray;
    const index = this.items.value.findIndex(i => i.id === item.value.id);
    this.items.removeAt(index);
  }

  addItemForm() {
    this.items = this.form.get('items') as FormArray;
    this.items.push(this.createItem());
  }

  updateTotal(item) {
    if(item.value.width && item.value.height && item.value.pieces){
      item.controls.areaTotal.patchValue(item.value.width * item.value.height * item.value.pieces);
      item.controls.areaUnit.patchValue(item.value.width * item.value.height);

      console.log(this.form);
    }
  }

  addClient(event){
    if(event.target.value.toLowerCase() === 'addclient')
    {
      this.router.navigate(['/client']);
      this.form.controls.client.patchValue('');
    }

  }

  addMaterial(event){
    if(event.target.value.toLowerCase() === 'addmaterial')
    {
      this.router.navigate(['/material']);
      this.form.controls.material.patchValue('');
    }

  }

}
