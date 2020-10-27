import { Component, OnInit } from '@angular/core';
import { DefaultChatbotApiService } from 'src/app/@theme/components/chatbot/api/default/default-chatbot-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [DefaultChatbotApiService]
})
export class HomeComponent implements OnInit {

  constructor(public chatbotAPI: DefaultChatbotApiService) { }

  ngOnInit(): void {
  }

}
