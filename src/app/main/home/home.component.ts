import {Component, OnInit, ViewEncapsulation,} from '@angular/core'
import {CoreConfigService} from "../../../@core/services/config.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HomeService} from "./services/home.service";
import {ConvertCPU, CPU} from "./modules/CPU";
import {ConvertFailure, Failure} from "./modules/Failure";
import {ConvertMQTT, Mqtt} from "./modules/mqtt";
import {ConvertResult, Result} from "./modules/Result";
import {ConvertSetting, Setting} from "./modules/Setting";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [HomeService,]
})
export class HomeComponent implements OnInit {

    formGroup: FormGroup

    constructor(
        private fb: FormBuilder,
        private homeService: HomeService,
        private modal: NgbModal,
        private _coreConfigService: CoreConfigService,
    ) {
        try {
            homeService.messages.subscribe(msg => {
                console.log("Response from websocket: " + msg);
                this.getMessage(msg)
            });

        } catch (e) {
            console.log("Mất kết nối!")
        }

        this.formGroup = this.fb.group({
            isCompanyTag: [null],
            isShowingCompanyName: [null],
            isShowingInfoTimekeeping: [null],
            isShowingInfoOpen: [null],
            checkingModule: [null],
            lang: [null],
            isAntiFakeByRGB: [null],
            isAntiFakeByIR: [null],
            isAntiFaceFake: [null],
            isShowIRCamera: [null],
            isIncreaseQuality: [null],
            isUsingLED: [null],
            brightness: [null],
            isUsingVolume: [null],
            volume: [null],
            isAutoStart: [null],
            isAutoRestartAfterCrash: [null],
            isCheckingFaceMask: [null],
            isCheckingTemperature: [null],
            isCheckingTemperatureOnFace: [null],
            isDebug: [null],
            timeHoldDoor: [null],
            distance: [null],
            limitTemp: [null],
            daySaveOffline: [null],
            timeNoDetect: [null],
        })


    }

    // Hiển thị các thông tin về CPU
    public cpu: CPU
    public failure: Failure
    public mqtt: Mqtt
    public result: Result

    getMessage(msg: JSON) {
        try {
            this.cpu = ConvertCPU.toCPU(JSON.stringify(msg))
            this.countNetwork()
            console.log("1")
        } catch (e) {

        }
        try {
            this.failure = ConvertFailure.toFailure(JSON.stringify(msg))
            console.log("2")
        } catch (e) {

        }
        try {
            this.mqtt = ConvertMQTT.toMqtt(JSON.stringify(msg))
            console.log("3")
        } catch (e) {

        }
        try {
            this.result = ConvertResult.toResult(JSON.stringify(msg))
            console.log("4")
            this.getData()
        } catch (e) {

        }
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
    public checkingModule: String;

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

    isInteger(number: number): boolean {
        if (number < 0 || number % 1 > 0 || number == null) return false;
        return true;
    }
    isInteger2(number: number): boolean {
        if (number < 20 || number >100 || number % 1 > 0 || number == null) return false;
        return true;
    }
    isInteger3(number: number): boolean {
        if (number < 0  || number == null) return false;
        return true;
    }
    setNotify(number: number): String {
        if(number < 0 ){
            return "Số nhập vào phải lớn hơn hoặc bằng 0"
        } else  if (number % 1 > 0){
            return "Số nhập vào phải là số nguyên"
        } else if (number == null){
            return "Không để trống"
        } else {
            return null
        }
    }
    setNotify2(number: number): String {
        if(number < 20 ){
            return "Số nhập vào phải lớn hơn hoặc bằng 20"
        } else  if (number  > 100){
            return "Số nhập vào phải nhỏ hơn hoặc bằng 100"
        }else  if (number % 1 > 0){
            return "Số nhập vào phải là số nguyên"
        }
        else if (number == null){
            return "Không để trống"
        } else {
            return null
        }
    }
    setNotify3(number: number): String {
        if(number < 0 ){
            return "Số nhập vào phải lớn hơn hoặc bằng 0"
        }  else if (number == null){
            return "Không để trống"
        } else {
            return null
        }
    }

    // Thời gian mở cửa
    public timeHoldDoor: number
    public isTrueTimeHoldDoor: boolean = true
    public notifyTimeHoldDoor :String
    checkValueTimeHoldDoor() {
        this.isTrueTimeHoldDoor = this.isInteger(this.formGroup.value.timeHoldDoor)
        this.notifyTimeHoldDoor = this.setNotify(this.formGroup.value.timeHoldDoor)
    }

    public distance: number;
    public isTrueDistance: boolean = true
    public notifyDistance :String
    checkValueDistance() {
        this.isTrueDistance = this.isInteger2(this.formGroup.value.distance)
        this.notifyDistance = this.setNotify2(this.formGroup.value.distance)
    }
    // changeDistance(modalForm, event) {
    //     // console.log(event)
    //     if (event < 20) {
    //         this.notify = "Số nhập vào < 20cm"
    //         this.modal.open(modalForm, {size: 'lg'})
    //     } else if (event > 100) {
    //         this.notify = "Số nhập vào lớn hơn 100 cm"
    //         this.modal.open(modalForm, {size: 'lg'})
    //     }
    //         // else if(!event.isNumber){
    //         //   this.notify = "Vui lòng ấn + hoặc - để định dạng dữ liệu" + event.type
    //         //   this.modal.open(modalForm, {size: 'lg'})
    //     // }
    //     else {
    //         this.distance = event
    //         this.showValue()
    //     }
    //
    // }


    // Thời gian mở cửa
    public limitTemp: number;
    public isLimitTemp: boolean = true;
    public notifyLimitTemp :String
    checkValueLimitTemp() {
        this.isLimitTemp = this.isInteger3(this.formGroup.value.limitTemp)
        this.notifyLimitTemp = this.setNotify3(this.formGroup.value.limitTemp)
    }

    // Thời gian mở cửa
    public daySaveOffline: number;
    public isDaySaveOffline: boolean = true;
    public notifyDaySaveOffline :String
    checkValueDaySaveOffline() {
        this.isDaySaveOffline = this.isInteger(this.formGroup.value.daySaveOffline)
        this.notifyDaySaveOffline = this.setNotify(this.formGroup.value.daySaveOffline)
    }

    // Thời gian mở cửa
    public timeNoDetect: number;
    public isTimeNoDetect: boolean = true;
    public notifyTimeNoDetect :String
    checkValueTimeNoDetect() {
        this.isTimeNoDetect = this.isInteger(this.formGroup.value.timeNoDetect)
        this.notifyTimeNoDetect = this.setNotify(this.formGroup.value.timeNoDetect)
    }

    public brightness: number
    changBrightness() {
        this.brightness = this.formGroup.value.brightness
    }

    public volume: number
    changVolume() {
        this.volume = this.formGroup.value.volume
    }

    public lang: String

    // public notify: String;

    //Show result
    showValue() {
        console.log("===============");
        console.log("isCompanyTag: " + this.isCompanyTag);
        console.log("isShowingCompanyName: " + this.isShowingCompanyName);
        console.log("isShowingInfoTimekeeping: " + this.isShowingInfoTimekeeping);
        console.log("isShowingInfoOpen: " + this.isShowingInfoOpen);
        console.log("isCheckingModule: " + this.checkingModule);
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

        console.log("brightness: " + this.brightness)
        console.log("volume: " + this.volume)

        console.log("lang: " + this.lang)
    }

    getData() {
        if (this.result != null) {

            this.formGroup = this.fb.group({
                isCompanyTag: [this.result.data.showCompanyLabel, [Validators.required]],
                isShowingCompanyName: [this.result.data.companyNameVisibility, [Validators.required]],
                isShowingInfoTimekeeping: [this.result.data.timekeepingVisibility, [Validators.required]],
                isShowingInfoOpen: [this.result.data.openDoorInfoVisibility, [Validators.required]],
                checkingModule: [this.result.data.recognitionMode, [Validators.required]],
                lang: [this.result.data.langCode, [Validators.required]],
                isAntiFakeByRGB: [this.result.data.rgbLiveness, [Validators.required]],
                isAntiFakeByIR: [this.result.data.irLiveness, [Validators.required]],
                isAntiFaceFake: [this.result.data.strictModeLiveness, [Validators.required]],
                isShowIRCamera: [this.result.data.irCameraVisibility, [Validators.required]],
                isIncreaseQuality: [this.result.data.faceQuality, [Validators.required]],
                isUsingLED: [this.result.data.useLed, [Validators.required]],
                brightness: [this.result.data.lightBrightness, [Validators.required]],
                isUsingVolume: [this.result.data.sound, [Validators.required]],
                volume: [this.result.data.volume, [Validators.required]],
                isAutoStart: [this.result.data.autoStartUp, [Validators.required]],
                isAutoRestartAfterCrash: [this.result.data.restartOnCrash, [Validators.required]],
                isCheckingFaceMask: [this.result.data.checkMask, [Validators.required]],
                isCheckingTemperature: [this.result.data.checkTemp, [Validators.required]],
                isCheckingTemperatureOnFace: [this.result.data.checkFaceTemp, [Validators.required]],
                isDebug: [this.result.data.debugMode, [Validators.required]],
                timeHoldDoor: [this.result.data.keepDoorTime, [Validators.required]],
                distance: [this.result.data.detectDistance, [Validators.required]],
                limitTemp: [this.result.data.highTempWarning, [Validators.required]],
                daySaveOffline: [this.result.data.keepFaceResultDay, [Validators.required]],
                timeNoDetect: [this.result.data.doesNotRecognizeTheSamePerson, [Validators.required]],
            })
            // this.formGroup.value.isCompanyTag =this.result.data.showCompanyLabel
            // this.formGroup.value.isShowingCompanyName = this.result.data.companyNameVisibility
            // this.formGroup.value.isShowingInfoTimekeeping = this.result.data.timekeepingVisibility
            // this.formGroup.value.isShowingInfoOpen = this.result.data.openDoorInfoVisibility
            // this.formGroup.value.checkingModule = this.result.data.recognitionMode
            // this.formGroup.value.lang = this.result.data.langCode
            // this.formGroup.value.isAntiFakeByRGB = this.result.data.rgbLiveness
            // this.formGroup.value.isAntiFakeByIR = this.result.data.irLiveness
            // this.formGroup.value.isAntiFaceFake = this.result.data.strictModeLiveness
            // this.formGroup.value.isShowIRCamera = this.result.data.irCameraVisibility
            // this.formGroup.value.isIncreaseQuality = this.result.data.faceQuality
            // this.formGroup.value.isUsingLED = this.result.data.useLed
            // this.formGroup.value.isUsingVolume = this.result.data.sound
            // this.formGroup.value.volume = this.result.data.volume
            // this.formGroup.value.isAutoStart = this.result.data.autoStartUp
            // this.formGroup.value.isAutoRestartAfterCrash = this.result.data.restartOnCrash
            // this.formGroup.value.isCheckingFaceMask = this.result.data.checkMask
            // this.formGroup.value.isCheckingTemperature = this.result.data.checkTemp
            // this.formGroup.value.isCheckingTemperatureOnFace = this.result.data.checkFaceTemp
            // this.formGroup.value.isDebug = this.result.data.debugMode
            // this.formGroup.value.timeHoldDoor = this.result.data.keepDoorTime
            // this.formGroup.value.distance = this.result.data.detectDistance
            // this.formGroup.value.limitTemp = this.result.data.highTempWarning
            // this.formGroup.value.daySaveOffline = this.result.data.keepFaceResultDay
            // this.formGroup.value.timeNoDetect = this.result.data.doesNotRecognizeTheSamePerson

            // this.isCheckingTemperatureOnFace = this.result.data.checkFaceTemp
            // this.isCompanyTag = this.result.data.showCompanyLabel
            // this.isShowingCompanyName = this.result.data.companyNameVisibility
            // this.isShowingInfoTimekeeping = this.result.data.timekeepingVisibility
            // this.isShowingInfoOpen = this.result.data.openDoorInfoVisibility
            // this.checkingModule = this.result.data.recognitionMode
            // this.isAntiFakeByRGB = this.result.data.rgbLiveness
            // this.isAntiFakeByIR = this.result.data.irLiveness
            // this.isAntiFaceFake = this.result.data.strictModeLiveness
            // this.isShowIRCamera = this.result.data.irCameraVisibility
            // this.isIncreaseQuality = this.result.data.faceQuality
            // this.isUsingLED = this.result.data.useLed
            // this.isUsingVolume = this.result.data.sound
            // this.isAutoStart = this.result.data.autoStartUp
            // this.isAutoRestartAfterCrash = this.result.data.restartOnCrash
            // this.isCheckingFaceMask = this.result.data.checkMask
            // this.isCheckingTemperature = this.result.data.checkTemp
            // this.isDebug = this.result.data.debugMode
            //
            // this.timeHoldDoor = this.result.data.keepDoorTime
            // this.distance = this.result.data.detectDistance
            // this.limitTemp = this.result.data.highTempWarning
            // this.daySaveOffline = this.result.data.keepFaceResultDay
            // this.timeNoDetect = this.result.data.doesNotRecognizeTheSamePerson
            //
            this.brightness = this.result.data.lightBrightness
            this.volume = this.result.data.volume
            //
            // this.lang = this.result.data.langCode
        }
    }

    // xử lý các thông tin của CPU: tính tốc độ mạng
    public receive3Ago: number = 0
    public transmit3Ago: number = 0
    public receive: number = 0
    public transmit: number = 0

    public countNetwork() {
        if (this.receive3Ago != 0 || this.transmit3Ago != 0) {
            this.receive = (this.cpu.data.network.receive - this.receive3Ago) / 1024 / 3
            this.transmit = (this.cpu.data.network.transmit - this.transmit3Ago) / 1024 / 3
        }
        this.receive3Ago = this.cpu.data.network.receive
        this.transmit3Ago = this.cpu.data.network.transmit
    }

    public setting: Setting

    //src\app\app.component.ts
    sendMsg() {

        // var message = {
        //     "method": "setSettings",
        //     "data": {
        //         "autoStartUp": true,
        //         "checkFaceTemp": false,
        //         "checkMask": true,
        //         "checkTemp": true,
        //         "companyNameVisibility": true,
        //         "debugMode": true,
        //         "delayOnlRecognitionTime": 250,
        //         "detectDistance": 100,
        //         "doesNotRecognizeTheSamePerson": 0,
        //         "faceQuality": true,
        //         "highTempWarning": 37.5,
        //         "irCameraVisibility": true,
        //         "irLiveness": true,
        //         "keepDoorTime": 2000,
        //         "keepFaceResultDay": 60,
        //         "langCode": "vi",
        //         "lightBrightness": 100,
        //         "openDoorInfoVisibility": true,
        //         "recognitionMode": "2",
        //         "restartOnCrash": true,
        //         "rgbLiveness": true,
        //         "showCompanyLabel": true,
        //         "sound": true,
        //         "strictModeLiveness": false,
        //         "timekeepingVisibility": true,
        //         "useLed": true,
        //         "volume": 5.0
        //     }
        // }
        // this.HomeService.messages.next(JSON.parse(JSON.stringify(message)));

        // message.source = 'localhost';
        // message.content = this.content;
        console.log("isTimeNoDetect: " + !this.isTimeNoDetect)
        console.log("isDaySaveOffline: " + !this.isDaySaveOffline)
        console.log("isLimitTemp: " + !this.isLimitTemp)
        console.log("isTrueDistance: " + !this.isTrueDistance)
        console.log("isTrueTimeHoldDoor: " + !this.isTrueTimeHoldDoor)
        if(!this.isTimeNoDetect || !this.isDaySaveOffline || !this.isLimitTemp || !this.isTrueDistance || !this.isTrueTimeHoldDoor) {
            return
        }
        this.setting = {
            "method": "setSettings",
            "data": {
                "autoStartUp": true,
                "checkFaceTemp": false,
                "checkMask": true,
                "checkTemp": true,
                "companyNameVisibility": true,
                "debugMode": true,
                "delayOnlRecognitionTime": 250,
                "detectDistance": 100,
                "doesNotRecognizeTheSamePerson": 0,
                "faceQuality": true,
                "highTempWarning": 37.5,
                "irCameraVisibility": true,
                "irLiveness": true,
                "keepDoorTime": 2000,
                "keepFaceResultDay": 60,
                "langCode": "vi",
                "lightBrightness": 100,
                "openDoorInfoVisibility": true,
                "recognitionMode": "2",
                "restartOnCrash": true,
                "rgbLiveness": true,
                "showCompanyLabel": true,
                "sound": true,
                "strictModeLiveness": false,
                "timekeepingVisibility": true,
                "useLed": true,
                "volume": 5.0
            }
        }
        this.setting.method = "setSettings"
        // this.setting.data = this.result.data
        // this.setting.data.autoStartUp = this.isAutoStart
        // this.setting.data.checkFaceTemp = this.isCheckingTemperatureOnFace
        // this.setting.data.checkMask = this.isCheckingFaceMask
        // this.setting.data.checkTemp = this.isCheckingTemperature
        // this.setting.data.companyNameVisibility = this.isShowingCompanyName
        // this.setting.data.debugMode = this.isDebug
        // this.setting.data.delayOnlRecognitionTime = 100
        // this.setting.data.detectDistance = this.distance
        // this.setting.data.doesNotRecognizeTheSamePerson = this.timeNoDetect
        // this.setting.data.faceQuality = this.isIncreaseQuality
        // this.setting.data.highTempWarning = this.limitTemp
        // this.setting.data.irCameraVisibility = this.isShowIRCamera
        // this.setting.data.irLiveness = this.isAntiFakeByIR
        // this.setting.data.keepDoorTime = this.timeHoldDoor
        // this.setting.data.keepFaceResultDay = this.daySaveOffline
        // this.setting.data.langCode = this.lang.toString()
        // this.setting.data.lightBrightness = this.brightness
        // this.setting.data.openDoorInfoVisibility = this.isShowingInfoOpen
        // this.setting.data.recognitionMode = this.checkingModule.toString()
        // this.setting.data.restartOnCrash = this.isAutoRestartAfterCrash
        // this.setting.data.rgbLiveness = this.isAntiFakeByRGB
        // this.setting.data.showCompanyLabel = this.isCompanyTag
        // this.setting.data.sound = this.isUsingVolume
        // this.setting.data.strictModeLiveness = this.isAntiFaceFake
        // this.setting.data.timekeepingVisibility = this.isShowingInfoTimekeeping
        // this.setting.data.useLed = this.isUsingLED
        // this.setting.data.volume = this.volume

        this.setting.data.autoStartUp = this.formGroup.value.isAutoStart
        this.setting.data.checkFaceTemp = this.formGroup.value.isCheckingTemperatureOnFace
        this.setting.data.checkMask = this.formGroup.value.isCheckingFaceMask
        this.setting.data.checkTemp = this.formGroup.value.isCheckingTemperature
        this.setting.data.companyNameVisibility = this.formGroup.value.isShowingCompanyName
        this.setting.data.debugMode = this.formGroup.value.isDebug
        this.setting.data.delayOnlRecognitionTime = 100
        this.setting.data.detectDistance = this.formGroup.value.distance
        this.setting.data.doesNotRecognizeTheSamePerson = this.formGroup.value.timeNoDetect
        this.setting.data.faceQuality = this.formGroup.value.isIncreaseQuality
        this.setting.data.highTempWarning = this.formGroup.value.limitTemp
        this.setting.data.irCameraVisibility = this.formGroup.value.isShowIRCamera
        this.setting.data.irLiveness = this.formGroup.value.isAntiFakeByIR
        this.setting.data.keepDoorTime = this.formGroup.value.timeHoldDoor
        this.setting.data.keepFaceResultDay = this.formGroup.value.daySaveOffline
        this.setting.data.langCode = this.formGroup.value.lang.toString()
        this.setting.data.lightBrightness = this.formGroup.value.brightness
        this.setting.data.openDoorInfoVisibility = this.formGroup.value.isShowingInfoOpen
        this.setting.data.recognitionMode = this.formGroup.value.checkingModule.toString()
        this.setting.data.restartOnCrash = this.formGroup.value.isAutoRestartAfterCrash
        this.setting.data.rgbLiveness = this.formGroup.value.isAntiFakeByRGB
        this.setting.data.showCompanyLabel = this.formGroup.value.isCompanyTag
        this.setting.data.sound = this.formGroup.value.isUsingVolume
        this.setting.data.strictModeLiveness = this.formGroup.value.isAntiFaceFake
        this.setting.data.timekeepingVisibility = this.formGroup.value.isShowingInfoTimekeeping
        this.setting.data.useLed = this.formGroup.value.isUsingLED
        this.setting.data.volume = this.formGroup.value.volume

        this.homeService.messages.next(JSON.parse(ConvertSetting.settingToJson(this.setting)));

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
    }
}
