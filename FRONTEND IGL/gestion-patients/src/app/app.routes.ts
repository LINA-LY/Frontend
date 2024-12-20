import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CreationDpiComponent } from './creation-dpi/creation-dpi.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },          
  { path: 'creation-dpi', component: CreationDpiComponent }, 
  { path: '', redirectTo: 'login', pathMatch: 'full' }, 
  { path: '**', redirectTo: 'login' }   
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
