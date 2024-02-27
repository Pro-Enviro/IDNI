import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {CarouselModule} from "primeng/carousel";
import {ImageModule} from "primeng/image";


export interface carouselItems {
  title: string
  image: string
  content: string
}
//const logo = require('../../../assets/logos/Camirus logo new (2).png').default as string;
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
export class CarouselTplComponent implements AfterViewInit{

  @Input('content') content: any;

  responsiveOptions: any[] =  [
    {
      breakpoint: '1080px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '915px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '812px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '576px',
      numVisible: 1,
      numScroll: 1
    }
  ];
  carouselItems?: carouselItems[];

  ngAfterViewInit(): void {
      this.carouselItems = this.content.items.map((x:any) => x.content_with_image_type_id)
  }
}
