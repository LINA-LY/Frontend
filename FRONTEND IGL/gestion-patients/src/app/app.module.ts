import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { SharedModule } from './shared/shared.module';
import { CreationDpiComponent } from './creation-dpi/creation-dpi.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    CreationDpiComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
