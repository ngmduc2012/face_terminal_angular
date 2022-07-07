import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {CalendarCreator, Day} from "./calendar";


class ChoiceTime {
    // public selectedDay: Day
    // public getDate: String
    // public monthDays: Day[]
    // public monthNumber: number
    // public year: number
    // public weekDaysName = []
    // // Biến lưu trữ giá trị thời gian khi chọn.
    // public time = {hour: 0, minute: 0}
}

@Injectable({
    providedIn: 'root'
})
export class ChoiceTimeService {

    constructor(
        public calendarCreator: CalendarCreator,
    ) {
        // console.log("null")
        // this.dateTime = {
        //     selectedDay: null,
        //     getDate: "",
        //     monthDays: [],
        //     monthNumber: null,
        //     year: null,
        //     weekDaysName: [],
        //     time : {hour: 0, minute: 0}
        // }
        // this.onInit()
        // this.dateTime.weekDaysName.push("T2")
        // this.dateTime.weekDaysName.push("T3")
        // this.dateTime.weekDaysName.push("T4")
        // this.dateTime.weekDaysName.push("T5")
        // this.dateTime.weekDaysName.push("T6")
        // this.dateTime.weekDaysName.push("T7")
        // this.dateTime.weekDaysName.push("CN")

    }

    private readonly _choiceTime = new BehaviorSubject<ChoiceTime>(null);
    readonly dateTime$ = this._choiceTime.asObservable();

    get dateTime(): ChoiceTime {
        return this._choiceTime.getValue();
    }

    set dateTime(val: ChoiceTime) {
        this._choiceTime.next(val);
    }

    // nút tiếp tục: Tháng sẽ + thêm 1 và tạo lại lịch ngày của tháng mới.
    onNextMonth() {
        // this.dateTime.monthNumber++;
        //
        // if (this.dateTime.monthNumber == 12) {
        //     this.dateTime.monthNumber = 0;
        //     this.dateTime.year++;
        // }
        //
        // this.setMonthDays(this.calendarCreator.getMonth(this.dateTime.monthNumber, this.dateTime.year))

    }

    // nút lùi về: Tháng sẽ trừ đi 1 và tạo lại lịch ngày của tháng mới.
    onPreviousMonth() {
        // this.dateTime.monthNumber--;
        //
        // if (this.dateTime.monthNumber < 0) {
        //     this.dateTime.monthNumber = 11;
        //     this.dateTime.year--;
        // }
        //
        // this.setMonthDays(this.calendarCreator.getMonth(this.dateTime.monthNumber, this.dateTime.year))
    }

    // Cập nhập dữ liệu
    update() {
        // console.log("monthNumber: " + this.dateTime.monthNumber)
        // this.setMonthDays(this.calendarCreator.getMonth(this.dateTime.monthNumber, this.dateTime.year))
    }

    // Cập nhập lại lịch sau mỗi lần thay đổi năm.
    changeYear($event: number) {
        // this.dateTime.year = $event
        // this.update()
    }

    private setMonthDays(days: Day[]) {
        // this.dateTime.monthDays = days
        // this.dateTime.monthNumber = this.dateTime.monthDays[0].monthIndex
        // this.dateTime.year = this.dateTime.monthDays[0].year
    }

    // public timeRegExp = /^[0-2]{1}[0-9]{1}[0-5]{1}[0-9]{1}[0-3]{1}[0-9]{1}[0-1]{1}[0-9]{1}[0-9]{4}$/;
    // public dateRegExp = /^[0-3]{1}[0-9]{1}[0-1]{1}[0-9]{1}[0-9]{4}$/;
    // // Cài đặt dữ liệu khi khởi tạo.
    // setUpData() {
    //     console.log("1: " + this.dateTime.getDate)
    //     const data = this.dateTime.getDate;
    //
    //     if (this.dateRegExp.test(data.toString())) {
    //         // this.setMonthDays(this.calendarCreator.getMonth(this.data, this.year))
    //         this.dateTime.year = parseInt(data.substring(4, 8))
    //         this.dateTime.monthNumber = parseInt(data.substring(2, 4)) - 1
    //
    //         if (data.length == 8) {
    //             this.dateTime.selectedDay =
    //                 this.calendarCreator.createDay(
    //                     parseInt(data.substring(0, 2)),
    //                     this.dateTime.monthNumber,
    //                     this.dateTime.year)
    //             console.log("selected setUpData: " + this.dateTime.selectedDay.number)
    //         }
    //         this.update()
    //         // console.log("data: null: "+ this.data%10000)
    //         // console.log("data: null: "+ (this.data%1000000 - this.data%10000)/10000)
    //         // console.log("data: null: "+ (this.data%100000000 - this.data%1000000)/1000000)
    //     }
    //
    //     if (this.timeRegExp.test(data.toString())) {
    //         // this.setMonthDays(this.calendarCreator.getMonth(this.data, this.year))
    //         this.dateTime.year = parseInt(data.substring(8, 12))
    //         this.dateTime.monthNumber = parseInt(data.substring(6, 8)) - 1
    //
    //         if (data.length == 12) {
    //             this.dateTime.selectedDay =
    //                 this.calendarCreator.createDay(
    //                     parseInt(data.substring(4, 6)),
    //                     this.dateTime.monthNumber,
    //                     this.dateTime.year)
    //             console.log("selected setUpData: " + this.dateTime.selectedDay.number)
    //         }
    //         this.update()
    //         // console.log("data: null: "+ this.data%10000)
    //         // console.log("data: null: "+ (this.data%1000000 - this.data%10000)/10000)
    //         // console.log("data: null: "+ (this.data%100000000 - this.data%1000000)/1000000)
    //     }
    //
    //     if(data == ""){
    //         this.onInit()
    //     }
    // }

    // onInit(){
    //     let date = new Date();
    //     // this.dateTime.selectedDay =
    //     //     this.calendarCreator.createDay(
    //     //         date.getDate(),
    //     //         date.getMonth(),
    //     //         date.getFullYear())
    //     this.setMonthDays(this.calendarCreator.getCurrentMonth())
    // }


}


