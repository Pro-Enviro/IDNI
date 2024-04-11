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
import {EventsComponent} from "./pages/events/events.component";
import {ProjectInformationComponent} from "./pages/project-information/project-information.component";
import {PartnersComponent} from "./pages/partners/partners.component";
import {AdvisoryBoardComponent} from "./pages/project-information/advisory-board/advisory-board.component";
import {StakeholdersComponent} from "./pages/project-information/stakeholders/stakeholders.component";
import {CamirusComponent} from "./pages/partners/camirus/camirus.component";
import {ProEnviroComponent} from "./pages/partners/pro-enviro/pro-enviro.component";
import {InvestniComponent} from "./pages/partners/investni/investni.component";
import {MniComponent} from "./pages/partners/mni/mni.component";
import {QueenUniBelfastComponent} from "./pages/partners/queen-uni-belfast/queen-uni-belfast.component";
import {AmicComponent} from "./pages/partners/amic/amic.component";
import {EiuComponent} from "./pages/partners/eiu/eiu.component";
import {UlsterComponent} from "./pages/partners/ulster/ulster.component";
import {MpaComponent} from "./pages/partners/mpa/mpa.component";
import {LatestTechComponent} from "./pages/project-information/latest-tech/latest-tech.component";
import {ZeroCarbonComponent} from "./pages/project-information/latest-tech/zero-carbon/zero-carbon.component";
import {CoalComponent} from "./pages/project-information/latest-tech/zero-carbon/coal/coal.component";
import {LowCarbonComponent} from "./pages/project-information/latest-tech/low-carbon/low-carbon.component";
import {GlobalComponent} from "./pages/project-information/latest-tech/low-carbon/global/global.component";
import {CarbonCaptureComponent} from "./pages/project-information/latest-tech/carbon-capture/carbon-capture.component";
import {
  UtilizationComponent
} from "./pages/project-information/latest-tech/carbon-capture/utilization/utilization.component";
import {
  FundingInjectionComponent
} from "./pages/project-information/latest-tech/carbon-capture/funding-injection/funding-injection.component";
import {HydrogenPowerComponent} from "./pages/project-information/latest-tech/hydrogen-power/hydrogen-power.component";
import {FuelComponent} from "./pages/project-information/latest-tech/hydrogen-power/fuel/fuel.component";
import {LondonComponent} from "./pages/project-information/latest-tech/hydrogen-power/london/london.component";
import {SolarPowerComponent} from "./pages/project-information/latest-tech/solar-power/solar-power.component";
import {
  TransparentComponent
} from "./pages/project-information/latest-tech/solar-power/transparent/transparent.component";
import {FloatingComponent} from "./pages/project-information/latest-tech/solar-power/floating/floating.component";
import {HeatExchangeComponent} from "./pages/project-information/latest-tech/heat-exchange/heat-exchange.component";
import {NewsComponent} from "./pages/news/news.component";
import {ClimateCrisisComponent} from "./pages/news/climate-crisis/climate-crisis.component";
import {NetZeroBusinessComponent} from "./pages/news/net-zero-business/net-zero-business.component";
import {ClimateChangeCommitteComponent} from "./pages/news/climate-change-committe/climate-change-committe.component";
import {EnergyEfficiencyComponent} from "./pages/news/energy-efficiency/energy-efficiency.component";
import {PetLoginProtected} from "./pages/pet-login-protected/pet-login-protected.component";
import {TypeChartComponent} from "./pages/envirotrack/report/type-chart/type-chart.component";
import {ScopeChartComponent} from "./pages/envirotrack/report/scope-chart/scope-chart.component";
import {VirtualTourComponent} from "./pages/virtual-tour/virtual-tour.component";
import {DataPrivacyComponent} from "./pages/data-privacy/data-privacy.component";

import {GenerateReportComponent} from "./pages/reports/generate-report/generate-report.component";

import {RegisterSuccessPageComponent} from "./users/register/register-success-page/register-success-page.component";




export const routes: Routes = [

  {path: '', component: LandingPageComponent},
  {path:'home',component: LandingPageComponent},
  {path:'data-privacy-policy',component:DataPrivacyComponent},
  {path: 'pet', component: PetComponent},
  {path:'events',component:EventsComponent},
  {path: 'coming-soon', component: ConstructionComponent},
  {path:'news',component:NewsComponent},
  {path:'virtual-tour',component:VirtualTourComponent},
  {path:'climate-crisis',component:ClimateCrisisComponent},
  {path:'micro-businesses-net-zero',component:NetZeroBusinessComponent},
  {path:'progress-report-climate-change-committee',component:ClimateChangeCommitteComponent},
  {path:'drive-energy-efficiency-to-deliver',component:EnergyEfficiencyComponent},
  {path: 'local-decarbonisation', component: LocalDecarbonisationComponent},
  {path: 'local-decarb-single', component: LocalDecabSingleTplComponent},
  {path:'project-information', component:ProjectInformationComponent},
  {path: 'latest-technologies',component:LatestTechComponent},
  {path:'zero-carbon-technologies',component:ZeroCarbonComponent},
  {path:'goodbye-coal-generated-electricity',component:CoalComponent},
  {path:'low-carbon-technologies',component:LowCarbonComponent},
  {path:'global-blockage-effect',component:GlobalComponent},
  {path:'carbon-capture',component:CarbonCaptureComponent},
  {path:'carbon-capture-funding-injection',component:FundingInjectionComponent},
  {path:'carbon-capture-utilization-storage',component:UtilizationComponent},
  {path:'hydrogen-power',component:HydrogenPowerComponent},
  {path:'fuel-combat',component:FuelComponent},
  {path:'london-road-greener',component:LondonComponent},
  {path:'solar-power',component:SolarPowerComponent},
  {path:'transparent-solar-panels',component:TransparentComponent},
  {path:'floating-solar-farms',component:FloatingComponent},
  {path:'partners',component:PartnersComponent},
  {path:'camirus', component:CamirusComponent},
  {path:'pro-enviro',component:ProEnviroComponent},
  {path:'invest-ni',component:InvestniComponent},
  {path:'manufacturing-northern-ireland',component:MniComponent},
  {path:'queens-university-belfast',component:QueenUniBelfastComponent},
  {path:'heat-exchange',component:HeatExchangeComponent},
  {path:'advanced-manufacturing-innovation-centre',component:AmicComponent},
  {path:'economic-intelligence-unit',component:EiuComponent},
  {path:'university-of-ulster',component:UlsterComponent},
  {path:'mpa',component:MpaComponent},
  {path:'advisory-board',component:AdvisoryBoardComponent},
  {path:'stakeholders',component:StakeholdersComponent},
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegisterComponent},
  {path: 'registration-form', component: RegistrationFormComponent},
  {path:'successful-registration',component:RegisterSuccessPageComponent},
  {path:'chat',component: ChatDialogTplComponent},
  {path:'live-chat',component:LiveChatTplComponent},

  {
    path: 'envirotrack', children: [

    ]
  },



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
    ]},
  {
    path: 'dashboard', canActivate: [authGuard], children: [
      {path: '', component: DashboardComponent},

    ]
  },
  {path: '**', redirectTo: ''}
];



