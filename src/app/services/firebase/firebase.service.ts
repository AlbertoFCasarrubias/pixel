import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { auth } from 'firebase/app';
import {map, mergeMap, switchMap} from 'rxjs/operators';
import {combineLatest, forkJoin, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  MATERIALS = 'materials';
  CLIENTS = 'clients';
  ORDERS = 'orders';

  constructor(public afs: AngularFirestore,
              public afAuth: AngularFireAuth) { }

  // Materials
  createMaterial(value) {
    return this.create(this.MATERIALS, value);
  }

  updateMaterial(value) {
    return this.update(this.MATERIALS, value);
  }

  getMaterials() {
    return this.getAll(this.MATERIALS);
  }

  getMaterial(id) {
    return this.getById(this.MATERIALS, id);
  }

  deleteMaterial(id) {
    return this.delete(this.MATERIALS, id);
  }

  // Clients
  createClient(value) {
    return this.create(this.CLIENTS, value);
  }

  updateClient(value) {
    return this.update(this.CLIENTS, value);
  }

  getClients() {
    return this.getAll(this.CLIENTS);
  }

  getClient(id) {
    return this.getById(this.CLIENTS, id);
  }

  deleteClient(id) {
    return this.delete(this.CLIENTS, id);
  }

  // Orders
  createOrder(value) {
    return this.create(this.ORDERS, value);
  }

  updateOrder(value) {
    return this.update(this.ORDERS, value);
  }

  getOrders() {
    console.log('get orders');
    return this.afs.collection(this.ORDERS).valueChanges({ idField: 'id' })
      .pipe(
        map( orders =>
        {
          new Promise((resolve, reject) => {
            orders.forEach( order => {

              const all = combineLatest(
                this.afs.doc(`${this.CLIENTS}/${order['client']}`).valueChanges(),
                this.afs.doc(`${this.MATERIALS}/${order['material']}`).valueChanges()
              ).pipe(map(([client, material]) => {
                client['id'] = order['client'];
                material['id'] = order['material'];
                return {client, material};
              }));

              all.subscribe(data => {
                order['client'] = data.client;
                order['material'] = data.material;

                order['total'] = {};
                order['total']['pieces'] = order['items'].map(i => i.pieces).reduce((a, b) => a + b , 0);
                order['total']['width'] = order['items'].map(i => i.width).reduce((a, b) => a + b , 0);
                order['total']['height'] = order['items'].map(i => i.height).reduce((a, b) => a + b , 0);
                order['total']['areaUnit'] = order['items'].map(i => i.areaUnit).reduce((a, b) => a + b , 0);
                order['total']['areaTotal'] = order['items'].map(i => i.areaTotal).reduce((a, b) => a + b , 0);

                resolve(order);
              });
            });
          });


          return orders;
        })
      );
  }


  getOrder(id) {
    return this.getById(this.ORDERS, id);
  }

  deleteOrder(id) {
    return this.delete(this.ORDERS, id);
  }

  // FIREBASE CALLS
  private create(collection, value) {
    return this.afs.collection(collection)
      .add(value);
  }

  private delete(collection, id) {
    return this.afs.collection(collection)
      .doc(id)
      .delete();
  }

  private getById(collection, id) {
    return this.afs.doc(`${collection}/${id}`)
      .valueChanges()
      .pipe(map(doc => {
        return {
          id,
          ...doc
        };
      }));
  }

  private getAll(collection) {
    return this.afs.collection(collection).valueChanges({ idField: 'id' });
  }

  private update(collection, value) {
    const id = value.id;
    delete( value.id);

    return this.afs.collection(collection)
      .doc(id)
      .set(value);
  }

}
