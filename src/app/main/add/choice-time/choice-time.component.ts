import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ChoiceTimeService} from "./choice-time.service";
import {CalendarCreator, Day} from "./calendar";

@Component({
    selector: 'app-choice-time',
    templateUrl: './choice-time.component.html',
    styleUrls: ['./choice-time.component.scss'],
    // providers: [ChoiceTimeService]
})
export class ChoiceTimeComponent implements OnInit {

    constructor(
        public calendarCreator: CalendarCreator,
        public choiceTimeService: ChoiceTimeService,
    ) {

    }

    public selectedDay: Day
    public getDate: String
    public monthDays: Day[]
    public monthNumber: number
    public year: number
    public weekDaysName = []
    // Biến lưu trữ giá trị thời gian khi chọn.
    public time = {hour: 0, minute: 0}

    // Dữ liệu đầu vào [getTime] là biến xác định người dùng có muốn lấy thêm dữ liệu thời gian
    // nữa hay không
    @Input() getTime: any = false;
    // @Input() setTime: any ;
    // Dữ liệu trả về cho người dùng khi chọn ngày.
    @Output('ngModelChange') data = new EventEmitter<string>();

    // nút tiếp tục: Tháng sẽ + thêm 1 và tạo lại lịch ngày của tháng mới.
    onNextMonth() {
        // this.choiceTimeService.onNextMonth()
        this.monthNumber++;

        if (this.monthNumber == 12) {
            this.monthNumber = 0;
            this.year++;
        }

        this.setMonthDays(this.calendarCreator.getMonth(this.monthNumber, this.year))

    }

    // nút lùi về: Tháng sẽ trừ đi 1 và tạo lại lịch ngày của tháng mới.
    onPreviousMonth() {
        // this.choiceTimeService.onPreviousMonth()
        this.monthNumber--;

        if (this.monthNumber < 0) {
            this.monthNumber = 11;
            this.year--;
        }

        this.setMonthDays(this.calendarCreator.getMonth(this.monthNumber, this.year))

    }

    // Cập nhập dữ liệu
    update() {
        // this.choiceTimeService.update()
        console.log("monthNumber: " + this.monthNumber)
        this.setMonthDays(this.calendarCreator.getMonth(this.monthNumber, this.year))

    }

    private setMonthDays(days: Day[]) {
        this.monthDays = days
        this.monthNumber = this.monthDays[0].monthIndex
        this.year = this.monthDays[0].year
    }

    // nhận data khi data truyền vào thay đổi.
    ngOnChanges(changes: SimpleChanges) {

        // this.setUpData(changes.setTime.currentValue);
        // You can also use categoryId.previousValue and
        // categoryId.firstChange for comparing old and new values
    }


    // Cài đặt thời gian hiện tại.
    ngOnInit(): void {
        // this.choiceTimeService.onInit()
        this.weekDaysName.push("T2")
        this.weekDaysName.push("T3")
        this.weekDaysName.push("T4")
        this.weekDaysName.push("T5")
        this.weekDaysName.push("T6")
        this.weekDaysName.push("T7")
        this.weekDaysName.push("CN")
        this.onInit()
    }

    // Điều chỉnh css khi lựa chọn phần tử trong lịch.
    bntStyle(day: Day): string {
        if (
            // this.selectedDay === day
            this.selectedDay != null &&
            this.selectedDay.number == day.number
            && this.selectedDay.year == day.year
            && this.selectedDay.monthIndex == day.monthIndex
        ) {
            console.log(day == this.selectedDay)
            return 'border fc-daygrid-event fc-daygrid-block-event fc-h-event fc-event fc-event-draggable fc-event-start fc-event-end bg-light-primary'
        }
        return ''

    }

    // Ngày được chọn.
    // public selectedDay: Day

    // Chọn ngày:
    // + Nếu [getTime]=false tức là người dùng chỉ lấy ngày, bỏ qua giờ và phút.
    // Gửi ngày vừa chọn lên cho người dùng.
    // + Nếu [getTime]=true tức là người dùng sẽ lấy thêm giờ và phút.
    // Gửi ngày và giờ được chọn lên cho người dùng.
    clickDay(day: Day) {
        this.selectedDay = day
        console.log("1: " + this.selectedDay.number)
        // this.selectedDay = day
        console.log("select 2: " + this.selectedDay.number)
        console.log("hour: " + this.time.hour)
        if (day.number != undefined && !this.getTime) {
            const thisMonth = parseInt(String(day.monthIndex)) + 1;
            // console.log("monthIndex: " + parseInt(String(day.monthIndex) + 1))
            // console.log("day: " + day)
            // console.log("day show: "
            //     + (day.number / 10 >= 1 ? day.number : ("0" + day.number))
            //     + (Math.floor(thisMonth / 10) >= 1 ? thisMonth : ("0" + thisMonth))
            //     + day.year)
            this.getDate = ("" + (day.number / 10 >= 1 ? day.number : ("0" + day.number))
                + (Math.floor(thisMonth / 10) >= 1 ? thisMonth : ("0" + thisMonth))
                + day.year);
            this.notify = ""
            // this.data.emit(this.choiceTimeService.dateTime.getDate.toString())
        }

        if (day.number != undefined && this.getTime) {
            const thisMonth = parseInt(String(day.monthIndex)) + 1;
            // console.log("monthIndex: " + parseInt(String(day.monthIndex) + 1))
            // console.log("day: " + day)
            // console.log("day show: "
            //     + (day.number / 10 >= 1 ? day.number : ("0" + day.number))
            //     + (Math.floor(thisMonth / 10) >= 1 ? thisMonth : ("0" + thisMonth))
            //     + day.year)
            this.getDate = (""
                + (this.time.hour / 10 >= 1 ? this.time.hour : ("0" + this.time.hour))
                + (this.time.minute / 10 >= 1 ? this.time.minute : ("0" + this.time.minute))
                + (day.number / 10 >= 1 ? day.number : ("0" + day.number))
                + (Math.floor(thisMonth / 10) >= 1 ? thisMonth : ("0" + thisMonth))
                + day.year);
            this.notify = ""
            // this.data.emit(this.choiceTimeService.dateTime.getDate.toString())

        }
        this.upData()


    }

    // Khi chọn giờ và phút, sau mỗi thay đổi, và nếu đã có ngày được chọn thì sẽ gửi
    // giờ và phút lên cho người dùng.
    clickHour() {
        console.log("hour: " + this.time.hour)
        if (this.getTime && this.selectedDay != null) {
            const thisMonth = parseInt(String(this.selectedDay.monthIndex)) + 1;
            this.getDate = (""
                + (this.time.hour / 10 >= 1 ? this.time.hour : ("0" + this.time.hour))
                + (this.time.minute / 10 >= 1 ? this.time.minute : ("0" + this.time.minute))
                + (this.selectedDay.number / 10 >= 1 ? this.selectedDay.number : ("0" + this.selectedDay.number))
                + (Math.floor(thisMonth / 10) >= 1 ? thisMonth : ("0" + thisMonth))
                + this.selectedDay.year);
            this.notify = ""

            // this.data.emit(this.choiceTimeService.dateTime.getDate.toString())
            this.upData()
        }
    }

    // Cập nhập lại lịch sau mỗi lần thay đổi năm.
    changeYear($event: number) {
        // this.choiceTimeService.changeYear($event)
        this.year = $event
        this.update()
    }

    upData() {
        this.data.emit(this.getDate.toString())
    }

    // Kiếm tra các tham số vừa nhập bằng cách tạo 1 ngày từ tham số đó
    // Nếu tạo ngày thành công thì các tham số đó là chính xác và ngược lại
    // [notify] giúp hiển thị thông báo lỗi ra ngoài màn hình
    notify = "";
    checkTimeForm(time: String): boolean {
        if (this.getTime && time.length == 12) {

            const date = new Date(
                "" + time.substring(8, 12) + "-" +
                time.substring(6, 8) + "-" +
                time.substring(4, 6) + "T" +
                time.substring(0, 2) + ":" +
                time.substring(2, 4) + ":00"
            )
            console.log(date.getDate())
            console.log(isNaN(date.getDate()))
            if (isNaN(date.getDate())) {
                this.notify = "Không đúng định dạng"
                this.selectedDay = null
                return false
            } else {
                this.notify = ""
                return true
            }
        }
        if (!this.getTime && time.length == 8) {

            const date = new Date(
                "" + time.substring(4, 8) + "-" +
                time.substring(2, 4) + "-" +
                time.substring(0, 2) + "T" + "00:00:00"
            )
            console.log(date.getDate())
            if (isNaN(date.getDate())) {
                this.notify = "Không đúng định dạng"
                this.selectedDay = null
                return false
            } else {
                this.notify = ""
                return true
            }
        }
        this.notify = "Không đúng định dạng"
        this.selectedDay = null
        return false
    }

    public timeRegExp = /^[0-2]{1}[0-9]{1}[0-5]{1}[0-9]{1}[0-3]{1}[0-9]{1}[0-1]{1}[0-9]{1}[0-9]{4}$/;
    public dateRegExp = /^[0-3]{1}[0-9]{1}[0-1]{1}[0-9]{1}[0-9]{4}$/;

    // Chức năng: Lấy dữ liệu nhập vào và tạo ra lịch hiển thị.
    // Điều kiện: Khi dữ liệu nhập vào thảo mãn [timeRegExp] và [dateRegExp] và thỏa mãn
    // tạo ngày thành công tại [this.checkTimeForm(data)] thì sẽ tiến hành tạo ngày được chọn
    // và tạo lịch mới.
    setUpData() {
        console.log("1: " + this.getDate)
        const data = this.getDate;

        if (this.dateRegExp.test(data.toString()) && !this.getTime && this.checkTimeForm(data)) {
            // this.setMonthDays(this.calendarCreator.getMonth(this.data, this.year))
            this.year = parseInt(data.substring(4, 8))
            this.monthNumber = parseInt(data.substring(2, 4)) - 1
            this.selectedDay =
                this.calendarCreator.createDay(
                    parseInt(data.substring(0, 2)),
                    this.monthNumber,
                    this.year)
            console.log("selected setUpData: " + this.selectedDay.number)
            this.update()
            // console.log("data: null: "+ this.data%10000)
            // console.log("data: null: "+ (this.data%1000000 - this.data%10000)/10000)
            // console.log("data: null: "+ (this.data%100000000 - this.data%1000000)/1000000)
        } else {
            if (!this.getTime) {
                this.notify = "Không đúng định dạng"
                this.selectedDay = null
            }
        }

        if (this.timeRegExp.test(data.toString()) && this.getTime &&  this.checkTimeForm(data)) {
            // this.setMonthDays(this.calendarCreator.getMonth(this.data, this.year))
                this.year = parseInt(data.substring(8, 12))
                this.monthNumber = parseInt(data.substring(6, 8)) - 1
                this.selectedDay =
                    this.calendarCreator.createDay(
                        parseInt(data.substring(4, 6)),
                        this.monthNumber,
                        this.year)
                this.time = {
                    hour: parseInt(data.substring(0, 2)),
                    minute: parseInt(data.substring(2, 4))
                }
                this.update()
                console.log("selected setUpData: " + this.selectedDay.number)
            // console.log("data: null: "+ this.data%10000)
            // console.log("data: null: "+ (this.data%1000000 - this.data%10000)/10000)
            // console.log("data: null: "+ (this.data%100000000 - this.data%1000000)/1000000)
        } else {
            if (this.getTime) {
                this.notify = "Không đúng định dạng"
                this.selectedDay = null
            }
        }

        if (data == "") {
            this.onInit()
        }
    }

    // Khởi tạo
    private onInit() {
        let date = new Date();
        this.selectedDay = null
        // this.selectedDay =
        //     this.calendarCreator.createDay(
        //         date.getDate(),
        //         date.getMonth(),
        //         date.getFullYear())
        this.setMonthDays(this.calendarCreator.getCurrentMonth())
        if(this.getTime){
            this.time = {hour: date.getHours(), minute: date.getMinutes()}
        }
        this.notify = ""
    }
}

