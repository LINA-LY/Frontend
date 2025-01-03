import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompterenduComponent } from './compterendu.component';

describe('CompterenduComponent', () => {
  let component: CompterenduComponent;
  let fixture: ComponentFixture<CompterenduComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompterenduComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompterenduComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
