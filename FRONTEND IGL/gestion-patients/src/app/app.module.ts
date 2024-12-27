import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

// Importation des composants
import { LoginComponent } from './login/login.component';
import { CreationDpiComponent } from './creation-dpi/creation-dpi.component';
import { DossierPatientComponent } from './dossier-patient/dossier-patient.component'; // Exemple
import { MedecinInterfaceStartComponent } from './medecin-interface-start/medecin-interface-start.component'; // Exemple

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CreationDpiComponent,
    DossierPatientComponent, // Ajoute ici ton composant
    MedecinInterfaceStartComponent, // Ajoute ici ton composant
  ],
  imports: [
    BrowserModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
