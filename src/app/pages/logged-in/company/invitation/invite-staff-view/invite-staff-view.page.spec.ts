import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InviteStaffViewPage } from './invite-staff-view.page';

describe('InviteStaffViewPage', () => {
  let component: InviteStaffViewPage;
  let fixture: ComponentFixture<InviteStaffViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteStaffViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InviteStaffViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
