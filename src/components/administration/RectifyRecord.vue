<template>
    <div>
        <myHeard back="true" title="限期整改记录" reform="true"></myHeard>
        <div class="myMenu">
            <el-menu
                    :default-active="activeIndex"
                    class="el-menu-demo"
                    mode="horizontal"
                    @select="handleSelect"
                    text-color="#8C8888"
                    active-text-color="#089593">
                <el-menu-item index="1" class="left">未完成督察</el-menu-item>
                <el-menu-item index="2" class="right">已完成督察</el-menu-item>
            </el-menu>
        </div>

        <div class="lm" v-if="activeIndex == 1">

            <div class="bmt" style="width: 100%;height: 101px;"></div>

            <Loadmore :bottom-method="loadBottom"
                        bottomPullText="下拉加载" bottomDropText="释放加载更多" bottomLoadingText="加载中···"
                        :bottom-all-loaded="searchCondition1.allLoaded" :auto-fill="false" ref="loadmore1">
                <div class="myBlock" v-for="list in searchCondition1.pageList" @click="click1(list)" :key="list.id">
                    <div class="qyInfo">
                        <p class="myP qyName">{{ list.exeobjName }}</p>
                        <p class="myP">地址：{{ list.busiAddr }}</p>
                        <p class="myP">整改期限：{{ list.limitDate }}</p>
                    </div>
                    <img class="myLinkImg" src="../../assets/img/into.png" alt="无法加载">
                </div>
            </Loadmore>

            <div style="width: 100%;height: 40px;"></div>
        </div>

        <div class="lm" v-else>

            <div class="bmt" style="width: 100%;height: 101px;"></div>

            <Loadmore :bottom-method="loadBottom"
                      bottomPullText="下拉加载" bottomDropText="释放加载更多" bottomLoadingText="加载中···"
                      :bottom-all-loaded="searchCondition2.allLoaded" :auto-fill="false" ref="loadmore2">
                <div class="myBlock" v-for="list in searchCondition2.pageList" @click="click2(list.id)" :key="list.id">
                    <div class="qyInfo">
                        <p class="myP qyName">{{ list.exeobjName }}</p>
                        <p class="myP">地址：{{ list.busiAddr }}</p>
                        <p class="myP">整改期限：{{ list.limitDate }}</p>
                    </div>
                    <img class="myLinkImg" src="../../assets/img/into.png" alt="无法加载">
                </div>
            </Loadmore>

            <div style="width: 100%;height: 40px;"></div>
        </div>

        <a @click="$router.go(-1);">
            <div class="myReturn">
                返回
            </div>
        </a>
    </div>
</template>

<script>
    import myHeard   from  "../customComponent/myHeard";
    import myField   from  "../customComponent/myField";
    import myFlaxSub from  "../customComponent/myFlaxSub";
    import {getRequest} from "../../assets/js/public";
    import {Loadmore} from 'mint-ui';
    export default {
        name: "rectify-record",
        components:{
            myHeard,
            myField,
            myFlaxSub,
            Loadmore,
        },
        data() {
            return {
                objId: 0,
                activeIndex : '1',
                searchCondition1: {  //分页属性
                    pageNo: "1",
                    pageSize: "15",
                    total: 0,
                    pageList: [],
                    allLoaded: false,//是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
                },
                searchCondition2: {  //分页属性
                    pageNo: "1",
                    pageSize: "15",
                    total: 0,
                    pageList: [],
                    allLoaded: false,
                },
                scrollMode: "auto" //移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
            };
        },
        methods: {
            handleSelect:function(key, keyPath) {
                this.activeIndex = key;
            },
            loadBottom() {
                // 上拉加载
                this.getData(true,this.activeIndex);// 上拉触发的分页查询
                // 固定方法，查询完要调用一次，用于重新定位
                this.activeIndex == 1 ? this.$refs.loadmore1.onBottomLoaded() : this.$refs.loadmore2.onBottomLoaded();
            },
            getData:function (isMore,index) {
                let search = index == 1 ? this.searchCondition1 : this.searchCondition2;
                search.pageNo = isMore ? parseInt(search.pageNo) + 1 : parseInt(search.pageNo);

                let params = {
                    status      : index,
                    pageNum     : search.pageNo,
                    numPerPage  : search.pageSize
                };

                if(this.objId != 0) params.objId = this.objId;

                getRequest('sf_zhzf/msys/rectify/list',params,function (data) {
                    search.pageList = search.pageList.concat(data.list);
                    search.total = data.totalCount;
                    search.pageList.length >= search.total && (search.allLoaded = true);
                });
            },
            click1:function (list) {
                this.$router.push({name: 'Supervise', params: { data : JSON.stringify(list) }});
            },
            click2:function (id) {
                this.$router.push({name: 'ReformDetail', params: { id : id }});
            },
        },
        mounted() {
            this.objId = this.$route.params.objId;
            this.getData(false,1);
            this.getData(false,2);
        },
    }
</script>

<style scoped>
    .myMenu{
        width: 100%;
        background-color: white;
        position: fixed;
        z-index: 1;
        top: 40px;
        left: 0px;
    }
    .el-menu-demo{
        width: 80%;
        margin: 0 auto;
    }
    .left,.right{
        width: 40%;
        text-align: center;
        margin: 0 5% !important;
    }
    .el-menu.el-menu--horizontal{
        border-bottom: 0px;
    }
    .myBlock{
        padding: 10px 15px;
        background-color: white;
        margin-bottom: 1px;
        font-size: 14px;
        position: relative;
    }
    .myP{
        height: 25px;
        line-height: 25px;
        color: #8C8888;
    }
    .qyInfo{
        width: 80%;
    }
    .qyName{
        font-size: 15px;
        color: orange;
    }
    .myLinkImg{
        position: absolute;
        width: 24px;
        height: 24px;
        top: 50%;
        right: 15px;
        margin-top: -12px;
    }
    .lm{
        height: 100vh;
        overflow:scroll;
    }
</style>