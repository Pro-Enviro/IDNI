import { Component } from '@angular/core';
import {CarouselModule} from "primeng/carousel";
import {ImageModule} from "primeng/image";

@Component({
  selector: 'app-carousel-tpl',
  standalone: true,
  imports: [
    CarouselModule,
    ImageModule
  ],
  templateUrl: './carousel-tpl.component.html',
  styleUrl: './carousel-tpl.component.scss'
})
export class CarouselTplComponent {
  responsiveOptions: any[] | undefined;

partners = [
  {
   title: 'InvestNI',
    content: 'We are part of the Department for the Economy and provide strong government support for business by effectively delivering the Government’s economic development strategies.',
    image:'https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg'
  },
  {
    title: 'Camirus Ltd',
    content: 'Camirus specialises in developing and delivering collaborative projects in clean growth and economic development. ' +
      'We have particular expertise in energy, and ways to link investments in energy infrastructure to economic opportunities for firms, sectors and localities.',
    image:'https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg'
  },
  {
    title: 'Pro Enviro Ltd',
    content: 'Pro Enviro is a specialist energy engineering, carbon abatement and process optimisation consultancy, with over 30 years’ experience working with organisations in energy intensive sectors.',
    image:'https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg'
  },
  {
    title: 'Manufacturing Northern Ireland',
    content: 'Manufacturing NI is a campaigning organisation which works with member companies, workforce representatives, ' +
      'policymakers and regulators to challenge and encourage change in areas which impact on the cost of doing business, specifically rates, energy, labour, Brexit and challenges such as Covid-19.',
    image:'https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg'
  },
  {
    title: 'Queen’s University of Belfast',
    content: 'The Queen\'s University of Belfast is a public research university in Belfast, Northern Ireland, United Kingdom.Queen\'s is a member of the Russell Group of research-intensive universities, ' +
      'the Association of Commonwealth Universities, the European University Association, Universities UK and Universities Ireland. ' +
      'The university is associated with two Nobel laureates and one Turing Award laureate. ',
    image:'https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg'
  },
  {
    title: 'Advanced Manufacturing Innovation Centre',
    content: 'AMIC - a £100m project under Belfast Region City Deal - is a collaborative, innovative powerhouse of advanced manufacturing set to elevate our region globally. \n' +
      'We are supporting economic growth and prosperity for Northern IreIand by creating high quality jobs and increasing inward investment through high value manufacturing innovation clusters. \n',
    image:'https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg'
  },
  {
    title: 'The Economic Intelligence Unit (The EIU)',
    content: 'The Economic Intelligence Unit (The EIU) was first established in 2002 as a critical mechanism for understanding, ' +
      'analysing and presenting intelligence related to the Black Country economy, encompassing the City of Wolverhampton and the Borough Councils of Dudley, Sandwell and Walsall.',
    image:'https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg'
  },
  {
    title: 'University of Ulster',
    content: 'Ulster University has a national and international reputation for excellence, innovation and ' +
      'regional engagement and continues to make a major contribution to the economic, social and cultural development of Northern Ireland.',
    image:'https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg'
  },
  {
    title: 'MPA ',
    content: 'MPA is the trade association for the aggregates, asphalt, cement, concrete, dimension stone, lime, mortar and industrial sand industries.' +
      'MPA represents the interests of its members and the wider industry with all levels of Government, regulators and a wide range of other stakeholders.',
    image:'https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg'
  }
]
  // ngOnInit() {
  //   this.responsiveOptions = [
  //     {
  //       breakpoint: '1199px',
  //       numVisible: 1,
  //       numScroll: 1
  //     },
  //     {
  //       breakpoint: '991px',
  //       numVisible: 2,
  //       numScroll: 1
  //     },
  //     {
  //       breakpoint: '767px',
  //       numVisible: 1,
  //       numScroll: 1
  //     }
  //   ];
  // }
}
