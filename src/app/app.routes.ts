import {Routes} from '@angular/router';
import {PetComponent} from "./pages/pet/pet.component";
import {LandingPageComponent} from "./pages/landing-page/landing-page.component";
import {ConstructionComponent} from "./_partials/construction/construction.component";
import {LocalDecarbonisationComponent} from "./pages/local-decarbonisation/local-decarbonisation.component";
import {LocalDecabSingleTplComponent} from "./_partials/local-decab-single-tpl/local-decab-single-tpl.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {LoginComponent} from "./users/login/login.component";
import {authGuard} from "./_helpers/auth.guard";
import {RegisterComponent} from "./users/register/register.component";
import {RegistrationFormComponent} from "./users/register/registration-form/registration-form.component";

export const routes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'pet', component: PetComponent},
  {path: 'coming-soon', component: ConstructionComponent},
  {path:'local-decarbonisation', component:LocalDecarbonisationComponent},
  {path:'local-decarb-single',component:LocalDecabSingleTplComponent},
  {path:'login',component: LoginComponent},
  {path:'registration',component:RegistrationFormComponent},
  {path: 'dashboard', canActivate: [authGuard], children:[
      {path: '', component: DashboardComponent}
    ]
  },

  {path: '**', redirectTo: ''}
];
