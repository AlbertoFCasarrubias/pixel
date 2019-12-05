import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MaterialsPage } from './materials.page';

describe('MaterialsPage', () => {
  let component: MaterialsPage;
  let fixture: ComponentFixture<MaterialsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
