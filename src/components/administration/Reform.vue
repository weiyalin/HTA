<template>
    <div>
        <div style="width: 100%;height: 40px;"><myHeard back="true" title="下达限期整改"></myHeard></div>

        <div class="bmt">
            <a @click="popupVisible = true;getObj();">
                <myField label="检查批次" placeholder="请选择" v-model="form.inspVersion" left-img="true" red-point="true"></myField>
            </a>
            <div class="item"><mt-cell title="企业名称" :value="company.name"></mt-cell></div>
            <div class="item"><mt-cell title="企业地址" :value="company.add"></mt-cell></div>
        </div>

        <div class="bmt">
            <myField label="整改内容" placeholder="请输入" v-model="form.reformContent" type="textarea" red-point="true"></myField>
            <myTimeDate label="整改期限" placeholder="请选择" type="datetime" @changeTime="changeTime"></myTimeDate>
            <div class="block">
                <span class="red-point">*</span>
                <div style="padding-left: 8px">
                    <mt-field
                            label="检查人"
                            v-model="form.checkMan"
                            readonly
                            disableClear
                            placeholder="请输入">
                    </mt-field>
                </div>
            </div>
            <myField label="协办人员" placeholder="请输入" v-model="form.offiName" red-point="true"></myField>
            <myField label="备注说明" placeholder="请输入" v-model="form.remark" type="textarea" ></myField>
        </div>

        <div class="select">
            <mt-popup
                    v-model="popupVisible"
                    position="right">
                <div style="height:100%;overflow:scroll;">
                    <div style="width: 100%;height: 40px;">
                        <mt-header fixed title="检查批次">
                            <router-link to="" slot="left">
                                <mt-button class="myColor" icon="back" @click="popupVisible = false"></mt-button>
                            </router-link>
                        </mt-header>
                    </div>

                    <div class="selectBut">
                        <el-input placeholder="请输入企业名称" v-model="selectValue" class="input-with-select" size="medium">
                            <el-button slot="append" icon="el-icon-search" @click="getObj"></el-button>
                        </el-input>
                    </div>

                    <div class="mt">
                        <a v-for="item in objList" :key="item.id" @click="selectedObj(item)">
                            <div class="myObj">
                                <p class="left">{{ item.exeobjName }}</p>
                                <p class="right">{{ item.inspdate }}</p>
                            </div>
                        </a>
                    </div>
                </div>
            </mt-popup>
        </div>

        <div style="width: 100%;height: 53px;"><myFlaxSub title="提交" @click="sub"></myFlaxSub></div>

    </div>
</template>

<script>
    import myHeard from "../customComponent/myHeard";
    import myField from  "../customComponent/myField";
    import myFlaxSub from  "../customComponent/myFlaxSub";
    import myTimeDate from "../customComponent/myTimeDate";
    import {getRequest} from "../../assets/js/public";
    import {Toast} from 'mint-ui';
    export default {
        name: "reform",
        components:{
            myHeard,
            myField,
            myFlaxSub,
            myTimeDate,
            Toast,
        },
        data() {
            return {
                id          : 0,
                popupVisible: false,
                form:{
                    objId           : '',
                    inspVersion     : '',
                    reformContent   : '',
                    limitDate       : '',
                    offiName        : '',
                    remark          : '',
                    checkMan        : ''
                },
                selectValue :'',
                objList     : [],

                company     : {
                    name    : '',
                    add     : ''
                }
            };
        },
        methods: {
            changeTime:function (time) {
                this.form.limitDate = time;
            },
            getObj:function () {
                let self = this;
                getRequest('sf_zhzf/msys/inspnotes/verlist2',{
                    objName    : self.selectValue
                },function (data) {
                    self.objList = data.list;
                });
            },
            getName(){
                let self = this;
                getRequest('sf_zhzf/msys/user/getinfo',{},function (data) {
                    self.form.checkMan = data.relName;
                });
            },
            selectedObj:function (item) {
                this.form.objId       = item.exeobjId;
                this.form.inspVersion = item.inspVersion;
                this.company.name     = item.exeobjName;
                this.company.add      = item.busiAddr;
                this.popupVisible     = false;
            },
            test:function () {
                if(this.form.inspVersion == ''){
                    Toast('请选择整改批次');
                    return false;
                }
                if(this.form.reformContent == ''){
                    Toast('请填写整改内容');
                    return false;
                }
                if(this.form.offiName == ''){
                    Toast('请填写协办人员');
                    return false;
                }
                return true;
            },
            sub:function () {
                let self = this;
                if(this.test())
                    getRequest('sf_zhzf/msys/rectify/addNote',{
                        inspVersion     : self.form.inspVersion,
                        execObjId       : self.form.objId,
                        reformContent   : self.form.reformContent,
                        limitDate       : self.form.limitDate,
                        offiName        : self.form.offiName,
                        remark          : self.form.remark,
                    },function (data) {
                        Toast('下达限期整改成功');
                        self.$router.push({name: 'RectifyRecord'});
                    });
            },
        },
        mounted() {
            this.getName();
        },
    }
</script>

<style scoped>
    .select{
        width: 100%;
        height: 100%;
    }
    .select .mint-popup{
        width: 100%;
        height: 100%;
        background-color: rgb(248,249,249);
    }
    .select .mint-header{
        background-color: white;
        color: rgb(0,149,147);
        font-size: 16px !important;
    }
    .myColor{
        color: rgb(0,149,147);
    }
    .selectBut{
        padding: 10px;
        background-color: white;
    }
    .myObj{
        margin-bottom: 1px;
        background-color: white;
        height: 30px;
        line-height: 30px;
        padding: 2px 15px;
        font-size: 14px;
        color: rgb(96,96,96);
    }
    .myObj .left{
        float: left;
    }
    .myObj .right{
        float: right;
    }

    .block{
        position: relative;
        background-color: white;
        border-bottom: 1px solid rgb(248,248,248);
    }
    .red-point{
        color: red;
        position: absolute;
        z-index: 1;
        height: 14px;
        top: 50%;
        margin-top: -10px;
        left: 8px;
    }
</style>