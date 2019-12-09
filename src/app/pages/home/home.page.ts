import {Component, OnInit} from '@angular/core';
import {FirebaseService} from '../../services/firebase/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  orders: any = [];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.firebaseService.getOrders()
      .subscribe( data => {
        this.orders = data;
        console.log('orders ', this.orders);
      });
  }

}
