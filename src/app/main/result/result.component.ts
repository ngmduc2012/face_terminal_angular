import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ListService} from "../list/services/list.service";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PagedData} from "../list/modules/PagedData";
//for TABLE
import {
    ColumnMode,
    DatatableComponent,
    SelectionType,
} from "@swimlane/ngx-datatable";
import {ResultService} from "./service/result.service";
import {interval, Subscription} from "rxjs";
import {ConvertList, List} from "../list/modules/list";
import {FlatpickrOptions} from "ng2-flatpickr";


@Component({
    selector: 'app-result',
    templateUrl: './result.component.html',
    styleUrls: ['./result.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ResultComponent implements OnInit {
    public contentHeader: object
    formSearch: FormGroup

    constructor(
        private fb: FormBuilder,
        private resultService: ResultService,
        private _toastService: ToastrService,
        private modal: NgbModal,
    ) {
        //Khởi tạo form nhập thông tin dn và phần tử nhập dn trong đó.
        this.formSearch = this.fb.group({
            search: [null],
            isDecs: [true],
            // defaultDateOptionsStart: [Date.now()],
            timeOptionsStart: [Date.now()],
            // defaultDateOptionsEnd: [Date.now()],
            timeOptionsEnd: [Date.now()]


        })


        // websocket
        try {
            resultService.messages.subscribe(msg => {
                console.log("wc-user: " + msg);
                this.getMessage(msg)
            });

        } catch (e) {
            console.log("Mất kết nối!")
        }

    }

    private firstTime = true
    private subscription: Subscription;
    public count = 5

    private getTimeDifference(msg) {
        this.count--;
        console.log(this.count)
        if (this.count == 0) {
            this.getAllOfResult(this.page)
            this.count = 5
            this.subscription.remove(this.subscription)
            this.subscription.unsubscribe()
        }
    }

    public list: List
    public dataList: number = 0
    // Đọc list nhận được.
    // (1) dataList mặc định ban đầu = 0, thì sẽ tiến hành lấy danh sách và thay đổi dataList
    // (2) nếu dataList đã được thay đổi,
    // (3) nếu dataList mới nhận được khác dataList cũ,
    // (4) nếu là lần đầu thì sẽ tiến hành đợi 5 giây và lấy danh sách.
    // (5) nếu không phải lần đầu, mà timer đã đóng thì tạo timer 5s mới để lấy danh sách.
    getMessage(msg: JSON) {
        try {
            this.list = ConvertList.toList(JSON.stringify(msg))
            // (1)
            if (this.dataList == 0) {
                this.getAllOfResult(this.page)
                this.dataList = this.list.data
            }
            // (2)
            else {
                // (3)
                if (this.dataList != this.list.data) {
                    // (4)
                    if (this.firstTime) {
                        this.subscription = interval(1000)
                            .subscribe(x => {
                                this.getTimeDifference(msg);
                            });
                    } else {
                        // (5)
                        if (this.subscription.closed) {
                            this.subscription = interval(1000)
                                .subscribe(x => {
                                    this.getTimeDifference(msg);
                                });
                        }
                    }
                    this.dataList = this.list.data
                }
            }
            console.log("1")
            // this.pagedData.totalItems = this.dataList
            // this.pagedData.totalPages = this.dataList/this.itemOnPage
            // if(this.dataList%this.itemOnPage>0){
            //   this.pagedData.totalPages+=1
            // }
        } catch (e) {

        }
    }

    // public DefaultDateOptionsStart: FlatpickrOptions = {
    //     altInput: true
    // };

    // public timeOptionsStart: FlatpickrOptions = {
    //     enableTime: true,
    //     noCalendar: true,
    //     altInput: true
    // };

    // public DefaultDateOptionsEnd: FlatpickrOptions = {
    //     altInput: true,
    // };

    // public timeOptionsEnd: FlatpickrOptions = {
    //     enableTime: true,
    //     noCalendar: true,
    //     altInput: true
    // };

    public startTime = 0
    public endTime = 0
    endTimeNameNotify = false

    search() {
        console.log(this.formSearch.value.search)
        console.log(this.formSearch.value.isDecs)
        console.log(this.formSearch.value.timeOptionsEnd)
        console.log(this.formSearch.value.timeOptionsStart)
        // console.log(this.formSearch.value.defaultDateOptionsEnd)
        // console.log(this.formSearch.value.defaultDateOptionsStart)

        const timeOptionsEnd = new Date(this.formSearch.value.timeOptionsEnd);
        const timeOptionsStart = new Date(this.formSearch.value.timeOptionsStart);
        // const defaultDateOptionsEnd = new Date(this.formSearch.value.defaultDateOptionsEnd);
        // const defaultDateOptionsStart = new Date(this.formSearch.value.defaultDateOptionsStart);

        console.log("timeOptionsEnd: " + timeOptionsEnd)
        console.log("timeOptionsStart: " + timeOptionsStart)
        // console.log("defaultDateOptionsEnd: " + defaultDateOptionsEnd)
        // console.log("defaultDateOptionsStart: " + defaultDateOptionsStart)

        // console.log("DayS: " + defaultDateOptionsStart.getDate())
        // console.log("DayE: " + defaultDateOptionsEnd.getDate())

        // const startTimeDate = new Date(
        //     defaultDateOptionsStart.getFullYear(),
        //     defaultDateOptionsStart.getMonth(),
        //     defaultDateOptionsStart.getDate(),
        //     timeOptionsStart.getHours(),
        //     timeOptionsStart.getMinutes()
        // )
        // const endTimeDate = new Date(
        //     defaultDateOptionsEnd.getFullYear(),
        //     defaultDateOptionsEnd.getMonth(),
        //     defaultDateOptionsEnd.getDate(),
        //     timeOptionsEnd.getHours(),
        //     timeOptionsEnd.getMinutes()
        // )

        // console.log("startTime: " + startTimeDate)
        // console.log("endTime: " + endTimeDate)


        this.startTime = timeOptionsStart.getTime()
        this.endTime = timeOptionsEnd.getTime()

        console.log("startTime: " + this.startTime)
        console.log("endTime: " + this.endTime)

        if(this.startTime>this.endTime){
            this.endTimeNameNotify = true
        } else {
            this.endTimeNameNotify = false
            this.getAllOfResult(this.page)
        }
    }


    //for TABLE
    public SelectionType = SelectionType
    isHasResult: Boolean = false  // Biến này dùng để có kết quả thì hiển thị
    public totalPages: number
    public pageAdvancedEllipses = 1;
    public page: number = 0;
    public itemOnPage = 25;

    //For checkbox
    public isLoading: boolean = false
    public chkBoxSelected = []
    public selected = []
    public rowsData: any[]
    public pagedData = new PagedData<any>()
    public ColumnMode = ColumnMode
    @ViewChild(DatatableComponent) table: DatatableComponent
    @ViewChild("tableRowDetails") tableRowDetails: any

    /**
     * Custom Checkbox On Select
     *
     * @param { selected }
     */
    customCheckboxOnSelect({selected}) {
        this.chkBoxSelected.splice(0, this.chkBoxSelected.length);
        this.chkBoxSelected.push(...selected);
    }

    /**
     * For ref only, log selected values
     *
     * @param selected
     */
    onSelect({selected}) {
        console.log("Select Event", selected, this.selected);
        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
    }

    // choosePage(page){
    //   console.log("page: " + page)
    //   this.pagedData.currentPage = page;
    // }

    getAllOfResult(page) {
        console.log("page: " + page)
        // this.listService.createWS(this.formSearch.value.search)
        this.isLoading = true;
        this.pagedData.currentPage = page;
        this.pagedData.size = this.itemOnPage;
        this.resultService.getAllOfResult(
            this.formSearch.value.search,
            this.pagedData.currentPage + 1,
            this.pagedData.size,
            this.startTime,
            this.endTime,
            this.formSearch.value.isDecs
        ).subscribe((res: any) => {
            console.log(res.data)
            if (res.isSuccess === true) {
                this.rowsData = res.data.pagedList;
                this.pagedData.totalItems = res.data.totalItems
                console.log("pagedData: " + this.pagedData.totalItems)
                console.log("rowsData: " + this.rowsData)

                this.isHasResult = true;
                // this._toastService.success(
                //     res.message,
                //     "Thành công",
                //     {toastClass: "toast ngx-toastr", closeButton: true}
                // );
            }

            // and vice versa
            if (res.result === false) {
                // this._toastService.error(
                //     res.message,
                //     "Thất Bại",
                //     {toastClass: "toast ngx-toastr", closeButton: true}
                // );
            }
            this.isLoading = false;// Kết thcú load dữ liệu sẽ đóng load dữ liệu
        })

    }


    edit(modalForm, row) {

    }

    detail(modalForm, row) {

    }

    ngOnInit() {
        this.contentHeader = {
            headerTitle: 'Result',
            actionButton: true,
            breadcrumb: {
                type: '',
                links: [
                    {
                        name: 'Result',
                        isLink: true,
                        link: '/result'
                    }
                ]
            }
        }
        this.getAllOfResult(this.page)
    }

}
