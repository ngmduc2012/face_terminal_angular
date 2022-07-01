import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
    selector: 'app-choice-time',
    templateUrl: './choice-time.component.html',
    styleUrls: ['./choice-time.component.scss'],
})
export class ChoiceTimeComponent implements OnInit {
    formGroup: FormGroup

    constructor(
        private fb: FormBuilder,
        public calendarCreator: CalendarCreator
    ) {
        this.formGroup = this.fb.group({})
    }

    // @Input() setDate: any;
    @Output() getDate = new EventEmitter<string>();

    public monthDays: Day[]
    public monthNumber: number
    public year: number

    public weekDaysName = []

    onNextMonth() {
        this.monthNumber++;

        if (this.monthNumber == 12) {
            this.monthNumber = 0;
            this.year++;
        }

        this.setMonthDays(this.calendarCreator.getMonth(this.monthNumber, this.year))

    }

    onPreviousMonth() {
        this.monthNumber--;

        if (this.monthNumber < 0) {
            this.monthNumber = 11;
            this.year--;
        }

        this.setMonthDays(this.calendarCreator.getMonth(this.monthNumber, this.year))
    }

    update() {
        console.log("monthNumber: " + this.monthNumber)
        this.setMonthDays(this.calendarCreator.getMonth(this.monthNumber, this.year))
        // this.newItemEvent.emit("01"
        //     + ((this.monthNumber+ 1)/10>= 1 ? (this.monthNumber+ 1) : ("0" + (this.monthNumber+ 1)))
        //     + this.year);
    }

    private setMonthDays(days: Day[]) {
        this.monthDays = days
        this.monthNumber = this.monthDays[0].monthIndex
        this.year = this.monthDays[0].year
    }

    // nhận data khi data truyền vào thay đổi.
    ngOnChanges(changes: SimpleChanges) {

        // this.setUpData(changes.setDate.currentValue);
        // You can also use categoryId.previousValue and
        // categoryId.firstChange for comparing old and new values
    }

    setUpData(data) {
        if (data != null) {
            // this.setMonthDays(this.calendarCreator.getMonth(this.data, this.year))
            this.year = parseInt(data.substring(4, data.length))
            this.monthNumber = parseInt(data.substring(2, 4)) - 1

            if (data.length == 8) {
                this.selectedDay = this.calendarCreator.createDay(parseInt(data.substring(0, 2)), this.monthNumber, this.year)
                console.log("selected setUpData: " + this.selectedDay.number)
            }
            this.update()
            // console.log("data: null: "+ this.data%10000)
            // console.log("data: null: "+ (this.data%1000000 - this.data%10000)/10000)
            // console.log("data: null: "+ (this.data%100000000 - this.data%1000000)/1000000)
        } else {
            // console.log("data: "+ this.data)
            // this.setMonthDays(this.calendarCreator.getCurrentMonth())
        }
    }

    ngOnInit(): void {

        this.setMonthDays(this.calendarCreator.getCurrentMonth())

        this.weekDaysName.push("T2")
        this.weekDaysName.push("T3")
        this.weekDaysName.push("T4")
        this.weekDaysName.push("T5")
        this.weekDaysName.push("T6")
        this.weekDaysName.push("T7")
        this.weekDaysName.push("CN")
    }

    bntStyle(day: Day): string {
        if (day == this.selectedDay) {
            return 'border fc-daygrid-event fc-daygrid-block-event fc-h-event fc-event fc-event-draggable fc-event-start fc-event-end bg-light-primary'
        }
        return ''

    }


    public selectedDay: Day

    click(day: Day) {
        this.selectedDay = day
        console.log("select 2: " + this.selectedDay.number)
        if (day.number != undefined) {
            const thisMonth = parseInt(String(day.monthIndex)) + 1;
            console.log("monthIndex: " + parseInt(String(day.monthIndex) + 1))
            console.log("day: " + day)
            console.log("day show: "
                + (day.number / 10 >= 1 ? day.number : ("0" + day.number))
                + (Math.floor(thisMonth / 10) >= 1 ? thisMonth : ("0" + thisMonth))
                + day.year)
            this.getDate.emit("" + (day.number / 10 >= 1 ? day.number : ("0" + day.number))
                + (Math.floor(thisMonth / 10) >= 1 ? thisMonth : ("0" + thisMonth))
                + day.year);
        }
    }

    changeYear($event: number) {
        this.year = $event
        this.update()
    }
}

export class Day {
    public number: number;
    public year: number;

    public month: string;
    public monthIndex: number;
    public weekDayName: string;
    public weekDayNumber: number;
}

export class CalendarCreator {
    private currentYear: number;
    private currentMonthIndex: number;

    constructor() {
        let date = new Date();
        this.currentYear = date.getFullYear();
        this.currentMonthIndex = date.getMonth();
    }

    public getCurrentMonth(): Day[] {
        return this.getMonth(this.currentMonthIndex, this.currentYear)
    }

    public getMonth(monthIndex: number, year: number): Day[] {
        let days = []
        let firstDay = this.createDay(1, monthIndex, year)
        for (let i = 1; i < (firstDay.weekDayNumber == 0 ? 7 : firstDay.weekDayNumber); i++) {
            days.push({
                weekDayNumber: i,
                monthIndex: monthIndex,
                year: year,
            } as Day)
        }
        days.push(firstDay)
        let countDaysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        for (let i = 2; i < countDaysInMonth + 1; i++) {
            days.push(this.createDay(i, monthIndex, year))
        }

        return days
    }

    public getMonthName(monthIndex: number): string {
        switch (monthIndex) {
            case 0:
                return "January";
            case 1:
                return "February";
            case 2:
                return "March";
            case 3:
                return "April";
            case 4:
                return "May";
            case 5:
                return "June";
            case 6:
                return "July";
            case 7:
                return "August";
            case 8:
                return "September";
            case 9:
                return "October";
            case 10:
                return "November";
            case 11:
                return "December";

            default:
                return "";


        }
    }

    public getWeekdayName(weekDay: number): string {
        switch (weekDay) {
            case 0:
                return "CN";
            case 1:
                return "T2";
            case 2:
                return "T3";
            case 3:
                return "T4";
            case 4:
                return "T5";
            case 5:
                return "T6";
            case 6:
                return "T7";

            default:
                return "";


        }
    }

    public createDay(dayNumber: number, monthIndex: number, year: number) {

        let day = new Day()

        day.monthIndex = monthIndex;
        day.month = this.getMonthName(monthIndex)

        day.number = dayNumber
        day.year = year

        day.weekDayNumber = new Date(year, monthIndex, dayNumber).getDay()
        day.weekDayName = this.getWeekdayName(day.weekDayNumber)

        return day
    }

}
