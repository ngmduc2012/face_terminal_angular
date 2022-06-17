import {Component, OnInit, ViewEncapsulation,} from '@angular/core'
import {CoreConfigService} from "../../../@core/services/config.service";
import {Observable} from "rxjs";
import {DialogComponent} from "./dialog/dialog.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

// import {MatDialog} from '@angular/material/dialog';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
    constructor(
        // public dialog: MatDialog,
        private modal: NgbModal,
        private _coreConfigService: CoreConfigService,
    ) {

    }

    public contentHeader: object

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------
    // Nhãn công ty
    public isCompanyTag: boolean;
    // Tên công ty
    public isShowingCompanyName: boolean;
    // Thông tin chấm công
    public isShowingInfoTimekeeping: boolean;
    // Thông tin mở cửa
    public isShowingInfoOpen: boolean;
    // Chế độ nhận diện
    public isCheckingModule: boolean;
    //Phát hiện giả mạo RGB
    public isAntiFakeByRGB: boolean;
    // Phát hiện giả mạo IR
    public isAntiFakeByIR: boolean;
    // Chế độ nghiêm ngặt chống giả mạo khuôn mặt
    public isAntiFaceFake: boolean;
    // Hiển thị camera IR
    public isShowIRCamera: boolean;
    // Tăng chất lượng ảnh nhận diện
    public isIncreaseQuality: boolean;
    // Sử dụng đèn Led
    public isUsingLED: boolean;
    // Sử dụng loa
    public isUsingVolume: boolean;
    // Tự động bật chương tình
    public isAutoStart: boolean;
    // Tự khởi động lại khi ứng dụng bị crash
    public isAutoRestartAfterCrash: boolean;
    // Kiểm tra khẩu trang
    public isCheckingFaceMask: boolean;
    // Kiểm tra nhiệt độ
    public isCheckingTemperature: boolean;
    // Chỉ kiểm tra nhiệt độ trên mặt người
    public isCheckingTemperatureOnFace: boolean;
    // Chế độ gỡ lỗi
    public isDebug: boolean;

    // Thời gian mở cửa
    public timeHoldDoor: number;

    changeTimeHoldDoor(event) {
        this.timeHoldDoor = event
        this.showValue()
    }


    public distance: number;

    changeDistance(modalForm, event) {
        // console.log(event)
        if (event < 20) {
            this.notify = "Số nhập vào < 20cm"
            this.modal.open(modalForm, {size: 'lg'})
        } else if (event > 100) {
            this.notify = "Số nhập vào lớn hơn 100 cm"
            this.modal.open(modalForm, {size: 'lg'})
        }
            // else if(!event.isNumber){
            //   this.notify = "Vui lòng ấn + hoặc - để định dạng dữ liệu" + event.type
            //   this.modal.open(modalForm, {size: 'lg'})
        // }
        else {
            this.distance = event
            this.showValue()
        }

    }

    // Thời gian mở cửa
    public limitTemp: number;

    changeLimitTemp(event) {
        this.limitTemp = event
        this.showValue()
    }

    // Thời gian mở cửa
    public daySaveOffline: number;

    changeDaySaveOffline(event) {
        this.daySaveOffline = event
        this.showValue()
    }

    // Thời gian mở cửa
    public timeNoDetect: number;

    changeTimeNoDetect(event) {
        this.timeNoDetect = event
        this.showValue()
    }

    public  brightness: number
    changBrightness(event){
        this.showValue()
    }

    public  volume: number
    changVolume(event){
        this.showValue()
    }

    public  lang: String
    changLang(event){
       this.showValue()
    }

    public notify: String;

    //Show result
    showValue() {
        console.log("===============");
        console.log("isCompanyTag: " + this.isCompanyTag);
        console.log("isShowingCompanyName: " + this.isShowingCompanyName);
        console.log("isShowingInfoTimekeeping: " + this.isShowingInfoTimekeeping);
        console.log("isShowingInfoOpen: " + this.isShowingInfoOpen);
        console.log("isCheckingModule: " + this.isCheckingModule);
        console.log("isAntiFakeByRGB: " + this.isAntiFakeByRGB);
        console.log("isAntiFakeByIR: " + this.isAntiFakeByIR);
        console.log("isAntiFaceFake: " + this.isAntiFaceFake);
        console.log("isShowIRCamera: " + this.isShowIRCamera);
        console.log("isIncreaseQuality: " + this.isIncreaseQuality);
        console.log("isUsingLED: " + this.isUsingLED);
        console.log("isUsingVolume: " + this.isUsingVolume);
        console.log("isAutoStart: " + this.isAutoStart);
        console.log("isAutoRestartAfterCrash: " + this.isAutoRestartAfterCrash);
        console.log("isCheckingFaceMask: " + this.isCheckingFaceMask);
        console.log("isCheckingTemperature: " + this.isCheckingTemperature);
        console.log("isDebug: " + this.isDebug);

        console.log("timeHoldDoor: " + this.timeHoldDoor);
        console.log("distance: " + this.distance);
        console.log("limitTemp: " + this.limitTemp);
        console.log("daySaveOffline: " + this.daySaveOffline);
        console.log("timeNoDetect: " + this.timeNoDetect);

        console.log("brightness: "+ this.brightness)
        console.log("volume: "+ this.volume)

        console.log("lang: " + this.lang)
    }

    getData() {
        this.isCompanyTag = true
        this.isShowingCompanyName = true
        this.isShowingInfoTimekeeping = false
        this.isShowingInfoOpen = true
        this.isCheckingModule = false
        this.isAntiFakeByRGB = true
        this.isAntiFakeByIR = false
        this.isAntiFaceFake = true
        this.isShowIRCamera = false
        this.isIncreaseQuality = true
        this.isUsingLED = false
        this.isUsingVolume = true
        this.isAutoStart = false
        this.isAutoRestartAfterCrash = true
        this.isCheckingFaceMask = true
        this.isCheckingTemperature = false
        this.isDebug = true

        this.timeHoldDoor = 12
        this.distance = 30
        this.limitTemp = 9
        this.daySaveOffline = 58
        this.timeNoDetect = 900

        this.brightness = 12
        this.volume = 15

        this.lang = 'vi'
    }


    /**
     * On init
     */
    ngOnInit() {
        this.contentHeader = {
            headerTitle: 'Home',
            actionButton: true,
            breadcrumb: {
                type: '',
                links: [
                    {
                        name: 'Home',
                        isLink: true,
                        link: '/'
                    }
                ]
            }
        }
        this.getData()
    }
}
