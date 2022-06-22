// src\app\services\websocket.service.ts
import {Injectable} from "@angular/core";
import {Observable, Observer} from 'rxjs';
import {AnonymousSubject} from 'rxjs/internal/Subject';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';

// const subject = webSocket('ws://192.168.1.166:8080/socket');
const CHAT_URL = "ws://192.168.1.166:8080/socket";
// subject.next('first');
//
// subject.subscribe(
//     msg => console.log('message received: ' + msg), // Called whenever there is a message from the server.
//     err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
//     () => console.log('complete') // Called when connection is closed (for whatever reason).
// );
// export interface Message {
//     source: string;
//     content: string;
// }

@Injectable()
export class WebsocketService {
    private subject: AnonymousSubject<MessageEvent>;
    public messages: Subject<JSON>;

    constructor() {

        this.messages = <Subject<JSON>>this.connect(CHAT_URL).pipe(
            map(
                (response): JSON => {
                    console.log("11 - messagesResult")
                    console.log(response.data)
                    console.log("12 - messagesResult")
                    let data = JSON.parse(response.data)
                    return data;
                }
            )
        );

    }

    public connect(url): AnonymousSubject<MessageEvent> {
        if (!this.subject) {
            this.subject = this.create(url);
            // console.log("Successfully connected: " + url);
        }
        console.log("12 " + this.subject)
        return this.subject;
    }

    private create(url): AnonymousSubject<MessageEvent> {
        console.log("13")
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
        console.log("14")
        return new AnonymousSubject<MessageEvent>(observer, observable);
    }
}
