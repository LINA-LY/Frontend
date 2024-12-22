import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { LaborantinComponent } from './laborantin.component';

describe('LaborantinComponent', () => {
  let component: LaborantinComponent;
  let fixture: ComponentFixture<LaborantinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LaborantinComponent],
      imports: [FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaborantinComponent);
    component = fixture.componentInstance;
    component.bilan = {
      glycemie: null,
      pression: null,
      cholesterol: null
    };
    component.currentDate = '01/01/2024'; // Par défaut pour tester
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the header information correctly', () => {
    const headerElements = fixture.debugElement.queryAll(By.css('.header-info div'));
    expect(headerElements.length).toBe(3);
    expect(headerElements[0].nativeElement.textContent).toContain('Date : 01/01/2024');
    expect(headerElements[1].nativeElement.textContent).toContain('Nom du patient : Jean Dupont');
    expect(headerElements[2].nativeElement.textContent).toContain('Laborantin : XXXXXX');
  });

  it('should update the bilan object when form inputs change', () => {
    const glycemieInput = fixture.debugElement.query(By.css('#glycemie')).nativeElement;
    glycemieInput.value = '100';
    glycemieInput.dispatchEvent(new Event('input'));

    const pressionInput = fixture.debugElement.query(By.css('#pression')).nativeElement;
    pressionInput.value = '120';
    pressionInput.dispatchEvent(new Event('input'));

    const cholesterolInput = fixture.debugElement.query(By.css('#cholesterol')).nativeElement;
    cholesterolInput.value = '200';
    cholesterolInput.dispatchEvent(new Event('input'));

    expect(component.bilan.glycemie).toBe(100);
    expect(component.bilan.pression).toBe(120);
    expect(component.bilan.cholesterol).toBe(200);
  });

  it('should call generateGraph when Générer Graphique is clicked', () => {
    spyOn(component, 'generateGraph');

    const graphButton = fixture.debugElement.query(By.css('.graph-btn')).nativeElement;
    graphButton.click();

    expect(component.generateGraph).toHaveBeenCalled();
  });

  it('should call onSubmit when Enregistrer le Bilan is clicked', () => {
    spyOn(component, 'onSubmit');

    const saveButton = fixture.debugElement.query(By.css('.save-btn')).nativeElement;
    saveButton.click();

    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should call cancel when Annuler is clicked', () => {
    spyOn(component, 'cancel');

    const cancelButton = fixture.debugElement.query(By.css('.cancel-btn')).nativeElement;
    cancelButton.click();

    expect(component.cancel).toHaveBeenCalled();
  });
});
