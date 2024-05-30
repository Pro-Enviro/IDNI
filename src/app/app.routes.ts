import {Routes} from '@angular/router';
import {LoginComponent} from "./users/login/login.component";
import {authGuard} from "./_helpers/auth.guard";
import {ImportEnvirotrackComponent} from "./pages/envirotrack/import/import-envirotrack/import-envirotrack.component";
import {DataCaptureSpreadsheetFuelsComponent} from "./pages/envirotrack/import/data-capture-spreadsheet-fuels/data-capture-spreadsheet-fuels.component";
import {EnvirotrackReportComponent} from "./pages/envirotrack/report/envirotrack-report/envirotrack-report.component";
import {EnvirotrackReportHeatmapComponent} from "./pages/envirotrack/report/envirotrack-report-heatmap/envirotrack-report-heatmap.component";
import {EnvirotrackReportScatterComponent} from "./pages/envirotrack/report/envirotrack-report-scatter/envirotrack-report-scatter.component";
import {EnvirotrackReportBarComponent} from "./pages/envirotrack/report/envirotrack-report-bar/envirotrack-report-bar.component";
import {EnvirotrackReportAvgComponent} from "./pages/envirotrack/report/envirotrack-report-avg/envirotrack-report-avg.component";
import {EnvirotrackReportPieComponent} from "./pages/envirotrack/report/envirotrack-report-pie/envirotrack-report-pie.component";
import {EnvirotrackReportBase1Component} from "./pages/envirotrack/report/envirotrack-report-base1/envirotrack-report-base1.component";
import {EnvirotrackReportDemandComponent} from "./pages/envirotrack/report/envirotrack-report-demand/envirotrack-report-demand.component";
import {DasboardWidgetsComponent} from "./pages/dashboard/dasboard-widgets/dasboard-widgets.component";
import {PetLoginProtected} from "./pages/pet-login-protected/pet-login-protected.component";
import {TypeChartComponent} from "./pages/envirotrack/report/type-chart/type-chart.component";
import {ScopeChartComponent} from "./pages/envirotrack/report/scope-chart/scope-chart.component";
import {GenerateReportComponent} from "./pages/reports/generate-report/generate-report.component";
import {AppComponent} from "./app.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {RegisterSuccessPageComponent} from "./users/register/register-success-page/register-success-page.component";
import {ForgotPasswordComponent} from "./users/forgot-password/forgot-password.component";

import {ResetPasswordComponent} from "./users/reset-password/reset-password.component";

import {BugReportComponent} from "./pages/help/bug-report/bug-report.component";
import {FaqsComponent} from "./pages/help/faqs/faqs.component";
import {ContactUsComponent} from "./pages/help/contact-us/contact-us.component";



export const routes: Routes = [
  {path: 'login', component: LoginComponent},

  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'admin/reset-password', component: ResetPasswordComponent},
  {path: 'registration', component: RegisterComponent},
  {path: 'registration-form', component: RegistrationFormComponent},
  // {path:'forgotpassword', component: ForgotPasswordComponent},
  {path:'successful-registration',component:RegisterSuccessPageComponent},
  {path:'chat',component: ChatDialogTplComponent},
  {path:'live-chat',component:LiveChatTplComponent},


  //{path:'dashboard',component: DashboardComponent, canActivate: [authGuard], canActivateChild: [authGuard], children: [

//   {path: 'registration', component: RegisterComponent},
//   {path: 'registration-form', component: RegistrationFormComponent},
//   // {path:'forgotpassword', component: ForgotPasswordComponent},
//   {path:'successful-registration',component:RegisterSuccessPageComponent},
//   {path:'chat',component: ChatDialogTplComponent},
//   {path:'live-chat',component:LiveChatTplComponent},

//   {
//     path: 'envirotrack', children: [

//     ]
//   },



  {path:'dashboard',component:DashboardComponent, canActivate: [authGuard], canActivateChild: [authGuard], children: [
      {path: '', component: DasboardWidgetsComponent},
      {path: 'import', component: ImportEnvirotrackComponent},
      {path: 'fuel-data', component: DataCaptureSpreadsheetFuelsComponent},
      {path: 'pet', component: PetLoginProtected},
      {path:'recommendations', component: GenerateReportComponent},
      {path: 'report', component: EnvirotrackReportComponent},
      {path: 'heatmap', component: EnvirotrackReportHeatmapComponent},
      {path: 'scatter', component: EnvirotrackReportScatterComponent},
      {path: 'bar', component: EnvirotrackReportBarComponent },
      {path: 'pie', component: EnvirotrackReportPieComponent },
      {path: 'base1', component: EnvirotrackReportBase1Component },
      {path: 'avg', component: EnvirotrackReportAvgComponent },
      {path: 'demand', component: EnvirotrackReportDemandComponent },
      {path: 'co2emissions', component:  TypeChartComponent},
      {path: 'co2emissionsbyscope', component: ScopeChartComponent },
      {path:'bug-report',component:BugReportComponent},
      {path:'faqs',component:FaqsComponent},
      // {path:'contact-us',component:ContactUsComponent}
    ]},
  {path: '**', redirectTo: 'dashboard'},
  {path: '', component: AppComponent},
];



