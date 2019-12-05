import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {FirebaseService} from '../firebase/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private firebaseService: FirebaseService,
              public afAuth: AngularFireAuth) { }

  doRegister(value)
  {
    return new Promise<any>((resolve, reject) => {
      firebase.auth()
        .createUserWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err));
    });
  }

  doLogin(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err))
    })
  }

  doLogout(){
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signOut()
        .then(() => {
          // this.firebaseService.unsubscribeOnLogOut();
          resolve();
        }).catch((error) => {
        reject();
      });
    })
  }

  doChangePassword()
  {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail('alberto@chukan.net')
        .then(
          res => resolve(res),
          err => reject(err));
    });
  }
}
