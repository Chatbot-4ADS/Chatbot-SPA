import { Component, HostBinding, OnInit } from '@angular/core';
import { DefaultChatbotApiService } from 'src/app/@theme/components/chatbot/api/default/default-chatbot-api.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  providers: [DefaultChatbotApiService]
})
export class ChatbotComponent implements OnInit {
  @HostBinding('class') cssClasses = 'flex-fill';

  constructor(public chatbotAPI: DefaultChatbotApiService) { }

  ngOnInit(): void {
  }

}
