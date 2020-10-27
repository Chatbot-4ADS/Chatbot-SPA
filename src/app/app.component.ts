import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Chatbot-Web';
  navItems: { name: string, path: string }[] = [
    {
      name: 'Home',
      path: '/home'
    },
    {
      name: 'Sobre',
      path: '/about'
    },
  ];
  isMenuCollapsed = false;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.router.events.pipe(filter(
      (event) => event instanceof NavigationStart)).subscribe((event) => {
        this.isMenuCollapsed = true;
      });
  }
}
