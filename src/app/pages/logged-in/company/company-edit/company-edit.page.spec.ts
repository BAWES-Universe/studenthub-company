import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompanyEditPage } from './company-edit.page';

describe('CompanyEditPage', () => {
  let component: CompanyEditPage;
  let fixture: ComponentFixture<CompanyEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
