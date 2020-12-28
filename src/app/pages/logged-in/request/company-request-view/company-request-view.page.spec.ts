import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompanyRequestViewPage } from './company-request-view.page';

describe('CompanyRequestViewPage', () => {
  let component: CompanyRequestViewPage;
  let fixture: ComponentFixture<CompanyRequestViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyRequestViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyRequestViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
