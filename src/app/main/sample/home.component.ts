import { Component, OnInit } from '@angular/core'
import {CoreConfigService} from "../../../@core/services/config.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(
  private _coreConfigService: CoreConfigService,
  ) {

  }
  public contentHeader: object

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  // Nhãn công ty
  public  isCompanyTag: boolean;
  // Tên công ty
  public  isShowingCompanyName: boolean;
  // Thông tin chấm công
  public  isShowingInfoTimekeeping: boolean;
  // Thông tin mở cửa
  public  isShowingInfoOpen: boolean;
  // Chế độ nhận diện
  public  isCheckingModule: boolean;
  //Phát hiện giả mạo RGB
  public  isAntiFakeByRGB: boolean;
  // Phát hiện giả mạo IR
  public  isAntiFakeByIR: boolean;
  // Chế độ nghiêm ngặt chống giả mạo khuôn mặt
  public  isAntiFaceFake: boolean;
  // Hiển thị camera IR
  public  isShowIRCamera: boolean;
  // Tăng chất lượng ảnh nhận diện
  public  isIncreaseQuality: boolean;
  // Sử dụng đèn Led
  public  isUsingLED: boolean;
  // Sử dụng loa
  public  isUsingVolume: boolean;
  // Tự động bật chương tình
  public  isAutoStart: boolean;
  // Tự khởi động lại khi ứng dụng bị crash
  public  isAutoRestartAfterCrash: boolean;
  // Kiểm tra khẩu trang
  public  isCheckingFaceMask: boolean;
  // Kiểm tra nhiệt độ
  public  isCheckingTemperature: boolean;
  // Chỉ kiểm tra nhiệt độ trên mặt người
  public  isCheckingTemperatureOnFace: boolean;
  // Chế độ gỡ lỗi
  public  isDebug: boolean;
  //Show result
  showValue(){
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
  }

  getData(){
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
