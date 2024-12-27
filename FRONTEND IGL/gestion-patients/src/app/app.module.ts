import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { InfirmierModule } from './infirmier/infirmier.module';  // Importation du module Infirmier

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    InfirmierModule,  // Ajoute le module infirmier ici
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
