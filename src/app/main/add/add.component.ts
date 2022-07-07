import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {takeUntil} from "rxjs/operators";
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {FlatpickrOptions} from "ng2-flatpickr";
import {FormBuilder, FormControl, FormGroup, NgForm} from "@angular/forms";
import Stepper from "bs-stepper";
import {ResultService} from "../result/service/result.service";
import {AddService} from "./services/add.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgxMaskModule, IConfig} from 'ngx-mask'
import {ChoiceTimeService} from "./choice-time/choice-time.service";
import {ContentHeader} from "../../layout/components/content-header/content-header.component";
// import { MatInputModule, MatTableModule, MatPaginatorModule, MatSortModule }
//     from '@angular/material';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddComponent implements OnInit {
// Public
    public url = this.router.url
    public urlLastValue

    public avatarImage: string
    public faceImage: string

    @ViewChild('accountForm') accountForm: NgForm

    // Private
    private _unsubscribeAll: Subject<any>
    public contentHeader: ContentHeader
    form: FormGroup;

    constructor(
        private router: Router,
        public fb: FormBuilder,
        private addService: AddService,
        private modal: NgbModal,
    ) {
        this._unsubscribeAll = new Subject();
        this.urlLastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
        this.form = this.fb.group({
            firstName: [null]
        })
  }

    /**
     * Upload Image
     *
     * @param event
     */
    uploadAvatar(event: any) {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();

            reader.onload = (event: any) => {
                this.avatarImage = event.target.result;
            };
            this.avatarImageFile = event.target.files[0]
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    removeAvatar() {
        this.avatarImage = null
        this.avatarImageFile = null
    }

    uploadImage(event: any) {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();

            reader.onload = (event: any) => {
                this.faceImage = event.target.result;
            };
            this.faceImageFile = event.target.files[0]
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    removeImage() {
        this.faceImage = null
        this.faceImageFile = null
    }

    public name = null
    public birthDay = null
    public email = null
    public mobile = null
    public integrationKey = null
    public companyId = null
    public companyName
    public departmentId
    public departmentName
    public avatarImageFile
    public faceImageFile
    public gender = 1
    public activeStatus = "ACTIVE"

    selectMale() {
        this.gender = 0
    }

    selectFemale() {
        this.gender = 1
    }

    public notify

    submit(modalForm) {
        if (this.accountForm.valid) {

            // console.log(this.birthDate)
            // console.log(new Date(this.birthDate.year, this.birthDate.month, this.birthDate.day))
            // var birth = new Date(this.birthDate.year, this.birthDate.month, this.birthDate.day)
            // console.log(birth.getUTCDate())
            // const formData = new FormGroup({
            //     email: new FormControl(this.email),
            //     name: new FormControl(this.name),
            //     birthDay: new FormControl(this.birthDate.year+"-"+this.birthDate.month+"-"+this.birthDate.day+"T00:00:00.000Z"),
            //     gender: new FormControl(this.gender),
            //     integrationKey: new FormControl(this.integrationKey),
            //     phone: new FormControl(this.mobile),
            //     activeStatus: new FormControl(this.activeStatus),
            //     companyId: new FormControl(this.companyId),
            //     companyName: new FormControl(this.companyName),
            //     departmentId: new FormControl(this.departmentId),
            //     departmentName: new FormControl(this.departmentName),
            //     avatar: new FormControl(this.avatarImageFile),
            //     faceImage: new FormControl(this.faceImageFile),
            //
            // });
            const formData = new FormData();
            formData.append("email", this.email);
            formData.append("name", this.name);
            // formData.append("birthDay", this.birthDate.split("/")[2]+"-"+this.birthDate.split("/")[1]+"-"+this.birthDate.split("/")[0]+"T00:00:00.000Z");
            formData.append("birthDay", this.birthDay.substring(4, this.birthDay.length)
                + "-" + this.birthDay.substring(2, 4)
                + "-" + this.birthDay.substring(0, 2)
                + "T00:00:00.000Z");
            formData.append("gender", this.gender + "");
            formData.append("integrationKey", this.integrationKey);
            formData.append("phone", this.mobile);
            formData.append("activeStatus", this.activeStatus);
            formData.append("companyId", this.companyId);
            formData.append("companyName", this.companyName);
            formData.append("departmentId", this.departmentId);
            formData.append("departmentName", this.departmentName);
            formData.append("avatar", this.avatarImageFile);
            formData.append("faceImage", this.faceImageFile);
            console.log(formData)
                this.addService.postData(formData).subscribe((res: any) => {
                    console.log(res)
                    if (res.isSuccess === true) {
                        this.notify = res.message
                    }
                    // and vice versa
                    if (res.isSuccess === false) {
                        this.notify = "Thất bại: " + res.message
                    }
                    this.modal.open(modalForm, {size: 'lg'})
                })
        } else {
            this.modernHorizontalPrevious()
        }
    }


    /**
     * Modern Horizontal Wizard Stepper Next
     */
    modernHorizontalNext() {
        this.modernWizardStepper.next();
    }

    /**
     * Modern Horizontal Wizard Stepper Previous
     */
    modernHorizontalPrevious() {
        this.modernWizardStepper.previous();
    }


    // private
    private modernWizardStepper: Stepper;
    private bsStepper;

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------
    /**
     * On init
     */
    ngOnInit(): void {
        this.modernWizardStepper = new Stepper(document.querySelector('#stepper3'), {
            linear: false,
            animation: true
        });

        this.bsStepper = document.querySelectorAll('.bs-stepper');
        this.contentHeader = {
            headerTitle: 'Add',
            actionButton: true,
            breadcrumb: {
                type: '',
                links: [
                    {
                        name: 'Add',
                        isLink: true,
                        link: '/add'
                    }
                ]
            }
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getBirthDay($event: string) {
        console.log("$event: " +$event)
        this.birthDay = $event
    }
}

