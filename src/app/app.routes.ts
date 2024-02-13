import { Routes } from '@angular/router';
import {PetComponent} from "./pages/pet/pet.component";
import {LandingPageComponent} from "./pages/landing-page/landing-page.component";
import {ConstructionComponent} from "./_partials/construction/construction.component";
import {LocalDecarbonisationComponent} from "./pages/local-decarbonisation/local-decarbonisation.component";
import {LocalDecabSingleTplComponent} from "./_partials/local-decab-single-tpl/local-decab-single-tpl.component";
import {LogInTplComponent} from "./_partials/log-in-tpl/log-in-tpl.component";
import {RegistrationFormComponent} from "./pages/registration-form/registration-form.component";

export const routes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'pet', component: PetComponent},
  {path: 'coming-soon', component: ConstructionComponent},
  {path:'local-decarbonisation', component:LocalDecarbonisationComponent},
  {path:'local-decarb-single',component:LocalDecabSingleTplComponent},
  {path:'login',component:LogInTplComponent},
  {path:'registration',component:RegistrationFormComponent},
  {path: '**', redirectTo: ''}
];
