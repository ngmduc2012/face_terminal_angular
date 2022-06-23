// src\app\services\home.service.ts
import {Injectable} from "@angular/core";
import {Observable, Observer} from 'rxjs';
import {AnonymousSubject} from 'rxjs/internal/Subject';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from "../../../../environments/environment";

const CHAT_URL = `${environment.ws}/socket`;

@Injectable()
export class HomeService {

    // I. websocket:
    private subject: AnonymousSubject<MessageEvent>;
    public messages: Subject<JSON>;

    constructor() {

        this.messages = <Subject<JSON>>this.connect(CHAT_URL).pipe(
            map(
                (response): JSON => {
                    console.log(response.data)
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
