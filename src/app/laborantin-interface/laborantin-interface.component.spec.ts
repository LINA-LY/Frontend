import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaborantinInterfaceComponent } from './laborantin-interface.component';

describe('LaborantinInterfaceComponent', () => {
  let component: LaborantinInterfaceComponent;
  let fixture: ComponentFixture<LaborantinInterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaborantinInterfaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaborantinInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
