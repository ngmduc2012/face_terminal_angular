import {Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild, ViewEncapsulation} from '@angular/core';
import {takeUntil} from "rxjs/operators";
import {Router} from "@angular/router";
import {async, Observable, Subject} from "rxjs";
import {FlatpickrOptions} from "ng2-flatpickr";
import {FormBuilder, FormControl, FormGroup, NgForm} from "@angular/forms";
import Stepper from "bs-stepper";
import {ResultService} from "../result/service/result.service";
import {AddService} from "./services/add.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
// import * as faceapi from '@vladmandic/face-api/dist/face-api.esm.js';
// import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
// import * as faceMesh from "@tensorflow-models/facemesh";
import * as cam from "@mediapipe/camera_utils";

import {FaceMesh} from "@mediapipe/face_mesh/face_mesh";

// import {
//     detectAllFaces,
//     TinyFaceDetectorOptions,
//     nets,
//     matchDimensions,
//     resizeResults,
//     draw,
//     createCanvasFromMedia,
//     createCanvas,
//     detectFaceLandmarksTiny,
//     detectFaceLandmarks,
//     FaceLandmarks68,
//     detectSingleFace, SsdMobilenetv1Options, MtcnnOptions,
// } from 'face-api.js'
import {NgxMaskModule, IConfig} from 'ngx-mask'
import {ChoiceTimeService} from "./choice-time/choice-time.service";
import {ContentHeader} from "../../layout/components/content-header/content-header.component";
import {WebcamImage, WebcamInitError, WebcamUtil} from "ngx-webcam";
import {isPlatformBrowser} from "@angular/common";
// import { MatInputModule, MatTableModule, MatPaginatorModule, MatSortModule }
//     from '@angular/material';
import * as THREE from 'three';
import {
    MediaPipeFaceMeshMediaPipeEstimationConfig,
    MediaPipeFaceMeshMediaPipeModelConfig
} from "@tensorflow-models/face-landmarks-detection";

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
        @Inject(PLATFORM_ID) private _platform: Object
    ) {
        this._unsubscribeAll = new Subject();
        this.urlLastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
        this.form = this.fb.group({
            firstName: [null]
        })


        // const MODEL_URL = '/assets/weights';
        // Promise.all([
        //
        //     faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        //     // faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        //     // nets.mtcnn.loadFromUri(MODEL_URL),
        //     faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        //     faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        //     faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        // ]).then((val) => {
        //     // console here gives an array of undefined
        //     console.log(val)
        //     this.onStart()
        // }).catch((err) => {
        //     console.log(err)
        // })
        // this.onStart()
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


    public name = "84973747012"
    public birthDay = "15121998"
    public email = "ngmduc2012@gmail.com"
    public mobile = "84973747012"
    public integrationKey = "84973747012"
    public companyId = "84973747012"
    public companyName = "84973747012"
    public departmentId = "84973747012"
    public departmentName = "84973747012"
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

    submit() {
        if (this.accountForm.valid) {
            if(this.isCheckQuality){
                this.notify = "Vui lòng chờ kiểm tra chất lượng hình ảnh!"
                this.modal.open(this.modalForm, {size: 'lg'})
            } else {
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
                        this.modal.open(this.modalForm, {size: 'lg'})
                    },
                    (error: any) => {
                        console.log(error)
                        this.notify = "Gửi dữ liệu thất bại: " + error.message
                        this.modal.open(this.modalForm, {size: 'lg'})
                    },
                )
            }

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

    public faceMesh: FaceMesh;
    public camera



    async ngOnInit(): Promise<void> {
        await this.onFindDevice()

        this.setDefault()

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

        this.faceMesh = new FaceMesh({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
            },
        });

        this.faceMesh.setOptions({
            maxNumFaces: 2,
            enableFaceGeometry: true,
            refineLandmarks: false,
            minDetectionConfidence: 0.50,
            minTrackingConfidence: 0.50
        });

        this.faceMesh.onResults((r) => this.onResults(r, this));


        this.camera = new cam.Camera(this.video.nativeElement, {
            onFrame: async () => {
                await this.faceMesh.send({image: this.video.nativeElement});
            },
            width: this.WIDTH,
            height: this.HEIGHT,
        });
        await this.camera.start();



        // console.log('loading mobilenet model...');
        // this.model = await mobilenet.load();
        // this.model = await faceLandmarksDetection.load(faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);
        // const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
        // const detectorConfig: MediaPipeFaceMeshMediaPipeModelConfig = {
        //     runtime: 'mediapipe', // or 'tfjs'
        //     refineLandmarks: false,
        //     solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
        // }
        // const detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
        // console.log('Successfully loaded model');


        // WebcamUtil.getAvailableVideoInputs()
        //     .then((mediaDevices: MediaDeviceInfo[]) => {
        //         console.log(mediaDevices)
        //         // this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
        //     });


        // this.video.nativeElement.addEventListener('play', async () => {
        //     try {

        // const canvas = createCanvasFromMedia(this.video.nativeElement)
        // // document.querySelector("#video").append(canvas)
        // const canvas = createCanvas(this.video.nativeElement)
        // document.body.append(this.canvas.nativeElement)
        // const displaysize = {
        //     width: this.video.nativeElement.width
        //     ,
        //     height: this.video.nativeElement.height
        // }
        // faceapi.matchDimensions(this.canvas.nativeElement, displaysize)


        // await faceMesh.send({ image: this.video.nativeElement});
        // this.canvas.nativeElement.width = displaysize.width
        // this.canvas.nativeElement.height = displaysize.height
        // setInterval(async () => {
        //
        //
        //     const estimationConfig = {flipHorizontal: false};
        //     const faces = await detector.estimateFaces(this.video.nativeElement, estimationConfig );
        //     console.log(faces.length)
        //     if (faces.length > 0) {
        //         for (let i = 0; i < faces.length; i++) {
        //             console.log(faces[i])
        //
        //             // const pt_matrix = faces[i].getPoseTransformMatrix().getPackedDataList();
        //             // const pt_matrix_three_js_format = new THREE.Matrix4().fromArray(pt_matrix);
        //             // const euler_angles = new THREE.Euler().setFromRotationMatrix(pt_matrix_three_js_format, 'XYZ');
        //             // const x = Math.round(THREE.MathUtils.radToDeg(euler_angles['x'])); //x
        //             // const y = Math.round(THREE.MathUtils.radToDeg(euler_angles['y'])); //y
        //             // const z = Math.round(THREE.MathUtils.radToDeg(euler_angles['z'])); //z
        //
        //         }
        //     }


//                     const detection = await faceapi.detectSingleFace(this.video.nativeElement,
//                         new faceapi.TinyFaceDetectorOptions()
//                     ).withFaceLandmarks().withFaceExpressions()
//                     // console.log(detection)
//                     // console.log(detection.landmarks.angle.pitch)
//                     if (detection != null) {
//                         // console.log("x0: " + detection.angle.yaw)
//                         // console.log("y0: " + detection.angle.pitch)
//                         // console.log("z0: " + detection.angle.roll)
//
//                         const x = Math.round(THREE.MathUtils.radToDeg(detection.angle.yaw)) + 37; //x
//                         const y = Math.round(THREE.MathUtils.radToDeg(detection.angle.pitch)); //y
//                         const z = Math.round(THREE.MathUtils.radToDeg(detection.angle.roll) + 5); //z
//
//                         // console.log("x: " + x)
//                         // console.log("y: " + y)
//                         // console.log("z: " + z)
//                         // console.log("z: " + detection.angle.yaw)
//                         // if(detection.length>=1) {
//                         this.ctxStatic.clearRect(0, 0, this.canvas.nativeElement.width,
//                             this.canvas.nativeElement.height)
//
//                         // console.log(this.video.nativeElement.width)
//                         // console.log(this.video.nativeElement.height)
//
//                         // for (let i = 0; i < detection.landmarks.positions.length; i++) {
//                         //     this.ctxStatic.fillStyle = 'red';
//                         //     this.ctxStatic.fillRect(
//                         //         detection.landmarks.positions[i].x,
//                         //         detection.landmarks.positions[i].y,
//                         //         5,
//                         //         5);
//                         // }
//
//                         // Độ rộng khung trong
//                         // const circleWidth = 2 * this.getWidthFace(
//                         //     detection.landmarks.positions[1].x,
//                         //     detection.landmarks.positions[1].y,
//                         //     detection.landmarks.positions[15].x,
//                         //     detection.landmarks.positions[15].y
//                         // );
//                         const circleWidth = this.WIDTH < this.HEIGHT ? this.WIDTH : this.HEIGHT
//
//                         // bán kính đường tròn
//                         // const radius = circleWidth < this.HEIGHT ? Math.floor(circleWidth / 2) : Math.floor(this.HEIGHT / 2)
//                         const radius = circleWidth / 2
//
//                         // Tâm đường tròn
//                         // const circleCenter = this.getPontFace(
//                         //     detection.landmarks.positions[1].x,
//                         //     detection.landmarks.positions[1].y,
//                         //     detection.landmarks.positions[15].x,
//                         //     detection.landmarks.positions[15].y)
//                         const circleCenter = {x: this.WIDTH / 2, y: this.HEIGHT / 2}
//
//                         //circle
//                         this.ctxStatic.fillStyle = "rgba(255, 255, 255, 0.7)";
//                         this.ctxStatic.beginPath();
//                         this.ctxStatic.arc(circleCenter.x,
//                             circleCenter.y,
//                             radius,
//                             0,
//                             2 * Math.PI);
//
//                         //blur
//                         this.ctxStatic.rect(this.WIDTH, 0, -this.WIDTH, this.HEIGHT);
//                         this.ctxStatic.fill();
//
// // Đường màu Xanh
//                         // Đường dọc
//                         this.ctxStatic.lineWidth = 3;
//                         this.ctxStatic.strokeStyle = "blue";
//                         this.ctxStatic.beginPath();
//                         this.ctxStatic.moveTo(circleCenter.x,
//                             circleCenter.y - radius);
//                         this.ctxStatic.quadraticCurveTo(circleCenter.x,
//                             circleCenter.y,
//                             circleCenter.x,
//                             circleCenter.y + radius);
//                         this.ctxStatic.stroke();
//
//                         // Đường ngang
//                         this.ctxStatic.beginPath();
//                         this.ctxStatic.moveTo(circleCenter.x - radius,
//                             circleCenter.y);
//                         this.ctxStatic.quadraticCurveTo(circleCenter.x,
//                             circleCenter.y,
//                             circleCenter.x + radius,
//                             circleCenter.y);
//                         this.ctxStatic.stroke();
//
// // Đường màu đỏ
//                         // Đường dọc
//                         this.ctxStatic.lineWidth = 3;
//                         this.ctxStatic.strokeStyle = "red";
//                         this.ctxStatic.beginPath();
//                         this.ctxStatic.moveTo(circleCenter.x,
//                             circleCenter.y - radius);
//                         this.ctxStatic.quadraticCurveTo(
//                             // detection.landmarks.positions[29].x,
//                             // detection.landmarks.positions[29].y,
//                             circleCenter.x + -y * 3,
//                             circleCenter.y + -x * 3,
//                             circleCenter.x,
//                             circleCenter.y + radius);
//                         this.ctxStatic.stroke();
//
//                         // Đường ngang
//                         this.ctxStatic.beginPath();
//                         this.ctxStatic.moveTo(circleCenter.x - radius,
//                             circleCenter.y);
//                         this.ctxStatic.quadraticCurveTo(
//                             // detection.landmarks.positions[29].x,
//                             // detection.landmarks.positions[29].y,
//                             circleCenter.x + -y * 3,
//                             circleCenter.y + -x * 3,
//                             circleCenter.x + radius,
//                             circleCenter.y);
//                         this.ctxStatic.stroke();
//
//                         // const resixedDetections = faceapi.resizeResults(detection, displaysize)
//                         // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
//                         // faceapi.draw.drawDetections(this.canvas.nativeElement, resixedDetections)
//                         // faceapi.draw.drawFaceExpressions(this.canvas.nativeElement, resixedDetections)
//                         // faceapi.draw.drawFaceLandmarks(this.canvas.nativeElement, resixedDetections)
//                         const faceImage = this.getFaceImage(circleCenter.x, circleCenter.y, radius)
//                         if (x > circleCenter.x
//                             && x - 5 < circleCenter.x) {
//                             console.log("capture")
//                             this.capture(faceImage.x, faceImage.y, faceImage.w, faceImage.h)
//                         }
//
//                     } else {
//                         this.ctxStatic.clearRect(0, 0, this.canvas.nativeElement.width,
//                             this.canvas.nativeElement.height)
//                         //blur
//                         this.ctxStatic.rect(this.WIDTH, 0, -this.WIDTH, this.HEIGHT);
//                         this.ctxStatic.fill();
//                     }
//                 }, 10)
//             } catch (e) {
//                 console.log(e)
//             }
//         })


        this.ctxStatic = this.canvasStatic.nativeElement.getContext('2d');
        this.ctxDynamic = this.canvasDynamic.nativeElement.getContext('2d');
        this.ctxImage = this.canvasImage.nativeElement.getContext('2d');
        this.video.nativeElement.addEventListener('play', async () => {
            this.canvasStatic.nativeElement.width = this.video.nativeElement.width
            this.canvasStatic.nativeElement.height = this.video.nativeElement.height

            this.canvasDynamic.nativeElement.width = this.video.nativeElement.width
            this.canvasDynamic.nativeElement.height = this.video.nativeElement.height

            this.canvasImage.nativeElement.width = this.video.nativeElement.width > this.video.nativeElement.height ?
                this.video.nativeElement.height : this.video.nativeElement.width
            this.canvasImage.nativeElement.height = this.video.nativeElement.height > this.video.nativeElement.width ?
                this.video.nativeElement.width : this.video.nativeElement.height

            this.autoChangeCanvasStatic()

            setInterval(async () => {

                //Xóa
                this.ctxDynamic.clearRect(0, 0, this.canvasDynamic.nativeElement.width,
                    this.canvasDynamic.nativeElement.height)

                if (this.isOpenCamera) {

                    if (this.type != "DONE") {
                        // Đường màu đỏ
                        // Đường dọc
                        this.ctxDynamic.lineWidth = 3;
                        this.ctxDynamic.strokeStyle = "red";
                        this.ctxDynamic.beginPath();
                        this.ctxDynamic.moveTo(this.circleCenter.x,
                            this.circleCenter.y - this.radius);
                        this.ctxDynamic.quadraticCurveTo(
                            // detection.landmarks.positions[29].x,
                            // detection.landmarks.positions[29].y,
                            this.circleCenter.x + this.y * 3,
                            this.circleCenter.y + this.x * 3,
                            this.circleCenter.x,
                            this.circleCenter.y + this.radius);
                        this.ctxDynamic.stroke();

                        // Đường ngang
                        this.ctxDynamic.beginPath();
                        this.ctxDynamic.moveTo(this.circleCenter.x - this.radius,
                            this.circleCenter.y);
                        this.ctxDynamic.quadraticCurveTo(
                            // detection.landmarks.positions[29].x,
                            // detection.landmarks.positions[29].y,
                            this.circleCenter.x + this.y * 3,
                            this.circleCenter.y + this.x * 3,
                            this.circleCenter.x + this.radius,
                            this.circleCenter.y);
                        this.ctxDynamic.stroke();
                    }

                    // this.ctxDynamic.fillStyle = 'red';
                    // this.ctxDynamic.fillRect(
                    //     this.topFace.x,
                    //     this.topFace.y,
                    //     5,
                    //     5);
                    //
                    // this.ctxDynamic.fillStyle = 'red';
                    // this.ctxDynamic.fillRect(
                    //     this.leftFace.x,
                    //     this.leftFace.y,
                    //     5,
                    //     5);
                    // this.ctxDynamic.fillStyle = 'red';
                    // this.ctxDynamic.fillRect(
                    //     this.rightFace.x,
                    //     this.rightFace.y,
                    //     5,
                    //     5);
                    // this.ctxDynamic.fillStyle = 'red';
                    // this.ctxDynamic.fillRect(
                    //     this.bottomFace.x,
                    //     this.bottomFace.y,
                    //     5,
                    //     5);


                    let isInFrame = this.inTheFrame(this.topFace.x, this.topFace.y)
                        && this.inTheFrame(this.bottomFace.x, this.bottomFace.y)
                        && this.inTheFrame(this.leftFace.x, this.leftFace.y)
                        && this.inTheFrame(this.rightFace.x, this.rightFace.y)


                    if (isInFrame && this.type != "DONE") {
                        for (let i = 0; i < this.faceImages.length; i++) {
                            if (this.faceImages[i].type == this.type && !this.faceImages[i].isCapture) {

                                if (this.faceImages[i].minX > this.x) this.notifyCamera = {
                                    detail: this.DOWN,
                                    type: this.warning
                                }
                                if (this.faceImages[i].maxX < this.x) this.notifyCamera = {
                                    detail: this.UP,
                                    type: this.warning
                                }
                                if (this.faceImages[i].minY > this.y) this.notifyCamera = {
                                    detail: this.LEFT,
                                    type: this.warning
                                }
                                if (this.faceImages[i].maxY < this.y) this.notifyCamera = {
                                    detail: this.RIGHT,
                                    type: this.warning
                                }

                                if (this.faceImages[i].minX < this.x && this.faceImages[i].maxX > this.x
                                    && this.faceImages[i].minY < this.y && this.faceImages[i].maxY > this.y
                                ) {
                                    /**(1)*/
                                    if (!this.isRunningTimer) {
                                        this.startTimer()
                                    } else {
                                        /**(2)*/
                                        this.notifyCamera = {detail: "Giữ nguyên khuôn mặt", type: this.success}
                                    }
                                    if (this.isGetImageCallback) {
                                        const faceImage = this.getFaceImage()
                                        this.capture(i, faceImage.x, faceImage.y, faceImage.w, faceImage.h)
                                        this.faceImages[i].isCapture = true
                                        this.autoChangeType()
                                        this.autoChangeCanvasStatic()
                                        /**(6)*/
                                        this.stopTimer()
                                    }
                                    break;
                                } else {
                                    this.stopTimer()
                                }

                            }
                        }
                    } else {
                        this.stopTimer()
                    }

                    if (isInFrame && this.type != "DONE") {

                    } else {
                        if (this.type == "DONE") {
                            this.notifyCamera = {detail: this.CAPTURDONE, type: this.success}
                        } else {
                            this.notifyCamera = {detail: this.FACEINCIRCLE, type: this.danger}
                        }
                    }

                    if (this.isMoreFace) {
                        this.notifyCamera = {detail: this.MOREFACE, type: this.danger}
                    }

                } else {

                    this.ctxStatic.clearRect(0, 0, this.canvasStatic.nativeElement.width,
                        this.canvasStatic.nativeElement.height)
                    this.ctxStatic.fillStyle = "rgba(255, 255, 255, 0.8)";
                    this.ctxStatic.beginPath();
                    //blur
                    this.ctxStatic.rect(this.WIDTH, 0, -this.WIDTH, this.HEIGHT);
                    this.ctxStatic.fill();
                }

            })


        })

    }

    setDefault() {
        this.faceImages = [
            {
                minX: 0 - this.distance,
                maxX: 0 + this.distance,
                minY: 0 - this.distance,
                maxY: 0 + this.distance,
                type: "CENTER",
                isCapture: false,
                data: null,
                flipData: null,
                error: [],
                isQualified: null,
                isSamePerson: null
            },
            {

                minX: 0 - this.distance,
                maxX: 0 + this.distance,
                minY: -12 - this.distance,
                maxY: -12 + this.distance,
                type: "RIGHT",
                isCapture: false,
                data: null,
                flipData: null,
                error: [],
                isQualified: null,
                isSamePerson: null
            },
            {
                minX: 0 - this.distance,
                maxX: 0 + this.distance,
                minY: 12 - this.distance,
                maxY: 12 + this.distance,
                type: "LEFT",
                isCapture: false,
                data: null,
                flipData: null,
                error: [],
                isQualified: null,
                isSamePerson: null
            },
            {
                minX: 12 - this.distance,
                maxX: 12 + this.distance,
                minY: 0 - this.distance,
                maxY: 0 + this.distance,
                type: "BOTTOM",
                isCapture: false,
                data: null,
                flipData: null,
                error: [],
                isQualified: null,
                isSamePerson: null
            },
            {
                minX: 12 - this.distance,
                maxX: 12 + this.distance,
                minY: -12 - this.distance,
                maxY: -12 + this.distance,
                type: "RIGHT-BOTTOM",
                isCapture: false,
                data: null,
                flipData: null,
                error: [],
                isQualified: null,
                isSamePerson: null
            },
            {
                minX: 12 - this.distance,
                maxX: 12 + this.distance,
                minY: 12 - this.distance,
                maxY: 12 + this.distance,
                type: "LEFT-BOTTOM",
                isCapture: false,
                data: null,
                flipData: null,
                error: [],
                isQualified: null,
                isSamePerson: null
            }
        ]
        this.type = this.faceImages[0].type
    }

    reCaptureAll() {
        this.setDefault()
        this.autoChangeCanvasStatic()
    }

    inTheFrame(x, y) {
        return this.circleCenter.x - this.radius < x
            && x < this.circleCenter.x + this.radius
            && this.circleCenter.y - this.radius < y
            && y < this.circleCenter.y + this.radius;
    }

    primary = 'primary'
    secondary = 'secondary'
    success = 'success'
    danger = 'danger'
    warning = 'warning'
    info = 'info'
    dark = 'dark'

    //Dùng để trỏ vào loại góc mặt cần lấy.
    type
    notifyCamera = {detail: null, type: this.primary}

    FACEINCIRCLE = "Để mặt vào trong khung tròn!"
    CAPTURDONE = "Đã chụp xong"
    UP = "Lên trên một chút"
    DOWN = "Xuống dưới một chút"
    LEFT = "Sang trái một chút"
    RIGHT = "Sang phải một chút"
    NODEIVCE = "Không thể tìm thấy camera"
    MOREFACE = "Có nhiều hơn 1 khuôn mặt trong khung hình"

    drawCanvasStatic(x, y) {
        // Đường màu Xanh
        // Đường dọc
        this.ctxStatic.lineWidth = 3;
        this.ctxStatic.strokeStyle = "blue";
        this.ctxStatic.beginPath();
        this.ctxStatic.moveTo(this.circleCenter.x,
            this.circleCenter.y - this.radius);
        this.ctxStatic.quadraticCurveTo(
            this.circleCenter.x + y,
            this.circleCenter.y + x,
            this.circleCenter.x,
            this.circleCenter.y + this.radius);
        this.ctxStatic.stroke();

        // Đường ngang
        this.ctxStatic.beginPath();
        this.ctxStatic.moveTo(this.circleCenter.x - this.radius,
            this.circleCenter.y);
        this.ctxStatic.quadraticCurveTo(
            this.circleCenter.x + y,
            this.circleCenter.y + x,
            this.circleCenter.x + this.radius,
            this.circleCenter.y);
        this.ctxStatic.stroke();
    }

    autoChangeCanvasStatic() {
        this.ctxStatic.clearRect(0, 0, this.canvasStatic.nativeElement.width,
            this.canvasStatic.nativeElement.height)
        //circle
        this.ctxStatic.fillStyle = "rgba(255, 255, 255, 0.7)";
        this.ctxStatic.beginPath();
        this.ctxStatic.arc(this.circleCenter.x,
            this.circleCenter.y,
            this.radius,
            0,
            2 * Math.PI);

        //blur
        this.ctxStatic.rect(this.WIDTH, 0, -this.WIDTH, this.HEIGHT);
        this.ctxStatic.fill();
        for (let i = 0; i < this.faceImages.length; i++) {
            if (this.type == this.faceImages[i].type) {
                this.drawCanvasStatic(
                    (this.faceImages[i].maxX + this.faceImages[i].minX) / 2 * 3,
                    (this.faceImages[i].maxY + this.faceImages[i].minY) / 2 * 3)
            }
        }
        if (this.type == "DONE") {
            this.ctxStatic.clearRect(0, 0, this.canvasStatic.nativeElement.width,
                this.canvasStatic.nativeElement.height)
            this.ctxStatic.fillStyle = "rgba(255, 255, 255, 0.8)";
            this.ctxStatic.beginPath();
            //blur
            this.ctxStatic.rect(this.WIDTH, 0, -this.WIDTH, this.HEIGHT);
            this.ctxStatic.fill();
        }

    }

    x: number = 0
    y: number = 0
    z: number = 0

    centerFace = {x: 0, y: 0}
    topFace = {x: 0, y: 0}
    bottomFace = {x: 0, y: 0}
    leftFace = {x: 0, y: 0}
    rightFace = {x: 0, y: 0}

    distance = 4
    faceImages = []

isMoreFace =  false

    // Hàm xử lý hình ảnh nhận được.
    onResults(results, t) {
        // console.log("result: ")
        // console.log(results)
        if(results.multiFaceLandmarks.length>1){
            this.isMoreFace = true
        } else {
            this.isMoreFace = false
            if (results.multiFaceLandmarks) {
                for (const landmarks of results.multiFaceLandmarks) {
                    t.centerFace =
                        {
                            x: landmarks[1].x * t.WIDTH,
                            y: landmarks[1].y * t.HEIGHT
                        }

                    t.topFace =
                        {
                            x: landmarks[10].x * t.WIDTH,
                            y: landmarks[10].y * t.HEIGHT
                        }

                    t.bottomFace =
                        {
                            x: landmarks[152].x * t.WIDTH,
                            y: landmarks[152].y * t.HEIGHT
                        }

                    t.leftFace =
                        {
                            x: landmarks[234].x * t.WIDTH,
                            y: landmarks[234].y * t.HEIGHT
                        }

                    t.rightFace =
                        {
                            x: landmarks[454].x * t.WIDTH,
                            y: landmarks[454].y * t.HEIGHT
                        }

                }
            } else {
                t.centerFace = {x: 0, y: 0}
                t.topFace = {x: 0, y: 0}
                t.bottomFace = {x: 0, y: 0}
                t.leftFace = {x: 0, y: 0}
                t.rightFace = {x: 0, y: 0}
            }
            if (results.multiFaceGeometry) {
                for (const facegeometry of results.multiFaceGeometry) {
                    // console.log(facegeometry)
                    const pt_matrix = facegeometry.getPoseTransformMatrix().getPackedDataList();
                    const pt_matrix_three_js_format = new THREE.Matrix4().fromArray(pt_matrix);
                    const euler_angles = new THREE.Euler().setFromRotationMatrix(pt_matrix_three_js_format, 'XYZ');
                    const x = Math.round(THREE.MathUtils.radToDeg(euler_angles['x'])); //x
                    const y = Math.round(THREE.MathUtils.radToDeg(euler_angles['y'])); //y
                    const z = Math.round(THREE.MathUtils.radToDeg(euler_angles['z'])); //z

                    // console.log(x)
                    // console.log(y)
                    // console.log(z)

                    t.x = x
                    t.y = y
                    t.z = z

                    // // const element = document.getElementById("canvas1");
                    // // if (element) {
                    // //     element.remove();
                    // // }
                    // // var canvas = document.createElement('canvas')
                    // // canvas.id = "canvas1"
                    // // var ctxStatic = canvas.getContext('2d')
                    // t.ctxStatic.canvas.width = 640;
                    // t.ctxStatic.canvas.height = 480;
                    // const circleWidth = t.ctxStatic.canvas.width < t.ctxStatic.canvas.height ? t.ctxStatic.canvas.width : t.ctxStatic.canvas.height
                    // const radius = circleWidth / 2
                    // const circleCenter = {x: t.ctxStatic.canvas.width / 2, y: t.ctxStatic.canvas.height / 2}
                    // t.ctxStatic.lineWidth = 3;
                    // t.ctxStatic.strokeStyle = "red";
                    // t.ctxStatic.beginPath();
                    // t.ctxStatic.moveTo(circleCenter.x,
                    //     circleCenter.y - radius);
                    // t.ctxStatic.quadraticCurveTo(
                    //     // detection.landmarks.positions[29].x,
                    //     // detection.landmarks.positions[29].y,
                    //     circleCenter.x + y * 3,
                    //     circleCenter.y + x * 3,
                    //     circleCenter.x,
                    //     circleCenter.y + radius);
                    // t.ctxStatic.stroke();
                    //
                    // t.ctxStatic.beginPath();
                    // t.ctxStatic.moveTo(circleCenter.x - radius,
                    //     circleCenter.y);
                    // t.ctxStatic.quadraticCurveTo(
                    //     // detection.landmarks.positions[29].x,
                    //     // detection.landmarks.positions[29].y,
                    //     circleCenter.x + y * 3,
                    //     circleCenter.y + x * 3,
                    //     circleCenter.x + radius,
                    //     circleCenter.y);
                    // t.ctxStatic.stroke();
                    // // document.getElementById("videoElement").appendChild(canvas);
                }
            } else {
                t.x = 0
                t.y = 0
                t.z = 0
            }
        }
    };


    // Tính độ rộng mặt: d = Căn bậc 2 của tổng (y2-y1) bình + (x2 - x1) bình
    // getWidthFace(x1, y1, x2, y2) {
    //     return Math.floor(Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2)))
    // }
    getWidthFace() {
        return Math.floor(Math.sqrt(Math.pow(this.leftFace.y - this.rightFace.y, 2)
            + Math.pow(this.leftFace.x - this.rightFace.x, 2)))
    }

    getHeightFace() {
        return Math.floor(Math.sqrt(Math.pow(this.topFace.y - this.bottomFace.y, 2)
            + Math.pow(this.topFace.x - this.bottomFace.x, 2)))
    }

    // Tìm tâm điểm mặt: Lấy trung điểm của 2 điểm xa nhất mặt.
    // getPontFace(x1, y1, x2, y2) {
    //     return {x: Math.floor((x1 + x2) / 2), y: Math.floor((y1 + y2) / 2)}
    // }
    getPontFace() {
        return {
            x: Math.floor((this.leftFace.x + this.rightFace.x) / 2),
            y: Math.floor((this.leftFace.y + this.rightFace.y) / 2)
        }
    }

    // getFaceImage(x, y, r) {
    //     return {
    //         x: Math.floor(x - r),
    //         y: Math.floor(y - r),
    //         w: r * 2,
    //         h: r * 2
    //     }
    // }
    getFaceImage() {
        let w = this.getWidthFace()
        let h = this.getHeightFace()
        return {
            x: Math.floor(this.getPontFace().x - w),
            y: Math.floor(this.getPontFace().y - h),
            w: w * 2,
            h: h * 2
        }
    }

    // captures: string[] = [];
    // isCaptured: boolean;

    capture(i, x, y, w, h) {
        this.drawFlipImageToCanvas(this.video.nativeElement, x, y, w, h);
        // this.captures.push(this.canvasImage.nativeElement.toDataURL("image/png"));
        this.faceImages[i].data = this.canvasImage.nativeElement.toDataURL("image/png");
        this.drawImageToCanvas(this.video.nativeElement, x, y, w, h);
        this.faceImages[i].flipData = this.canvasImage.nativeElement.toDataURL("image/png");
        // this.captures.push(this.canvasImage.nativeElement.toDataURL("image/png"));
        // this.isCaptured = true;
    }

    drawImageToCanvas(image: any, x, y, w, h) {
        this.ctxImage.clearRect(0, 0, this.canvasImage.nativeElement.width,
            this.canvasImage.nativeElement.height)
        this.canvasImage.nativeElement
            .getContext("2d")
            .drawImage(image, x, y, w > h ? w : h, w > h ? w : h, 0, 0, this.WIDTH > this.HEIGHT ? this.WIDTH : this.HEIGHT, this.WIDTH > this.HEIGHT ? this.WIDTH : this.HEIGHT);
    }

    drawFlipImageToCanvas(image: any, x, y, w, h) {
        this.ctxImage.clearRect(0, 0, this.canvasImage.nativeElement.width,
            this.canvasImage.nativeElement.height)
        // this.canvasImage.nativeElement
        //     .getContext("2d").scale(-1,1);
        const horizontal = true;
        const vertical = false;
        this.ctxImage.setTransform(
            horizontal ? -1 : 1, 0, // set the direction of x axis
            0, vertical ? -1 : 1,   // set the direction of y axis
            0 + (horizontal ? (image.width > image.height ? image.height : image.width) : 0), // set the x origin
            0 + (vertical ? (image.width > image.height ? image.height : image.width) : 0)   // set the y origin
        );
        this.ctxImage
            .drawImage(image, x, y, w > h ? h : w, w > h ? h : w, 0, 0, this.WIDTH > this.HEIGHT ? this.HEIGHT : this.WIDTH, this.WIDTH > this.HEIGHT ? this.HEIGHT : this.WIDTH);
        this.ctxImage.restore();

        // this.mirrorImage(
        //     this.ctxImage,
        //     image,
        //     0,
        //     0,
        //     true,
        //     false,
        // );
        // scaleX by -1; this "trick" flips horizontally


        // draw the img
        // no need for x,y since we've already translated
        // ctx.drawImage(img,0,0);
    }


    // ctx : the context on which to draw the mirrored image
    // image : the image to mirror
    // x,y : the top left of the rendered image
    // horizontal : boolean if true mirror along X
    // vertical : boolean if true mirror along y
    mirrorImage(
        ctx,
        image,
        x = 0,
        y = 0,
        horizontal = false,
        vertical = false,
    ) {
        ctx.save();  // save the current canvas state
        ctx.setTransform(
            horizontal ? -1 : 1, 0, // set the direction of x axis
            0, vertical ? -1 : 1,   // set the direction of y axis
            x + (horizontal ? image.width : 0), // set the x origin
            y + (vertical ? image.height : 0)   // set the y origin
        );
        ctx.drawImage(image, 0, 0,);
        ctx.restore(); // restore the state as it was when this function was called
    }

    autoChangeType() {
        let isDone = false;
        for (let i = 0; i < this.faceImages.length; i++) {
            isDone = true
            if (!this.faceImages[i].isCapture) {
                this.type = this.faceImages[i].type;
                isDone = false
                break;
            }
        }
        if (isDone) {
            this.type = "DONE"
            this.quality().then(r => console.log("r: " + r))
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.onStop()
    }

    getBirthDay($event: string) {
        console.log("$event: " + $event)
        this.birthDay = $event
    }


    CACHE_KEY = 'httpCache'

    saveImageInCache($event) {
        localStorage[this.CACHE_KEY] = $event
        this.uploadImage = localStorage[this.CACHE_KEY]
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

    reCapture(type) {
        this.type = type
        for (let i = 0; i < this.faceImages.length; i++) {
            if (this.faceImages[i].type == type) {
                this.faceImages[i].isCapture = false;
                this.faceImages[i].data = null
                this.faceImages[i].flipData = null
                this.faceImages[i].isQualified = null
                this.faceImages[i].isSamePerson = null
                this.faceImages[i].error = []
            }
        }
        this.autoChangeCanvasStatic()
    }

    removeImage() {
        this.faceImage = null
        this.faceImageFile = null
    }

    // Camera
    // stream: any = null;
    // status: any = null;
    // trigger: Subject<void> = new Subject();
    // previewImage: string = '';
    // btnLabel: string = 'Capture image';
    //
    // //biến kích hoạt, trả về có sự kiện để quan sát.
    // get $trigger(): Observable<void> {
    //     return this.trigger.asObservable();
    // }
    //
    // // Khi (*) được kích hoạt, hàm sẽ nhận được ảnh trả về từ webcam
    // // Lấy hình ảnh đó lưu vào bộ nhớ tạm thời và hiển thị ra ngoài màn hình.
    // snapshot(event: WebcamImage) {
    //     this.saveImageInCache(event)
    //     console.log(event);
    //     this.previewImage = event.imageAsDataUrl;
    //     this.btnLabel = 'Re capture image'
    // }
    //
    // // Kiểm tra quyền truy cập cam, nếu không có lỗi gì thì sẽ trả về
    // // stream, nếu stream không rỗng thì hiển thị webcam
    // checkPermissions() {
    //     navigator.mediaDevices.getUserMedia({
    //         video: {
    //             // width: 500,
    //             // height: 500
    //         }
    //     }).then((res) => {
    //         console.log("response", res);
    //         res.addEventListener('play', () => {
    //             console.log("12344")
    //         })
    //         this.stream = res;
    //         this.status = 'My camera is accessing';
    //         this.btnLabel = 'Capture image';
    //     }).catch(err => {
    //         console.log(err);
    //         if (err?.message === 'Permission denied') {
    //             this.status = 'Permission denied please try again by approving the access';
    //         } else {
    //             this.status = 'You may not having camera system, Please try again ...';
    //         }
    //     })
    // }
    //
    // //Lấy hình ảnh
    // // (*)
    // captureImage() {
    //     this.trigger.next();
    // }
    //
    // //Hiển dữ liệu hình ảnh dưới dạng bas64
    // proceed() {
    //     console.log(this.previewImage);
    // }


    @ViewChild('video', {static: true}) video: ElementRef<HTMLVideoElement>;


    selectedDevice = null
    devices = []

    // Chọn nhiều cam: tham khảo constraints tại: https://webrtc.org/getting-started/media-devices
    async onFindDevice() {
        if (isPlatformBrowser(this._platform) && 'mediaDevices' in navigator) {
            await navigator.mediaDevices.enumerateDevices().then((devices) => {

                this.devices = devices.filter(device => device.kind === 'videoinput')
                console.log(devices)
                if (this.devices.length > 0) {
                    this.selectedDevice = this.devices[0]
                } else {
                    this.notifyCamera = {
                        detail: this.NODEIVCE,
                        type: this.danger
                    }
                }
                // devices[0].
            });
        }
    }

    isOpenCamera = true

    async onStart() {
        if (isPlatformBrowser(this._platform) && 'mediaDevices' in navigator && this.selectedDevice != null) {
            await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: this.selectedDevice.deviceId,
                },
            }).then((ms: MediaStream) => {
                const _video = this.video.nativeElement;
                _video.srcObject = ms;
                // Delay 0,5 giây nhằm mục đích đảm bảo video đã khởi tạo trước khi play để detect mặt.
                let timeLeft  = 1
                let interval = setInterval(async () => {
                    if (timeLeft > 0) {
                        timeLeft--;
                    } else {
                        await _video.play();
                        this.isOpenCamera = true
                        this.autoChangeCanvasStatic()
                        clearInterval(interval)
                    }
                },500)
            });
        }
    }

    async onSelectDevice(device) {
        this.selectedDevice = device
        await this.onStart()
        // await this.camera.start();
    }

    // stop both mic and camera
    stopBothVideoAndAudio(stream) {
        stream.getTracks().forEach(function (track) {
            if (track.readyState == 'live') {
                track.stop();
            }
        });
    }

    async onStop() {

        await this.camera.stop();
        this.stopBothVideoAndAudio(this.video.nativeElement.srcObject)
        this.isOpenCamera = false


        // navigator.getUserMedia({audio: false,   video: {
        //             deviceId: this.cameraId,
        //         },},
        //     function(stream) {
        //         // can also use getAudioTracks() or getVideoTracks()
        //         var track = stream.getTracks()[0];  // if only one media track
        //         // ...
        //         console.log(track)
        //         track.stop();
        //     },
        //     function(error){
        //         console.log('getUserMedia() error', error);
        //     });
    }

    @ViewChild('canvasStatic', {static: true})
    canvasStatic: ElementRef<HTMLCanvasElement>;

    private ctxStatic: CanvasRenderingContext2D;

    @ViewChild('canvasDynamic', {static: true})
    canvasDynamic: ElementRef<HTMLCanvasElement>;

    private ctxDynamic: CanvasRenderingContext2D;

    @ViewChild('canvasImage', {static: true})
    canvasImage: ElementRef<HTMLCanvasElement>;

    private ctxImage: CanvasRenderingContext2D;


    @ViewChild('modalForm')
    modalForm: ElementRef<HTMLCanvasElement>;

    // @ViewChild('SweetAlertError')
    // SweetAlertError: ElementRef<HTMLCanvasElement>;

    //Sử dụng đúng tỉ lệ khung hình của cam để không
    // bị lệch canvas
    WIDTH = 640;
    HEIGHT = 480;

    circleWidth = this.WIDTH < this.HEIGHT ? this.WIDTH : this.HEIGHT
    radius = this.circleWidth / 2

    circleCenter = {x: this.WIDTH / 2, y: this.HEIGHT / 2}


    /**
     * ################################################################################################
     * FUNCTION   : Waiting 0,5 seconds to take the image, The purpose is to make sure no-take the
     * blurry image due to moving.
     * DESCRIPTION:
     *
     * Overview: The first time matching coordinates, start [timer]. After around (1250 -500)
     * milliseconds, if still matching coordinates, take the image. Else, run again [timer]
     *
     * (1) Start running [timer] when the first time matching coordinates (The condition of x,y is
     * satisfied)
     * [isRunningTimer] help ensures the next time of matching coordinates, [timer] will not run again.
     * (2) Show the notification hold the face status to ensure (x,y) no changes
     * (3) when [timer] is less than 500 milliseconds, allow the device takes the image
     * ([isGetImageCallback] = true)
     * (4) when [timer] finish, to stop allow the device takes the image ([isGetImageCallback] = false)
     * and set [isRunningTimer] = false
     * (5) [timer] run again if (x,y) does not match the condition.
     * (6) Stop [timer] after capture image.
     * ------------------------------------------------------------------------------------------------
     * CHỨC NĂNG: Đợi 0,5 giây để chụp hình, mục đích nhằm đảo bảo ảnh không bị mờ do đang di chuyển.
     * MÔ TẢ    :
     *
     * Tổng quan: Lần đầu sau khi khớp tọa độ cần chụp, biến [timer] bắt đầu chạy. Sau khoảng dưới (1250
     * - 500) mili giây, nếu toạ độ vẫn khớp sẽ tiến hành lấy hình ảnh đó, nếu không sẽ tính lại [timer]
     * từ đầu.
     *
     * (1) Bắt đầu chạy [timer] khi khớp tọa độ lần đầu tiên (các điều kiện toạn độ x,y thỏa mãn)
     * Biến [isRunningTimer] đảm bảo răng lần khớp tọa độ sau, [timer] sẽ không bị khởi tạo lại lần 2
     * (2) Hiển thị thông báo giữ trạng thái khuôn mặt để đảm bảo tọa độ (x,y) không thay đổi
     * (3) Khi [timer] còn dưới 500 mili giây sẽ cho phép chụp hình ảnh (biến [isGetImageCallback] =
     * true)
     * (4) Khi [timer] kết thúc sẽ dừng cho phép lấy ảnh ([isGetImageCallback] = false) và tắt trạng
     * thái [timer] đang hoạt động ([isRunningTimer] = false)
     * (5) [timer] sẽ được tính lại từ đầu khi tọa độ (x,y) không thỏa mãn điều kiện
     * (6) Dừng [timer] sau khi chụp xong ảnh
     * ################################################################################################
     */
    isGetImageCallback: Boolean = false
    isRunningTimer: Boolean = false

    timeLeft: number = 1250;
    timer;

    startTimer() {
        this.timer = setInterval(() => {
            if (this.timeLeft > 0) {
                this.isRunningTimer = true
                this.timeLeft = this.timeLeft - 10;
                /**(3)*/
                if (this.timeLeft <= 500) this.isGetImageCallback = true
            } else {
                /**(4)*/
                this.timeLeft = 1250;
                this.isGetImageCallback = false
                this.isRunningTimer = false
            }
        }, 10)
    }

    /**(5)*/
    stopTimer() {
        if (this.timer != null) {
            clearInterval(this.timer);
            this.timeLeft = 1250;
            this.isGetImageCallback = false
            this.isRunningTimer = false
        }
    }


    isCheckQuality = false

    //Check quality
    async quality() {

        this.isCheckQuality = true
        const formData = new FormData();

        let center = await fetch(this.faceImages[0].data).then((res) => res.blob())
        let left = await fetch(this.faceImages[1].data).then((res) => res.blob())
        let right = await fetch(this.faceImages[2].data).then((res) => res.blob())
        let top = await fetch(this.faceImages[3].data).then((res) => res.blob())
        let topLeft = await fetch(this.faceImages[4].data).then((res) => res.blob())
        let topRight = await fetch(this.faceImages[5].data).then((res) => res.blob())
        if (center != null) formData.append("center", center)
        if (left != null) formData.append("right", left)
        if (right != null) formData.append("left", right)
        if (top != null) formData.append("top", top)
        if (topLeft != null) formData.append("topRight", topLeft)
        if (topRight != null) formData.append("topLeft", topRight)
        console.log(formData)
        this.addService.checkQuality(formData).subscribe((res: any) => {
                console.log("res: ")
                console.log(res)
                this.setQuality(res)
                this.isCheckQuality = false
            },
            (error: any) => {
                console.log(error)
                this.notify = "Check face quality thất bại: " + error.message
                this.modal.open(this.modalForm, {size: 'lg'})
                this.isCheckQuality = false
            },
        )
    }

    compile(res) {
        for (let i = 0; i < res.length; i++) {
            if (res[i].faceImageType == "Left") res[i].faceImageType = this.faceImages[2].type
            if (res[i].faceImageType == "Right") res[i].faceImageType = this.faceImages[1].type
            if (res[i].faceImageType == "TopLeft") res[i].faceImageType = this.faceImages[5].type
            if (res[i].faceImageType == "TopRight") res[i].faceImageType = this.faceImages[4].type
            if (res[i].faceImageType == "Top") res[i].faceImageType = this.faceImages[3].type
            if (res[i].faceImageType == "Center") res[i].faceImageType = this.faceImages[0].type
        }
        return res
    }

    errorCompile = [
        {
            code: "001",
            detail: "Hình ảnh không hợp lệ"
        },
        {
            code: "002",
            detail: "Không nhận diện được khuôn mặt"
        },
        {
            code: "003",
            detail: "Góc mặt không chính xác"
        },
        {
            code: "004",
            detail: "Ảnh mặt quá nhỏ"
        },
        {
            code: "005",
            detail: "Ảnh bị mờ"
        },
        {
            code: "006",
            detail: "Khuôn mặt bị che khuất"
        },
        {
            code: "007",
            detail: "Đang đeo khẩu trang"
        },
        {
            code: "008",
            detail: "Các hình ảnh không cùng một người"
        },
        {
            code: "009",
            detail: "Người dùng đã tồn tại với độ tương đồng"
        },
        {
            code: "010",
            detail: "Ảnh bị tối"
        },
    ]

    compileError(error) {
        let result = ""
        // console.log("error: ")
        // console.log(error)
        for (let i = 0; i < error.length; i++) {
            for (let j = 0; j < this.errorCompile.length; j++) {
                if (error[i].includes(this.errorCompile[j].code)) {
                    result += this.errorCompile[j].detail
                        + (error[i].replace(this.errorCompile[j].code, "").length > 0 ? ": " + error[i].replace(this.errorCompile[j].code, "") : "")
                        + (i == error.length - 1 ? "." : ", ")
                }
            }
        }
        return result
    }


    setQuality(res) {
        res = this.compile(res)
        for (let i = 0; i < res.length; i++) {
            for (let j = 0; j < this.faceImages.length; j++) {
                if (res[i].faceImageType == this.faceImages[j].type) {
                    this.faceImages[j].error = res[i].error
                    this.faceImages[j].isQualified = res[i].isQualified
                    this.faceImages[j].isSamePerson = res[i].isSamePerson
                }
            }
        }
        // console.log("res2: ")
        // console.log(this.faceImages)
    }

}

