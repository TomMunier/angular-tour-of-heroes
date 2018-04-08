import { Component, OnInit } from '@angular/core';
import { MessageService } from '../service/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  private _service;

  constructor(private messageService: MessageService) { this._service = this.messageService; }

  ngOnInit() {
  }

  clear() {
    this.messageService.clear();
  }

  get service() {
    return this._service;
  }

}
