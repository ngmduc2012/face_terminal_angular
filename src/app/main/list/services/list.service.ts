import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Observer, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {AnonymousSubject} from "rxjs/internal/Subject";
import {map} from "rxjs/operators";
const CHAT_URL = `${environment.ws}/user`;

@Injectable({
  providedIn: 'root'
})
export class ListService {

  // I. API:
  public inputChanged: BehaviorSubject<any>;

  constructor(private _httpClient: HttpClient) {
    this.inputChanged = new BehaviorSubject({});
    // this.messages = <Subject<JSON>>this.connect(CHAT_URL).pipe(
    //     map(
    //         (response): JSON => {
    //           console.log(response.data)
    //           let data = JSON.parse(response.data)
    //           return data;
    //         }
    //     )
    // );
    this.createWS("")

  }

  createWS(search) {
    if(this.messages != null){
      console.log("2")
      if(!this.messages.closed){
        console.log("3")
        this.messages.unsubscribe()
        this.subject.unsubscribe()
        this.messages.complete()
        this.subject.complete()

        console.log("3: " +  this.messages.closed)
        console.log("3: " +  this.subject.closed)
        this.messages= null
        this.subject = null

      }
    }
      console.log("1")
      this.messages = <Subject<JSON>>this.connect(`${environment.ws}/user/${search}`).pipe(
          map(
              (response): JSON => {
                console.log(response.data)
                let data = JSON.parse(response.data)
                return data;
              }
          )
      );
  }




  private option = {
    headers: {
      "Content-Type": "application/json",
      // Authorization: "Bearer " + this.token,
    },
  };


  // input data in body field to post in api - Sử dụng Params
  public getAllOfList(term,pageIndex, pageSize, ): Observable<any> {
    if(term==null){
      return this._httpClient.get<any>(
          `${environment.apiUrl}/v1/users?pageIndex=${pageIndex}&pageSize=${pageSize}`,
          this.option
      )
    } else {
      return this._httpClient.get<any>(
          `${environment.apiUrl}/v1/users?term=${term}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
          this.option
      )
    }

  }


  // II. websocket:



  private subject: AnonymousSubject<MessageEvent>;
  public messages: Subject<JSON>;


  public connect(url): AnonymousSubject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
      // console.log("Successfully connected: " + url);
    }
    return this.subject;
  }


  private create(url): AnonymousSubject<MessageEvent> {
    let ws = new WebSocket(url);
    let observable = new Observable((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    let observer = {
      error: null,
      complete: null,
      next: (data: Object) => {
        console.log('Message sent to websocket: ', data);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };
    return new AnonymousSubject<MessageEvent>(observer, observable);
  }

}
