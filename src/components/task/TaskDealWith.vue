<template>
    <div>
        <div style="width: 100%;height: 40px;"><myHeard back="true" title="任务办理"></myHeard></div>

        <div class="bmt">
            <a @click="popupVisible = true;getObj();">
                <myField label="执法对象" placeholder="请选择" v-model="form.obj" left-img="true" red-point="true"></myField>
            </a>
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
            <myField label="协办人员" placeholder="请输入" v-model.trim="form.jointly" red-point="true"></myField>
            <myTimeDate label="办理时间" placeholder="请选择" type="date" @changeTime="changeTime"></myTimeDate>
            <myField label="办理说明" placeholder="请输入" v-model.trim="form.explain" red-point="true" type="textarea"></myField>
        </div>

        <div class="bmt"><myBase64Img @changeImg="changeImg"></myBase64Img></div>

        <myFlaxSub title="提交" @click="sub"></myFlaxSub>

        <div class="select">
            <mt-popup
                    v-model="popupVisible"
                    position="right">
                <div style="height:100%;overflow:scroll;">
                    <div style="width: 100%;height: 40px;">
                        <mt-header fixed title="执法对象">
                            <router-link to="" slot="left">
                                <mt-button class="myColor" icon="back" @click="popupVisible = false"></mt-button>
                            </router-link>
                        </mt-header>
                    </div>

                    <div class="selectBut">
                        <el-input placeholder="请输入内容" v-model="selectValue" class="input-with-select" size="medium">
                            <el-button slot="append" icon="el-icon-search" @click="getObj"></el-button>
                        </el-input>
                    </div>

                    <div class="mt">
                        <a v-for="item in objList" :key="item.id" @click="selectedObj(item.id,item.objName)">
                            <div class="myObj">
                                <p>{{ item.objName }}</p>
                            </div>
                        </a>
                    </div>
                </div>
            </mt-popup>
        </div>
    </div>
</template>

<script>
    import myHeard from "../customComponent/myHeard";
    import myField from  "../customComponent/myField";
    import myFlaxSub from  "../customComponent/myFlaxSub";
    import myBase64Img from "../customComponent/myUploadImg";
    import myTimeDate from "../customComponent/myTimeDate";
    import {getRequest,postRequest} from "../../assets/js/public";
    import {Toast,Indicator} from 'mint-ui';
    export default {
        name: "check",
        components:{
            myHeard,
            myField,
            myFlaxSub,
            myBase64Img,
            myTimeDate,
            Toast,
            Indicator
        },
        data() {
            return {
                popupVisible  : false,
                selectValue   : '',
                objList       : [],
                form : {
                    obj       : '',
                    id        : 0,
                    execObjId : 0,
                    checkMan  : '',
                    jointly   : '',
                    time      : '2018-08-23 14:22',
                    explain   : '',
                    imgs      : null
                },
            };
        },
        methods: {
            changeTime:function (time) {
                this.form.time = time;
            },
            changeImg:function (imgs) {
                this.form.imgs = imgs;
            },
            getName(){
                let self = this;
                getRequest('sf_zhzf/msys/user/getinfo',{},function (data) {
                    self.form.checkMan = data.relName;
                });
            },
            getObj:function () {
                let self = this;
                getRequest('sf_zhzf/msys/enterprise/querybyname2',{
                    inspSpecial: self.type,
                    objName    : self.selectValue
                },function (data) {
                    self.objList = data.list;
                });
            },
            selectedObj:function (execObjId,execObjName) {
                this.form.execObjId = execObjId;
                this.form.obj       = execObjName;
                this.popupVisible   = false;
            },
            test:function () {
                if(this.form.execObjId == 0) {
                    Toast('请选择执法对象');
                    return false;
                }
                if(this.form.jointly == '') {
                    Toast('请填写协办人员！');
                    return false;
                }
                if(this.form.explain == '') {
                    Toast('请填写办理说明！');
                    return false;
                }
                return true;
            },
            sub:function () {
                if(!this.test()) return;
                let self = this;
                let jsonData = {
                    id          : self.form.id,
                    execObjId   : self.form.execObjId,
                    officerName : self.form.jointly,
                    doitTime    : self.form.time,
                    explain     : self.form.explain,
                    imgBase64   : self.form.imgs,
                };
                postRequest('sf_zhzf/msys/task/finish',jsonData,function (data) {
                    Toast('提交成功');
                    self.$router.push({name: 'TaskRecord'});
                });
            },
        },
        mounted() {
            this.form.id = this.$route.params.id;
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

    .weui_cells {
        margin-top: 10px;
        background-color: #FFFFFF;
        line-height: 1.41176471;
        font-size: 17px;
        overflow: hidden;
        position: relative;
        padding-bottom: 19px;
    }
    .weui_cell {
        padding: 10px 15px;
        align-items: center;
    }
    .weui_uploader_hd {
        padding-top: 0;
        padding-right: 0;
        padding-left: 0;
        padding: 10px 15px;
        position: relative;
    }

    .weui-uploader-input-wrp {
        float: left;
        position: relative;
        margin: 9px;
        width: 77px;
        height: 77px;
        border: 1px solid #D9D9D9;
        background-color: rgb(245,245,245);
    }
    #file_input {
        display: none;
        font: 100% tahoma, \5b8b\4f53, arial;
        vertical-align: baseline;
        border-radius: 0;
        background-color: transparent;
        -webkit-appearance: none;
    }
    .weui-uploader-input-wrp:before {
        width: 2px;
        height: 39.5px;
    }
    .weui-uploader-input-wrp:after {
        width: 39.5px;
        height: 2px;
    }
    .weui-uploader-input-wrp:before, .weui-uploader-input-wrp:after {
        content: " ";
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        background-color: #D9D9D9;
    }
    .font-position{
        margin-right:20px;
        background-size: cover;
        margin-bottom: 6px;
    }
    .add-img{
        float: left;
        margin: 9px;
        width: 77px;
        height: 77px;
        border: 1px solid #D9D9D9;
    }
    .add-img img{
        width: 100%;
        height: 100%;
    }
    .delete{
        width: 69px;
        height: 69px;
        position: absolute;
        text-align: center;
        line-height: 80px;
        z-index: 10;
        font-size: 23px;
        background-color: rgba(255,255,255,0.8);
        color: #777;
        opacity: 0;
        transition-duration: 0.7s;
        -webkit-transition-duration: 0.7s;
    }

    .delete:hover{
        cursor: pointer;
        opacity: 1;
    }
    .result{
        width: 100%;
        height: 100%;
        text-align: center;
        box-sizing: border-box;
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