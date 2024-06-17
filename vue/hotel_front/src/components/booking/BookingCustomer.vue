<template>

    <h3 class="mb-4 text-center">輸入客戶資料</h3>
        <form>
            <!-- 顧客資料 Customer -->
            <div>
                <div class="mb-3">
                    <label for="name" class="form-label">姓</label>
                    <input type="text" class="form-control" id="lastName" v-model="customer.lastName" :disabled="isMember">
                    <label for="name" class="form-label">名</label>
                    <input type="text" class="form-control" id="firstName" v-model="customer.firstName" :disabled="isMember">
                </div>
                <div class="mb-3">
                    <label for="title" class="form-label">稱謂：</label>
                    <select class="form-select" id="title" v-model="customer.titleOfCourtesy" :disabled="isMember">
                        <option>先生</option>
                        <option>女士</option>
                        <option>其他</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="birthday" class="form-label">生日（選填）</label>
                    <input type="date" class="form-control" id="birthday" v-model="customer.birthday" :disabled="isMember">
                </div>
                <div class="mb-3">
                    <label class="form-label">性別：</label><br>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="gender" id="genderMale" value="male" v-model="customer.gender" :disabled="isMember">
                        <label class="form-check-label" for="genderMale">男</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="gender" id="genderFemale" value="female" v-model="customer.gender" :disabled="isMember">
                        <label class="form-check-label" for="genderFemale">女</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="gender" id="genderOther" value="其他" v-model="customer.gender" :disabled="isMember">
                        <label class="form-check-label" for="genderOther">其他</label>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="nationality" class="form-label">國籍</label>
                    <select class="form-select" id="title" v-model="customer.country" @change="changeCountry(customer.country)" :disabled="isMember">
                        <option v-for="country in countries" :key="country.id" :value="country.name">
                            {{ country.name }}
                        </option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="address" class="form-label">地址（選填）</label>
                    <input type="text" class="form-control" id="address" v-model="customer.address" :disabled="isMember">
                </div>
                <div class="mb-3">
                    <label for="identification" class="form-label">身分證字號</label>
                    <input type="text" class="form-control" id="identification" :disabled="!isTaiwan || isMember" v-model="customer.identification" @change="checkid(customer.identification)">
                    {{ idmessage }}
                </div>
                <div class="mb-3">
                    <label for="passportNumber" class="form-label">護照號碼</label>
                    <input type="text" class="form-control" id="passportNumber" :disabled="isTaiwan || isMember" v-model="customer.passportNumber">
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">E-mail</label>
                    <input type="email" class="form-control" id="email" v-model="customer.email" :disabled="isMember" @change="checkEmail(customer.email)">
                    {{ emailmessage }}
                </div>
                <div class="mb-3">
                    <label for="tel" class="form-label">手機電話</label>
                    <input type="tel" class="form-control" id="tel" v-model="customer.tel" :disabled="isMember">
                </div>
                <div class="mb-3">
                    <label class="form-label">是否收取優惠信件：</label><br>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="allowPromotionMailYes" value="是" v-model="customer.allowPromotionMail" :disabled="isMember">
                        <label class="form-check-label" for="allowPromotionMailYes">是</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="allowPromotionMailNo" value="否" v-model="customer.allowPromotionMail" :disabled="isMember">
                        <label class="form-check-label" for="allowPromotionMailNo">否</label>
                    </div>
                </div>
            </div>
        </form>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="emits('customerNext')">下一步</button>
        </div>
        
    </template>
        
    <script setup>
        const props = defineProps(["customer", "isMember"]);
        const emits = defineEmits(["customerNext"]);
    
        import { ref, onMounted } from "vue";
        import countries from "@/assets/JSON/world.json"

        const idmessage = ref("")
        const isId = ref(false);
        const emailmessage = ref("");
        const isEmail = ref(false)
    
        // 判斷用
        const isTaiwan = ref(true);

        function handleSubmit(){
            console.log("isId = ",isId.value)
            console.log("isEmail = ",isEmail.value)
            checkEmail()
            if (!isId) {
                alert("請輸入正確身份證字號");
                return;
            }

            if(!isEmail){
                alert("請輸入正確電子郵件信箱");
                return;
            }
            emits("customerNext");
        }

        function checkEmail(email){
            emailmessage.value="";
            //Regular expression Testing
            const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
            
            //validate ok or not
            if(email.search(emailRule)!= -1){
                isEmail.value = true; 
            } else{
                emailmessage.value="信箱格式錯誤"
                props.customer.email= "";
            }
        }

        function checkid(id){
            idmessage.value ="";
            isId.value = checkPid(id);

            if(!checkPid(id)){
                idmessage.value = "身份證字號格式錯誤"
                props.customer.identification= "";
            }
        }

        function checkPid(pid) {
            if (pid.length !== 10) return false;

            const pidRegex = /^[A-Z][12]\d{8}$/;
            if (!pidRegex.test(pid)) return false;

            pid = pid.toUpperCase();

            const letters = 'ABCDEFGHJKLMNPQRSTUVXYWZIO';
            const codes = '0123456789' + letters;

            const pidCodes = {};
            for (let i = 0; i < codes.length; i++) {
                pidCodes[codes.charAt(i)] = i;
            }

            let sum = 0;
            for (let i = 1; i <= 8; i++) {
                sum += parseInt(pid.charAt(i)) * (9 - i);
            }

            const firstCharCode = pidCodes[pid.charAt(0)];
            const firstDigit = Math.floor(firstCharCode / 10) + (firstCharCode % 10) * 9;

            const checkDigit = (10 - ((firstDigit + sum) % 10)) % 10;

            return checkDigit === parseInt(pid.charAt(9));
        }


    
        
        function changeCountry(country) {
            if(country === "台灣"){
                console.log("國籍變回台灣")
                isTaiwan.value = true;
                console.log(isTaiwan.value)
            } else{
                console.log("國籍非台灣")
                isId.value = true;
                isTaiwan.value = false;
                console.log(isTaiwan.value)
            }
            return
        }

        onMounted(()=>{
            if(props.customer.allowPromotionMail === null){
                props.customer.allowPromotionMail = true;
            }
        })
        
        

    </script>
        
    <style>
        
    </style>