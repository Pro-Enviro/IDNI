import { Routes } from '@angular/router';
import {PetComponent} from "./pages/pet/pet.component";
import {LandingPageComponent} from "./pages/landing-page/landing-page.component";
import {ConstructionComponent} from "./_partials/construction/construction.component";

export const routes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'pet', component: PetComponent},
  {path: 'coming-soon', component: ConstructionComponent},

  {path: '**', redirectTo: ''}
];
