import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

//for TABLE
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from "@swimlane/ngx-datatable";
import {PagedData} from "./modules/PagedData";
import {ListService} from "./services/list.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {ConvertList, List} from "./modules/list";
import {interval, Subscription} from "rxjs";
import {environment} from "../../../environments/environment";


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ListService,]
})
export class ListComponent implements OnInit {
  public contentHeader: object
  formSearch : FormGroup
  constructor(
      private fb: FormBuilder,
      private listService : ListService,
      private _toastService: ToastrService,
      private modal: NgbModal,
              ) {
    //Khởi tạo form nhập thông tin dn và phần tử nhập dn trong đó.
    this.formSearch = this.fb.group({
      search: [null]
    })

    try {
      listService.messages.subscribe(msg => {
        console.log("wc-user: " + msg);
        this.getMessage(msg)
      });

    } catch (e) {
      console.log("Mất kết nối!")
    }

  }

  show(msg){
    console.log("msg: " + msg)
  }

  search() {
    this.listService.createWS(this.formSearch.value.search)

    try {
      this.listService.messages.subscribe(msg => {
        console.log("wc-user: " + msg);
        this.getMessage(msg)
        this.show(msg)
      });

    } catch (e) {
      console.log("Mất kết nối!")
    }
  }

  private  firstTime = true
  private subscription: Subscription;
  public count = 5
  private getTimeDifference(msg) {
      this.count--;
      console.log(this.count)
      if(this.count == 0){
        this.getAllOfList(this.page)
        this.count = 5
        this.subscription.remove(this.subscription)
        this.subscription.unsubscribe()
    }
  }

  public list: List
  public dataList : number = 0
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
      if(this.dataList == 0){
        this.getAllOfList(this.page)
        this.dataList = this.list.data
      }
      // (2)
      else {
        // (3)
        if(this.dataList != this.list.data){
          // (4)
          if(this.firstTime){
            this.subscription = interval(1000)
                .subscribe(x => { this.getTimeDifference(msg); });
          } else {
            // (5)
            if(this.subscription.closed){
              this.subscription = interval(1000)
                  .subscribe(x => { this.getTimeDifference(msg); });
            }
          }
          this.dataList = this.list.data
        }
      }
      console.log("1")
      this.pagedData.totalItems = this.dataList
      this.pagedData.totalPages = this.dataList/this.itemOnPage
      if(this.dataList%this.itemOnPage>0){
        this.pagedData.totalPages+=1
      }
    } catch (e) {

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
  customCheckboxOnSelect({ selected }) {
    this.chkBoxSelected.splice(0, this.chkBoxSelected.length);
    this.chkBoxSelected.push(...selected);
  }
  /**
   * For ref only, log selected values
   *
   * @param selected
   */
  onSelect({ selected }) {
    console.log("Select Event", selected, this.selected);
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  // choosePage(page){
  //   console.log("page: " + page)
  //   this.pagedData.currentPage = page;
  // }

  getAllOfList(page) {
    console.log("page: " + page)
    // this.listService.createWS(this.formSearch.value.search)
    this.isLoading=true;
    this.pagedData.currentPage = page;
    this.pagedData.size = this.itemOnPage;
    this.listService.getAllOfList(this.formSearch.value.search,this.pagedData.currentPage + 1, this.pagedData.size
    ).subscribe((res: any) => {
      console.log(res.data)
      if (res.isSuccess === true) {
        this.rowsData = res.data;
        console.log("pagedData" + this.pagedData)

        this.isHasResult = true;
        this._toastService.success(
            res.message,
            "Thành công",
            {toastClass: "toast ngx-toastr", closeButton: true}
        );
      }

      // and vice versa
      if (res.result === false) {
        this._toastService.error(
            res.message,
            "Thất Bại",
            {toastClass: "toast ngx-toastr", closeButton: true}
        );
      }
      this.isLoading=false;// Kết thcú load dữ liệu sẽ đóng load dữ liệu
    })

  }

  edit(modalForm, row) {

  }

  detail(modalForm, row) {

  }

  // image = null
  // this.image = this.sanitization.bypassSecurityTrustStyle(`url(${element.image})`);


  /**
   * On init
   */
  ngOnInit() {
    this.contentHeader = {
      headerTitle: 'List',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'List',
            isLink: true,
            link: '/list'
          }
        ]
      }
    }
  }

}
