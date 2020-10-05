import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-standalone-card',
  templateUrl: './standalone-card.component.html',
  styleUrls: ['./standalone-card.component.scss']
})
export class StandaloneCardComponent implements OnInit {

  @Input() title: string;

  constructor() { }

  ngOnInit(): void {
  }

}
