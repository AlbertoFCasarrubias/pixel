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

  constructor(public afs: AngularFirestore,
              public afAuth: AngularFireAuth) { }

  // Materials
  createMaterial(value) {
    return this.afs.collection(this.MATERIALS)
      .add({
        name: value.name,
        quantity: value.quantity
      });
  }

  updateMaterial(value) {
    return this.afs.collection(this.MATERIALS)
      .doc(value.id)
      .set({
        name: value.name,
        quantity: value.quantity
      });
  }

  getMaterials() {
    return this.afs.collection(this.MATERIALS).valueChanges({ idField: 'id' });
  }

  getMaterial(id) {
    return this.afs.doc(`materials/${id}`)
      .valueChanges()
      .pipe(map(actions => {
        return {
          id,
          ...actions
        };
      }));
  }

  deleteMaterial(id) {
    return this.afs.collection(this.MATERIALS)
      .doc(id)
      .delete();
  }
}
