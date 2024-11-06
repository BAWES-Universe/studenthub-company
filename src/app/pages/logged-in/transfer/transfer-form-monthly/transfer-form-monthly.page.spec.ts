import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TransferFormMonthlyPage } from './transfer-form-monthly.page';

describe('TransferFormMonthlyPage', () => {
  let component: TransferFormMonthlyPage;
  let fixture: ComponentFixture<TransferFormMonthlyPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferFormMonthlyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TransferFormMonthlyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
