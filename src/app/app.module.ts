import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Importez BrowserAnimationsModule
import { ToastrModule } from 'ngx-toastr'; // Importez ToastrModule

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AuthService } from './services/auth.service';
import { CreateDpiComponent } from './creation-dpi/creation-dpi.component';
import { LoginComponent } from './login/login.component';
import { DossierPatientComponent } from './dossier-patient/dossier-patient.component';
import { MedecinInterfaceStartComponent } from './medecin-interface-start/medecin-interface-start.component';
import { authInterceptor } from './auth.interceptor';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { BilanComponent } from './bilan/bilan.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CreateDpiComponent,
    DossierPatientComponent,
    MedecinInterfaceStartComponent,
    BilanComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    CommonModule,
    FormsModule,
    BrowserAnimationsModule, // Ajoutez BrowserAnimationsModule
    ToastrModule.forRoot({ // Configurez ToastrModule
      timeOut: 3000, // Durée d'affichage des notifications (en ms)
      positionClass: 'toast-top-right', // Position des notifications
      preventDuplicates: true, // Empêche les notifications en double
    }),
    RouterModule.forRoot(routes),
  ],
  providers: [provideHttpClient(withFetch()) // Enregistrez l'intercepteur
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
