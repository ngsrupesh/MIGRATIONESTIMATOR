import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MigrationFormComponent } from './components/migration-form/migration-form.component';

const routes: Routes = [
  { path: '', component: MigrationFormComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }