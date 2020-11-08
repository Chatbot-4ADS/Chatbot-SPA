import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  @HostBinding('class') cssClasses = 'flex-fill';

  constructor() { }

  ngOnInit(): void {
  }

}
