import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AddService {

    public inputChanged: BehaviorSubject<any>;

    constructor(private _httpClient: HttpClient) {
        this.inputChanged = new BehaviorSubject({});
    }

    private option = {
        headers: {
            "Content-Type": "application/json",
            // Authorization: "Bearer " + this.token,
        },
    };

    //FormData Không phải dạng JSON => bỏ "Content-Type": "application/json",
    private optionFile = {
        headers: {
            Authorization: "NjA1OTczMjVjOTAzYTM5ZmJiYmUwMWJlOmMwNGFhOTIwMzg3YTgzMzQ1OGVmMzU3OTUzYjg2NjVlOTFlNzJjMzFjNTYyNjBkNTA2MmY5ZmQxZTAxY2ZlYmE=",
        },
    };

    // input data in body field to post in api - Sử dụng Params
    public postData(body): Observable<any> {
        return this._httpClient.post<any>(`${environment.apiUrl}/v1/user`, body, this.optionFile)
    }

    // input data in body field to post in api - Sử dụng Params
    public checkQuality(body): Observable<any> {
        return this._httpClient.post<any>(`${environment.apiServer}/api/face-image-quality/check`, body, this.optionFile)
    }
}
