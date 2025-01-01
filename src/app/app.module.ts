import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AuthService } from './services/auth.service';
import { FormsModule } from '@angular/forms'; 
import {CreateDpiComponent} from './creation-dpi/creation-dpi.component'
// Importation des composants
import { LoginComponent } from './login/login.component';
import { DossierPatientComponent } from './dossier-patient/dossier-patient.component'; 
import { MedecinInterfaceStartComponent } from './medecin-interface-start/medecin-interface-start.component'; // Exemple
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CreateDpiComponent,
    DossierPatientComponent, // Ajoute ici ton composant
    MedecinInterfaceStartComponent, // Ajoute ici ton composant
  ],

  imports: [
    BrowserModule,
    SharedModule,
    FormsModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot(),
  ],
 
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
