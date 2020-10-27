import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { FormsModule } from '@angular/forms';
import { RegistrationFormComponent } from './components/chatbot/registration-form/registration-form.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [ChatbotComponent, RegistrationFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    HttpClientModule,
    NgbDropdownModule
  ],
  exports: [
    ChatbotComponent
  ]
})
export class ThemeModule { }
