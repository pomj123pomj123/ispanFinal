<template>
    <div class="row">
        <div class="col-4">
            <button type="button" class="btn btn-primary" @click="openModal('insert')">開啟新增</button>
        </div>

    </div>
    <br>
    <div class="row">
        <div class="col-4">
            <table>
                <tr>
                    <td>房型名稱：</td>
                    <td><input type="text" v-model="findRoomName" placeholder="請輸入房型名稱"></td>
                    <td>訂購人名：</td>
                    <td><input type="text" v-model="findLastName" placeholder="姓">
                        <input type="text" v-model="findFirstName" placeholder="名"></td>
                    <td>飯店：</td>
                    <td><select v-model="findhId"><option value="1">芳山飯店</option></select><br></td>
                    <td>訂單號碼：</td>
                    <td><input type="text" v-model="findOrderNumber" placeholder="請輸入訂單號碼"></td>
                </tr>
                <tr>
                    <td>付款狀態：</td>
                    <td>
                        <select v-model="findPaymentStatus">
                            <option value=""></option>
                            <option value="未付款">未付款</option>
                            <option value="已付款">已付款</option>
                            <option value="已付訂金">已付訂金</option>
                            <option value="退款中">退款中</option>
                            <option value="已退款">已退款</option>
                            <option value="超過付款時間">超過付款時間</option>
                        </select>
                    </td>
                    <td>訂單狀態：</td>
                    <td>
                        <select v-model="findBookingStatus">
                            <option value=""></option>
                            <option value="待確認">待確認</option>
                            <option value="已確認">已確認</option>
                            <option value="已入住">已入住</option>
                            <option value="已退房">已退房</option>
                            <option value="取消訂單">取消訂單</option>
                            <option value="訂單完成">訂單完成</option>
                        </select><br>
                    </td>
                    <td>專案：</td>
                    <td>
                        <select v-model="findPackName">
                            <option value=""></option>
                            <option v-for="pack in dpacks" :key="pack.ddId" :value="pack.packName">{{ pack.packName }}</option>
                        </select>
                    </td>
                    <td>折扣：</td>
                    <td>
                        <select v-model="findPromoName">
                            <option value=""></option>
                            <option v-for="promo in dpromos" :key="promo.ddId" :value="promo.dDName">{{ promo.dDName }}</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>當日住房訂單：</td>
                    <td><input type="date" v-model="findDate"></td>
                    <td>符合入住日期：</td>
                    <td><input type="date" v-model="findBeginDate"></td>
                    <td>符合退房日期：</td>
                    <td><input type="date" v-model="findLastDate"><br></td>
                </tr>
            </table>
            <!-- 未處理後端同時有專案和折扣的查詢 -->
            <button type="button" @click="callFind(0)">查詢</button>
        </div>
    </div>
    <div class="row">
        <div class="col-4">
            <BookingRows :total="total" :choices="[ 5, 10, 15]"
                        v-model="rows" @change="callFind"></BookingRows>
        </div>
        
        <div class="col-4" v-show="total!=0">
            <Paginate :first-last-button="true" first-button-text="&lt;&lt;"
                    last-button-text="&gt;&gt;" prev-text="&lt;" next-text="&gt;"
                    :page-count="pages" :initial-page="current" v-model="current"
                    :click-handler="callFind">
            </Paginate>
        </div>

        <div class="col-4">
            <button type="button" class="btn btn-primary" @click="changeDir" v-show="dir">排序：由新到舊</button>
            <button type="button" class="btn btn-primary" @click="changeDir" v-show="!dir">排序：由舊到新</button>
        </div>
    </div>
    <br>
    <div class="row">
        <table class="table table-striped table-bordered">
            <thead>
                <tr class="table-primary text-center">
                    <th scope="col">序號</th>
                    <th scope="col">訂單號碼</th>
                    <th scope="col">訂購時間</th>
                    <th scope="col">訂購日期</th>
                    <th scope="col">飯店名稱</th>
                    <th scope="col">房型</th>
                    <th scope="col">房間</th>
                    <th scope="col">總價／訂金</th>
                    <th scope="col">付款狀態</th>
                    <th scope="col">專案</th>
                    <th scope="col">折扣碼</th>
                    <th scope="col">訂房人</th>
                    <th scope="col">客戶備註</th>
                    <th scope="col">訂單狀態</th>
                    <th scope="col">取消</th>
                </tr>
            </thead>
            <tbody>
                <BookingCard v-for="booking, index in bookings" :key="booking.bId" :booking="booking" :index="index"
                        @update="callModify" @delete="callRemove">
                </BookingCard>
            </tbody>
        </table>


        
    </div>

    <BookingUpdateModal ref="bookingModalRef"
            :is-show-button-insert="isShowButtonInsert"
            v-model:firstName="newBookings.firstName"
            v-model:lastName="newBookings.lastName"
            v-model:identification="newBookings.identification"
            v-model:passportNumber="newBookings.passportNumber"
            v-model:country="newBookings.country"
            v-model:address="newBookings.address"
            v-model:allowPromotionMail="newBookings.allowPromotionMail"
            v-model:username="newBookings.username"
            v-model:email="newBookings.email"
            v-model:gender="newBookings.gender"
            v-model:birthday="newBookings.birthday"
            v-model:titleOfCourtesy="newBookings.titleOfCourtesy"
            v-model:tel="newBookings.tel"
            :isMember="isMember"
            @insert="callCreate" @addData = "addData">
    </BookingUpdateModal>
</template>

<script setup>
    import Swal from "sweetalert2"
    import axiosapi from "@/plugins/axios.js"
    import Paginate from "vuejs-paginate-next"
    import BookingCard from "@/components/bookingBack/BookingCard.vue";
    import BookingUpdateModal from "@/components/bookingBack/BookingUpdateModal.vue";
    import BookingRows from "@/components/bookingBack/BookingRows.vue";
    import { ref, onMounted } from "vue";
    import { useRouter } from "vue-router";

    const isDark = ref(false);

    const bookings = ref(null);
    const newBookings = ref({ });
    const bookingModalRef = ref(null);
    const isShowButtonInsert = ref(true);
    const router = useRouter();
    
    const findRoomName = ref("");
    const findhId = ref(1);
    const findFirstName = ref("");
    const findLastName = ref("");
    const findDate = ref("");
    const findBeginDate = ref("");
    const findLastDate = ref("");
    const findPaymentStatus = ref("");
    const findBookingStatus = ref("");
    const findPromoName = ref("");
    const findPackName = ref("");
    const findOrderNumber = ref("");

    const dpacks = ref([]);
    const dpromos = ref([]);

    

    //pagination start
    const total = ref(0);
    const pages = ref(100);
    const current = ref(50);
    const start = ref(0);
    const rows = ref(5);
    const lastPageRows = ref(0);
    const dir = ref(false)
    //pagination end

    const isMember = ref(false);

    //改變排序
    function changeDir(){
        dir.value=!dir.value;
        callFind();
    }

    function addData(){
        newBookings.value = {
            "firstName":"明志",
            "lastName":"吳",
            "identification":null,
            "passportNumber":"C04627109",
            "country":"美國",
            "address":"紐約市皇后區",
            "allowPromotionMail":"是",
            "username":null,
            "email":"min@gmail.com",
            "gender":"male",
            "birthday":"2000-01-01",
            "titleOfCourtesy":"先生",
            "tel":"14081119999",
            };
    }
    
    function openModal(action, id) {
        if(action==="insert") {
            isShowButtonInsert.value = true;
            newBookings.value = {
            "firstName":null,
            "lastName":null,
            "identification":null,
            "passportNumber":null,
            "country":"台灣",
            "address":null,
            "allowPromotionMail":"是",
            "username":null,
            "email":null,
            "gender":null,
            "birthday":"2000-01-01",
            "titleOfCourtesy":"",
            "tel":null,
            };
        }
        bookingModalRef.value.showModal();
    }
    function callCreate(rooms){
        console.log("call Create!");
        console.log("rooms = ", rooms)
        let data ={
            "hId":1,
            ...newBookings.value,
            rooms: rooms.map(room => ({
                    rtId: room.rtId,
                    beginDate: room.beginDate,
                    lastDate: room.lastDate,
                    additionalBed: room.additionalBed,
                    breakfast: room.breakfast,
                    typeName: room.typeName,
                    amountPayable: room.amountPayable,
                    paymentMethod: room.paymentMethod,
                    deposit: room.deposit,
                    ddIds: room.ddIds.map(dd => ({ ddId: dd.ddId }))
                }))
        }
        console.log("insert data = ", data)
        axiosapi.post("/booking/book/create", data).then(function(response){
            if(response.data.success){
                Swal.fire({
                    text: "預訂成功",
                    icon: 'success',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                }).then(function (result) {
                    if(result.isConfirmed) {
                        bookingModalRef.value.hideModal();
                    }
                });
            }   else {
                Swal.fire({
                    text: response.data.message,
                    icon: 'warning',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                });
            }
        }).catch(function(error) {
            console.log("callModify error", error);
            Swal.fire({
                text: '失敗：'+error.message,
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確認',
            });
        });
    }

    function callModify(id, roomNumber, bookingStatus){
        console.log("call Modify!");
        let data={
            "roomNumber" : roomNumber,
            "bookingStatus" : bookingStatus,
            "bId" : id
        }
        axiosapi.put(`/booking/book/hotel/modify/${id}`,data).then((response) => {
            if(response.data.success) {
                Swal.fire({
                    text: response.data.message,
                    icon: 'success',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                }).then((result) =>{
                    if(result.isConfirmed){
                        callFind(current.value)
                    }
                });
            }else{
                Swal.fire({
                    text: response.data.message,
                    icon: 'error',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                });
            }
        }).catch(function(error) {
            console.log("error", error);
            Swal.fire({
                text: '更新失敗：'+error.message,
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確認',
            })
        });
    }

    function callRemove(id){
        Swal.fire({
            title: "確定刪除訂單嗎？",
            text: "資料會無法回溯，請再度確定是否刪除訂單",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "刪除訂單"
        }).then((result) => {
            if(result.isConfirmed){
                console.log("call Remove!");
                axiosapi.delete(`/booking/book/hotel/delete/${id}`).then(function(response){
                    if(response.data.success){
                        Swal.fire({
                            text: response.data.message,
                            icon: 'success',
                            allowOutsideClick: false,
                            confirmButtonText: '確認',
                        }).then((result) =>{
                            if(result.isConfirmed){
                                callFind(current.value)
                            }
                        });
                    } else{
                        Swal.fire({
                            text: response.data.message,
                            icon: 'error',
                            allowOutsideClick: false,
                            confirmButtonText: '確認',
                        });
                    }
                }).catch(function (error) {
                    console.log("callFindById error", error);
                    Swal.fire({
                        text: '刪除失敗：' + error.message,
                        icon: 'error',
                        allowOutsideClick: false,
                        confirmButtonText: '確認',
                    });
                });
            }
        });
    }
    function callFind(page) {
        // Swal.fire({
        //     text: "Loading......",
        //     showConfirmButton: false,
        //     allowOutsideClick: false,
        // });
        
        if(page) {
            start.value = (page - 1) * rows.value;
            current.value = page;
        } else {
            start.value = 0;
            current.value = 1;
        }

        if(findRoomName.value==="") {
            findRoomName.value = null;
        }

        if(findPromoName.value==="") {
            findPromoName.value = null;
        }

        if(findPackName.value==="") {
            findPackName.value = null;
        }

        let data = {
            "start": start.value,
            "rows": rows.value,
            "dir": dir.value,
            "order": "lastModifiedDate",
            "roomName": findRoomName.value,
            "firstName": findFirstName.value,
            "lastName": findLastName.value,
            "hId": findhId.value,
            "date": findDate.value,
            "beginDate": findBeginDate.value,
            "lastDate": findLastDate.value,
            "paymentStatus": findPaymentStatus.value,
            "bookingStatus": findBookingStatus.value,
            "promo": findPromoName.value,
            "pack": findPackName.value,
            "orderNumber": findOrderNumber.value
            
        };
        console.log("findPromoName.value = ", findPromoName.value)
        console.log("findPackName.value = ", findPackName.value)
        axiosapi.post("/booking/book/hotel/find", data).then(function(response) {
            bookings.value = response.data.bookings;
            console.log( bookings.value)
            //pagination start
            total.value =  response.data.count;
            pages.value = Math.ceil(response.data.count / rows.value);
            lastPageRows.value = response.data.count % rows.value;
            //pagination end
            setTimeout(function() {
                Swal.close();
            }, 500);
        }).catch(function(error) {
            console.log("callFind error", error);
            Swal.fire({
                text: '失敗：'+error.message,
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確認',
            }).then(function() {
                // if(error && error.response.status && error.response.status==403) {
                //     router.push("/secure/login");
                // }
            });
        });
    }

    function callFindById(id){
        Swal.fire({
            text: "Loading......",
            showConfirmButton: false,
            allowOutsideClick: false,
        });
        axiosapi.get(`/booking/book/hotel/${id}`).then(function (response) {
            console.log("response", response.data.booking);
            if(response.data.success) {
                booking.value = response.data.booking;
            }
            setTimeout(function() {
                Swal.close();
            }, 500);
        }).catch(function (error) {
            console.log("callFindById error", error);
            Swal.fire({
                text: '失敗：'+error.message,
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確認',
            });
        });
    }

    function callDiscount(){
        axiosapi.post("/booking/discount/find").then(function(response){
            if(response.data.success){
                dpacks.value = response.data.pack;
                dpromos.value = response.data.promo;
            }
        }).catch(function(error) {
            console.log("callDiscount error", error);
            Swal.fire({
                text: '失敗：'+error.message,
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確認',
            }).then(function() {
                if(error && error.response.status && error.response.status==403) {
                    router.push("/secure/login");
                }
            });
        });
    }

    onMounted(() => {
        callFind();
        callDiscount();
    })
    
    
</script>
    
<style>
    
</style>