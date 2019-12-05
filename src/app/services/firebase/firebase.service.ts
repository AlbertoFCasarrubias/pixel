import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { auth } from 'firebase/app';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  MATERIALS = 'materials';
  CLIENTS = 'clients';

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
      .pipe(map(actions => {
        return {
          id,
          ...actions
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
