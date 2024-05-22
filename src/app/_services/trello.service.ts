import { Injectable } from '@angular/core';

import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TrelloService {

  constructor(
    private http: HttpClient,
  ) { }

  getBoardsCards = () => {
    return this.http.get(`https://api.trello.com/1/boards/${environment.TRELLO_TEST_BOARD}/cards?key=${environment.TRELLO_API_KEY}&token=${environment.TRELLO_API_TOKEN}`)
  }

  postNewCardToTrello = (details: any) => {
    return this.http.post(`https://api.trello.com/1/cards?idList=${environment.TRELLO_TEST_CARD_LIST}&key=${environment.TRELLO_API_KEY}&token=${environment.TRELLO_API_TOKEN}`, details)
  }

  postAttachmentToCard = (result: any, formAttachment: any) => {
    return this.http.post(`https://api.trello.com/1/cards/${result.id}/attachments?key=${environment.TRELLO_API_KEY}&token=${environment.TRELLO_API_TOKEN}`, formAttachment)
  }

  postCheckListToCard = (result: any, data: any) => {
    return this.http.post(`https://api.trello.com/1/checklists?idCard=${result.id}&key=${environment.TRELLO_API_KEY}&token=${environment.TRELLO_API_TOKEN}`, data)
  }

  addCheckListItemToCheckList = (result: any) => {
    return this.http.post(`https://api.trello.com/1/checklists/${result.id}/checkItems?key=${environment.TRELLO_API_KEY}&token=${environment.TRELLO_API_TOKEN}`, {name: 'Upload Data to IDNI https://idni.eco'})
  }

}
