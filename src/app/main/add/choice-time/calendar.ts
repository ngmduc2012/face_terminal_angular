// Day
export class Day {
    public number: number;
    public year: number;

    public month: string;
    public monthIndex: number;
    public weekDayName: string;
    public weekDayNumber: number;


}

//Tạo lịch
export class CalendarCreator {
    private readonly currentYear: number;
    private readonly currentMonthIndex: number;

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
