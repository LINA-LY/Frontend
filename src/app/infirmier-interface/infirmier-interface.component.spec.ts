import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfirmierInterfaceComponent } from './infirmier-interface.component';

describe('InfirmierInterfaceComponent', () => {
  let component: InfirmierInterfaceComponent;
  let fixture: ComponentFixture<InfirmierInterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfirmierInterfaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfirmierInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
