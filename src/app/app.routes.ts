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
import {LiveChatTplComponent} from "./_partials/chat-dialog-tpl/live-chat-tpl/live-chat-tpl.component";
import {ChatDialogTplComponent} from "./_partials/chat-dialog-tpl/chat-dialog-tpl.component";
import {HeroComponent} from "./_partials/hero/hero.component";
import {ImportEnvirotrackComponent} from "./pages/envirotrack/import/import-envirotrack/import-envirotrack.component";
import {
  DataCaptureSpreadsheetFuelsComponent
} from "./pages/envirotrack/import/data-capture-spreadsheet-fuels/data-capture-spreadsheet-fuels.component";
import {EnvirotrackReportComponent} from "./pages/envirotrack/report/envirotrack-report/envirotrack-report.component";
import {
  EnvirotrackReportHeatmapComponent
} from "./pages/envirotrack/report/envirotrack-report-heatmap/envirotrack-report-heatmap.component";
import {
  EnvirotrackReportScatterComponent
} from "./pages/envirotrack/report/envirotrack-report-scatter/envirotrack-report-scatter.component";
import {
  EnvirotrackReportBarComponent
} from "./pages/envirotrack/report/envirotrack-report-bar/envirotrack-report-bar.component";
import {
  EnvirotrackReportAvgComponent
} from "./pages/envirotrack/report/envirotrack-report-avg/envirotrack-report-avg.component";
import {
  EnvirotrackReportPieComponent
} from "./pages/envirotrack/report/envirotrack-report-pie/envirotrack-report-pie.component";
import {
  EnvirotrackReportBase1Component
} from "./pages/envirotrack/report/envirotrack-report-base1/envirotrack-report-base1.component";
import {
  EnvirotrackReportDemandComponent
} from "./pages/envirotrack/report/envirotrack-report-demand/envirotrack-report-demand.component";
import {DasboardWidgetsComponent} from "./pages/dashboard/dasboard-widgets/dasboard-widgets.component";
import {NewsComponent} from "./pages/news/news.component";
import {EventsComponent} from "./pages/events/events.component";
import {ProjectInformationComponent} from "./pages/project-information/project-information.component";
import {PartnersComponent} from "./pages/partners/partners.component";
import {AdvisoryBoardComponent} from "./pages/project-information/advisory-board/advisory-board.component";
import {StakeholdersComponent} from "./pages/project-information/stakeholders/stakeholders.component";




export const routes: Routes = [

  {path: '', component: LandingPageComponent},
  {path:'home',component: LandingPageComponent},
  {path: 'pet', component: PetComponent},
  {path:'events',component:EventsComponent},
  {path: 'coming-soon', component: ConstructionComponent},
  {path: 'local-decarbonisation', component: LocalDecarbonisationComponent},
  {path: 'local-decarb-single', component: LocalDecabSingleTplComponent},
  {path:'project-information', component:ProjectInformationComponent},
  {path:'partners',component:PartnersComponent},
  {path:'advisory-board',component:AdvisoryBoardComponent},
  {path:'stakeholders',component:StakeholdersComponent},
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegisterComponent},
  {path:'dashboard',component:DashboardComponent, children: [
      {path: '', component: DasboardWidgetsComponent},
      {path: 'import', component: ImportEnvirotrackComponent},
      {path: 'fuel-data', component: DataCaptureSpreadsheetFuelsComponent},
      {path: 'report', component: EnvirotrackReportComponent},
      {path: 'heatmap', component: EnvirotrackReportHeatmapComponent},
      {path: 'scatter', component: EnvirotrackReportScatterComponent},
      {path: 'bar', component: EnvirotrackReportBarComponent },
      {path: 'pie', component: EnvirotrackReportPieComponent },
      {path: 'base1', component: EnvirotrackReportBase1Component },
      {path: 'avg', component: EnvirotrackReportAvgComponent },
      {path: 'demand', component: EnvirotrackReportDemandComponent },
    ]},
  {path:'chat',component: ChatDialogTplComponent},
  {path:'live-chat',component:LiveChatTplComponent},
  {
    path: 'envirotrack', children: [

    ]
  },
  {
    path: 'dashboard', canActivate: [authGuard], children: [
      {path: '', component: DashboardComponent}
    ]
  },

  {path: '**', redirectTo: ''}
];
