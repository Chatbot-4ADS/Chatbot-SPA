import { TestBed } from '@angular/core/testing';

import { DefaultChatbotApiService } from './default-chatbot-api.service';

describe('DefaultChatbotApiService', () => {
  let service: DefaultChatbotApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefaultChatbotApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
