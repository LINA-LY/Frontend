import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedecinInterfaceStartComponent } from './medecin-interface-start.component';

describe('MedecinInterfaceStartComponent', () => {
  let component: MedecinInterfaceStartComponent;
  let fixture: ComponentFixture<MedecinInterfaceStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedecinInterfaceStartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedecinInterfaceStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
