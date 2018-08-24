<template>
  <div>
    <!-- <div class='searchBox'>
      <p class="pageTitle">视频</p> -->
    <!-- <img src="../../../static/images/search.png" class="searchBtn" > -->
    <!-- </div> -->
    <transition name="van-fade">
      <van-loading v-show="loadingShow" color="black" size="1rem" class="loadingShow" />
    </transition>
    <div class='tab'>
      <van-tabs v-model="active" v-bind:line-width="90" @click="onClick" @change="onChange" swipeable sticky>
        <van-tab title="中国石化视频">
          <van-row class="shspRow" type="flex" justify="space-around">
            <van-col class="shspCol" v-for="(item,index) in shType" :key="index" v-bind:style="{color: item.color,background:item.bgc}"
              span="0">
              <div @click="changeType(index)">{{item.title}}</div>
            </van-col>
          </van-row>
          <div class="seat van-hairline--bottom">
            <div v-for="(item,index) in shType" :key="index" v-if="shtypeShow===index">
              <div class="shType" v-bind:style="{backgroundImage:item.bgi}"></div>
              <p class="typeDesc">{{item.title}}</p>
            </div>
          </div>
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh(active)" pulling-text='↓下拉即可刷新...' loosing-text='↑松开即可刷新...' loading-text='正在刷新列表...'>
            <van-list :immediate-check=false v-model="loading2" :finished="finished2" @load="getList(active,shTypeID)" loading-text='正在加载...'>
              <div v-if="active===0" v-for="(item, index) in list2" :key="index">
                <div class='videoNew  van-hairline--bottom' @click="showPop(item.id,'shVideo')">
                  <div v-lazy:background-image="item.image" class="videoImg">
                    <div class='opacityTop'></div>
                    <div class='opacitytextTop'>{{item.title}}</div>
                  </div>
                  <img class="playBtn" src="../../../static/images/play.png">
                  <!-- <p class='picNewTitle'>{{item.title}}</p> -->
                  <van-tag class='tagName' mark type="danger">{{item.cat_name}}</van-tag>
                  <p class='videoAuthor'>中国石化</p>
                  <p class='videoTime'>{{item.uploadTime|formatDate}}</p>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
          <div class='useless'></div>
        </van-tab>

        <van-tab title="西北油田视频">
          <van-row class="shspRow" type="flex" justify="space-around">
            <van-col class="shspCol" v-for="(item,index) in xbType" :key="index" v-bind:style="{color: item.color,background:item.bgc}"
              span="0">
              <div @click="changeType(index)">{{item.title}}</div>
            </van-col>
          </van-row>
          <div class="seat van-hairline--bottom">
            <div v-for="(item,index) in xbType" :key="index" v-if="xbtypeShow===index">
              <div class="shType" v-bind:style="{backgroundImage:item.bgi}"></div>
              <p class="typeDesc">{{item.title}}</p>
            </div>
          </div>
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh(active)" pulling-text='↓下拉即可刷新...' loosing-text='↑松开即可刷新...' loading-text='正在刷新列表...'>
            <van-list :immediate-check=false v-model="loading1" :finished="finished1" @load="getList(active,xbTypeID)" loading-text='正在加载...'>
              <div v-if="active===1" v-for="(item, index) in list1" :key="index">
                <div class='videoNew van-hairline--bottom' @click="showPop(item.id,'xbVideo')">
                  <div v-lazy:background-image="item.image" class="videoImg">
                    <div class='opacityTop'></div>
                    <div class='opacitytextTop'>{{item.title}}</div>
                  </div>
                  <img class="playBtn" src="../../../static/images/play.png">
                  <!-- <p class='picNewTitle'>{{item.title}}</p> -->
                  <van-tag class='tagName' mark type="danger" v-show="xbtypeShow!=0">{{xbType[xbtypeShow].title}}</van-tag>
                  <p class='videoAuthor'>西北油田</p>
                  <p class='videoTime'>{{item.uploadTime|formatDate}}</p>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
          <div class='useless'></div>
        </van-tab>
      </van-tabs>
    </div>

    <van-popup id='popup' v-model="popShow" position="right" :overlay="false" style="z-index:2000">
      <div class="postInfo">
        <div class='contentBox' v-if="infoType === 'xbVideo'">
          <h2>{{info.title}}</h2>
          <p class='name'>{{info.author}} {{info.uploadTime|formatDate}}</p>
          <!-- <div :v-html="load(url1)"></div> -->
          <p class='contents'>
            <video-player v-show="isPlay" class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions"></video-player>
          </p>
          <p class='contents' v-html="info.content"></p>
        </div>
        <div class='contentBox' v-if="infoType === 'shVideo'">
          <h2>{{info.title}}</h2>
          <p class='name'>{{info.author}} {{info.uploadTime|formatDate}}</p>
          <!-- <div :v-html="load(url1)"></div> -->
          <p class='contents'>
            <video-player v-show="isPlay" class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions"></video-player>
          </p>
          <p class='contents' v-html="info.content"></p>
        </div>
      </div>
      <div class='tip'>用户回复</div>
      <div class='command'>
        <div v-show="cList.length == 0" style="text-align: center;color:#878787;height:3rem;">
          <img class="sofa" src="http://jhyt.cyparty.com/resource/images/icon_not_comment.png">
          <p style="font-size: .25rem;">快来参与评论吧！</p>
        </div>
        <div class='comm  van-hairline--bottom' v-for="(item,index) in cList" :key="index" @click="onComment(item)">
          <img :src="item.headImg" class='headImg'>
          <p class='nickName'>{{item.nickName}}</p>
          <p class='commReply'>回复评论</p>
          <p class='commDate'>{{item.publish_time|formatDate}}</p>
          <p v-if="item.rncikName!=''" class='commRnickName'>回复：{{item.rncikName}}</p>
          <p class='commInfo'>{{item.content}}</p>
        </div>
      </div>
      <div class="footer"></div>
    </van-popup>


    <van-popup v-model="show" position="bottom">
      <van-panel title="评论留言" :desc="desc" status='文明上网,遵守"七条底线"'>
        <div>
          <van-cell-group>
            <van-field @input="checkText" clearable v-model="message" type="textarea" placeholder="请输入留言" rows="3" autosize />
          </van-cell-group>
        </div>
        <div slot="footer">
          <p class="tcount">{{message.length}}/255</p>
          <van-button size="small" @click="submitComm" type="danger">发表评论</van-button>
        </div>
      </van-panel>
    </van-popup>


    <van-goods-action v-show="actionShow" style="z-index:2001 !importent;">
      <van-goods-action-mini-btn icon="arrow-left" @click="close">
        后退
      </van-goods-action-mini-btn>
      <!-- <van-goods-action-mini-btn icon="share" @click="onClickCart">
        分享
      </van-goods-action-mini-btn> -->
      <van-goods-action-big-btn class="commBtn" @click="onSubmit">
        <van-icon name="edit" /> 写评论…
      </van-goods-action-big-btn>
      <van-goods-action-mini-btn icon="chat" :info="comment" @click="onSubmit">
        评论
      </van-goods-action-mini-btn>
      <van-goods-action-mini-btn :icon="add" @click="onAdd">
        收藏
      </van-goods-action-mini-btn>
    </van-goods-action>
  </div>
</template>

<script>
  import {
    Tab,
    Tabs,
    Panel,
    PullRefresh,
    Row,
    Col,
    Icon,
    Button,
    Popup,
    List,
    Field,
    Cell,
    CellGroup,
    GoodsAction,
    GoodsActionBigBtn,
    GoodsActionMiniBtn,
    Loading,
    Tag
  } from "vant";
  import wx from 'weixin-js-sdk';
  import sha1 from 'sha1';
  export default {
    data() {
      return {
        scroll: 0,
        scroll1: 0,
        scroll2: 0,
        loadingShow: false, //加载显示
        list1: [], //列表1数据
        list2: [], //列表2数据
        active: 1, //Tab选中标签index
        page1: 0, //列表1刷新次数
        page2: 0, //列表2刷新次数
        loading1: false,
        finished1: false,
        loading2: false,
        finished2: false,
        isLoading: false, //下拉刷新
        popShow: false, //详情弹出层显示or隐藏
        actionShow: false, //动作条显示or隐藏
        info: "", //文章详情
        infoType: "", //文章类型
        add: "add-o", //收藏
        comment: 0, //评论数
        cList: [], //评论列表
        show: false, //评论弹出层显示or隐藏
        desc: "", //回复人显示
        message: "", //评论内容
        pageUrl: "", //本页地址
        listUrl: "", //专题列表
        detailUrl: "", //详情地址
        shareUrl: "", //分享链接
        shareTitle: "奋进西北 — 视频", //分享标题
        isPlay: false,
        color_active: '#fff',
        bgc_active: '-webkit-linear-gradient(45deg, #ff3f34 , #ff793f)',
        shtypeShow: 0, //石化视频分类index
        xbtypeShow: 0, //西北视频分类index
        tabs: [{
            title: "西北视频",
            type: "xibei",
          },
          {
            title: "石化视频",
            type: "shihua",
          }
        ],
        xbTypeID: '0',
        xbType: [{
            title: "全部",
            type: "0",
            color: '#333',
            bgc: '#f2f3f4',
            bgi: 'url(' + require('../../../static/images/qb.png') + ')'
          },
          {
            title: "新闻",
            type: "1",
            color: '#333',
            bgc: '#f2f3f4',
            bgi: 'url(' + require('../../../static/images/xw.png') + ')'
          },
          {
            title: "微视频",
            type: "2",
            color: '#333',
            bgc: '#f2f3f4',
            bgi: 'url(' + require('../../../static/images/wsp.png') + ')'
          },
          {
            title: "专题",
            type: "3",
            color: '#333',
            bgc: '#f2f3f4',
            bgi: 'url(' + require('../../../static/images/zt.png') + ')'
          },
          {
            title: "文艺",
            type: "4",
            color: '#333',
            bgc: '#f2f3f4',
            bgi: 'url(' + require('../../../static/images/wy.png') + ')'
          }
        ],
        shTypeID: '275',
        shType: [{
            title: "新闻",
            type: "275",
            color: '#333',
            bgc: '#f2f3f4',
            bgi: 'url(' + require('../../../static/images/xw.png') + ')'
          },
          {
            title: "文艺",
            type: "277",
            color: '#333',
            bgc: '#f2f3f4',
            bgi: 'url(' + require('../../../static/images/wy.png') + ')'
          },
          {
            title: "生活",
            type: "278",
            color: '#333',
            bgc: '#f2f3f4',
            bgi: 'url(' + require('../../../static/images/sh.png') + ')'
          },
          {
            title: "专题",
            type: "280",
            color: '#333',
            bgc: '#f2f3f4',
            bgi: 'url(' + require('../../../static/images/zt.png') + ')'
          }
        ],
        playerOptions: {
          playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          autoplay: false, //如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: "video/mp4",
            src: " " //url地址
          }],
          poster: "", //你的封面地址
          // width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true //全屏按钮
          }
        }
      };
    },
    components: {
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [Panel.name]: Panel,
      [PullRefresh.name]: PullRefresh,
      [Icon.name]: Icon,
      [Button.name]: Button,
      [Row.name]: Row,
      [Col.name]: Col,
      [Popup.name]: Popup,
      [List.name]: List,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [GoodsAction.name]: GoodsAction,
      [GoodsActionBigBtn.name]: GoodsActionBigBtn,
      [GoodsActionMiniBtn.name]: GoodsActionMiniBtn,
      [Field.name]: Field,
      [Loading.name]: Loading,
      [Tag.name]: Tag
    },
    created() {
      this.initList(0, this.xbTypeID); //西北视频，没分类
      this.initList(1, this.shTypeID); //石化视频，默认第一个分类
      this.shType[0].color = this.color_active;
      this.shType[0].bgc = this.bgc_active;
      this.xbType[0].color = this.color_active;
      this.xbType[0].bgc = this.bgc_active;

      let url = window.location.href;
      if (url.indexOf("#") > -1) {
        url = url.split("#")[0];
      }
      this.pageUrl = url + "#/videoNews";
      if (this.$route.query.id != null) {
        this.showPop(this.$route.query.id, this.$route.query.type)
      } else {
        this.getJsapi_ticket(this.pageUrl, this.shareTitle);
      }
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll);
      this.comment = this.cList.length;
    },
    updated() {
      setTimeout(() => {
        this.loadingShow = false;
      }, 400);
      if (!this.popShow) {
        this.isPlay = false;
        this.info = "";
        this.playerOptions.sources[0].src = "";
        this.actionShow = false;
      }
    },
    methods: {
      onComment(obj) {
        this.show = true;
        this.rncikName = obj.nickName;
        this.desc = "回复：" + obj.nickName;
      },
      close() {
        history.pushState(null, null, this.pageUrl)
        this.shareTitle = "奋进西北"
        this.shareUrl = this.pageUrl
        this.getJsapi_ticket(this.shareUrl, this.shareTitle);
        this.isPlay = false;
        this.info = "";
        this.playerOptions.sources[0].src = "";
        document.getElementById('popup').scrollTop = 0;
        this.popShow = false;
        this.actionShow = false;
      },
      onAdd() {
        if (this.add === "add") {
          this.add = "add-o";
        } else {
          this.add = "add";
        }
      },
      onSubmit() {
        this.show = true;
        this.rncikName = "";
      },
      checkText() {
        if (this.message.length > 255) {
          this.message = this.message.substring(0, 255);
        }
      },
      submitComm() {
        var date = new Date();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentDate =
          date.getFullYear() +
          "-" +
          month +
          "-" +
          strDate +
          " " +
          date.getHours() +
          ":" +
          date.getMinutes() +
          ":" +
          date.getSeconds();
        let obj = {};
        this.$set(obj, "user_id", 4);
        this.$set(obj, "nickName", "测试用户4");
        this.$set(obj, "content", this.message);
        this.$set(
          obj,
          "headImg",
          "http://img3.imgtn.bdimg.com/it/u=3716833014,2060263550&fm=27&gp=0.jpg"
        );
        this.$set(obj, "publish_time", currentDate);
        this.$set(obj, "rncikName", this.rncikName);
        this.comment = this.cList.unshift(obj);
        this.show = false;
        this.message = "";
      },
      showPop(id, type) {
        this.loadingShow = true;
        this.info = '';
        this.popShow = true;
        this.actionShow = true;
        this.detailUrl = "";

        if (id != null) {
          this.detailUrl = this.pageUrl + "?id=" + id + "&type=" + type;
          this.shareUrl = this.detailUrl
        }

        if (type == 'xbVideo') {
          this.infoType = "xbVideo"
          setTimeout(() => {
            this.axios
              .get(
                "http://xibei.hnocse.com/xb/tv", {
                  params: {
                    id: id,
                    action: "show"
                  }
                }
              )
              .then(
                res => {
                  // 响应成功回调
                  this.info = res.data[0];
                  this.shareTitle = this.info.title;
                  this.getJsapi_ticket(this.shareUrl, this.shareTitle);
                  this.playerOptions.sources[0].src = this.info.video_url;
                  this.playerOptions.poster = this.info.image;
                  this.isPlay = true
                }
              ).catch(
                error => {

                });

          }, 300);
        }
        if (type == 'shVideo') {
          this.infoType = "shVideo"
          setTimeout(() => {
            this.axios
              .get(
                "http://xibei.hnocse.com/sinopec/tv", {
                  params: {
                    id: id,
                    action: "show_info"
                  }
                }
              )
              .then(
                res => {
                  // 响应成功回调
                  this.info = res.data;
                  this.shareTitle = this.info.title;
                  this.getJsapi_ticket(this.shareUrl, this.shareTitle);

                  this.playerOptions.sources[0].src = this.info.video_url;
                  this.playerOptions.poster = this.info.image_url;
                  this.isPlay = true
                }
              ).catch(
                error => {

                });

          }, 300);
        }
        this.cList = [{
            user_id: 1,
            nickName: "测试用户1",
            rncikName: "",
            content: "到此一游😎😎😎😎",
            headImg: "http://image.yy.com/yywebalbumbs2bucket/46783fac143b433891c652219b942864_1514110116802.jpg",
            publish_time: "2018-06-25 10:29:56"
          },
          {
            user_id: 2,
            nickName: "测试用户2",
            rncikName: "测试用户3",
            content: "支持！支持！😁😁",
            headImg: "http://img3.imgtn.bdimg.com/it/u=20733103,1267671152&fm=27&gp=0.jpg",
            publish_time: "2018-06-22 10:29:56"
          },
          {
            user_id: 3,
            nickName: "测试用户3",
            rncikName: "",
            content: "先评论再抢沙发！哈哈哈！😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃",
            headImg: "http://img5.imgtn.bdimg.com/it/u=3527916118,1559491205&fm=27&gp=0.jpg",
            publish_time: "2018-06-08 10:29:56"
          }
        ]
        this.comment = this.cList.length;

      },
      changeType(index) {
        if (this.active == 0) {
          this.finished2 = false;
          this.page2 = 0;
          for (let i = 0; i < this.shType.length; i++) {
            if (i == index) {
              this.shType[i].color = this.color_active;
              this.shType[i].bgc = this.bgc_active;
            } else {
              this.shType[i].color = '#878787';
              this.shType[i].bgc = '#f2f3f4';
            }
          }
          this.shtypeShow = index;
          this.initList(1, this.shType[index].type);
          this.shTypeID = this.shType[index].type;
        }

        if (this.active == 1) {
          this.finished1 = false;
          this.page1 = 0;
          for (let i = 0; i < this.xbType.length; i++) {
            if (i == index) {
              this.xbType[i].color = this.color_active;
              this.xbType[i].bgc = this.bgc_active;
            } else {
              this.xbType[i].color = '#878787';
              this.xbType[i].bgc = '#f2f3f4';
            }
          }
          this.xbtypeShow = index;
          this.initList(0, this.xbType[index].type);
          this.xbTypeID = this.xbType[index].type;
        }


      },
      initList(index, id) {
        if (index == 0) {
          this.list1 = [];
          setTimeout(() => {
            this.axios
              .get(
                "http://xibei.hnocse.com/xb/tv", {
                  params: {
                    action: "show",
                    type: id,
                    page: 0,
                    size: 10
                  }
                }
              )
              .then(res => {
                // 响应成功回调

                if (res.data.length != 0) {
                  this.list1 = res.data;
                } else {
                  this.finished1 = true;
                }
                this.loading1 = false;
              }).catch(
                error => {

                });
          }, 300);
        }
        if (index == 1) {
          this.list2 = [];
          setTimeout(() => {
            this.axios
              .get(
                "http://xibei.hnocse.com/sinopec/tv", {
                  params: {
                    action: "show",
                    id: id,
                    page: 0,
                    size: 10
                  }
                }
              )
              .then(res => {
                // 响应成功回调
                if (res.data.length != 0) {
                  this.list2 = res.data;
                } else {
                  this.finished2 = true;
                }
                this.loading2 = false;
              }).catch(
                error => {

                });
          }, 300);
        }
      },
      onRefresh(index) {
        if (index === 0) {
          this.page1 = 0;
          this.finished1 = false;
        }
        if (index === 1) {
          this.page2 = 0;
          this.finished2 = false;
        }
        setTimeout(() => {
          this.initList(index, this.shTypeID)
          this.isLoading = false;
        }, 300);
      },
      onChange(index, title) {
        // console.log(this.scroll)
        if (index == 0) {
          window.scroll(0, this.scroll1);
        }
        if (index == 1) {
          window.scroll(0, this.scroll2);
        }
      },
      handleScroll() {
        this.scroll =
          document.documentElement &&
          document.documentElement.scrollTop + document.body.scrollTop;
        if (this.active == 0) {
          this.scroll1 = this.scroll
        }
        if (this.active == 1) {
          this.scroll2 = this.scroll
        }
      },
      onClick(index, title) {
        if (index == 0) {
          window.scroll(0, this.scroll1);
        }
        if (index == 1) {
          window.scroll(0, this.scroll2);
        }
      },
      getList(index, id) {
        let p = 0;
        if (index == 1) {
          p = this.page1;
          setTimeout(() => {
            this.axios
              .get(
                "http://xibei.hnocse.com/xb/tv", {
                  params: {
                    action: "show",
                    type: id,
                    page: p + 1,
                    size: 10
                  }
                }
              )
              .then(res => {
                // 响应成功回调
                if (res.data.length != 0) {
                  if (JSON.stringify(this.list1[this.list1.length - 1]).indexOf(JSON.stringify(res.data[res.data.length -
                      1])) == -1) {
                    this.page1++;
                    this.list1 = this.list1.concat(res.data);
                  } else {
                    this.finished1 = true;
                  }
                } else {
                  this.finished1 = true;
                }
                this.loading1 = false;
              }).catch(
                error => {

                });
          }, 300);
        }
        if (index == 0) {
          p = this.page2;
          setTimeout(() => {
            this.axios
              .get(
                "http://xibei.hnocse.com/sinopec/tv", {
                  params: {
                    action: "show",
                    id: id,
                    page: p + 1,
                    size: 10
                  }
                }
              )
              .then(res => {
                // 响应成功回调
                if (res.data.length != 0) {
                  if (JSON.stringify(this.list2[this.list2.length - 1]).indexOf(JSON.stringify(res.data[res.data.length -
                      1])) == -1) {
                    this.page2++;
                    this.list2 = this.list2.concat(res.data);
                  } else {
                    this.finished2 = true;
                  }
                } else {
                  this.finished2 = true;
                }
                this.loading2 = false;
              }).catch(
                error => {

                });
          }, 300);
        }
      },
      //微信分享
      //获取16位随机字符
      randomString(len) {
        len = len || 16;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
        for (let i = 0; i < len; i++) {
          pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
      },
      getJsapi_ticket(linkUrl, linkTitle) {
        let wx_timestamp = Date.parse(new Date()) / 1000;
        let wx_nonceStr = this.randomString(16);
        this.axios.post(
            "http://epec.cyparty.com/api/wx/ticket"
          )
          .then(
            res => {
              let url = window.location.href;
              if (url.indexOf("#") > -1) {
                url = url.split("#")[0];
              }

              let str1 = 'jsapi_ticket=' + res.data.result + '&noncestr=' + wx_nonceStr + '&timestamp=' +
                wx_timestamp + '&url=' + url + '';

              let signatures = sha1(str1);
              wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: 'wxebc8a56842ea5a5b', // 必填，公众号的唯一标识
                timestamp: wx_timestamp, // 必填，生成签名的时间戳
                nonceStr: wx_nonceStr, // 必填，生成签名的随机串
                signature: signatures, // 必填，签名
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ',
                  'onMenuShareQZone'
                ] // 必填，需要使用的JS接口列表
              });

              wx.ready(function () {
                wx.onMenuShareTimeline({
                  title: linkTitle, // 分享标题
                  link: linkUrl, // 分享链接
                  imgUrl: 'http://epec418.cyparty.com/xbxw.png', // 分享图标
                  success: function () {
                    // 用户确认分享后执行的回调函数
                  },
                  cancel: function () {
                    // 用户取消分享后执行的回调函数
                  }
                });
                wx.onMenuShareAppMessage({
                  title: linkTitle, // 分享标题
                  link: linkUrl, // 分享链接
                  desc: "奋进西北", // 分享描述
                  imgUrl: 'http://epec418.cyparty.com/xbxw.png', // 分享图标
                  success: function () {
                    // 用户确认分享后执行的回调函数
                  },
                  cancel: function () {
                    // 用户取消分享后执行的回调函数
                  }
                });
                wx.onMenuShareQQ({
                  title: linkTitle, // 分享标题
                  link: linkUrl, // 分享链接
                  desc: "奋进西北", // 分享描述
                  imgUrl: 'http://epec418.cyparty.com/xbxw.png', // 分享图标
                  success: function () {
                    // 用户确认分享后执行的回调函数
                  },
                  cancel: function () {
                    // 用户取消分享后执行的回调函数
                  }
                });
                wx.onMenuShareQZone({
                  title: linkTitle, // 分享标题
                  link: linkUrl, // 分享链接
                  desc: "奋进西北", // 分享描述
                  imgUrl: 'http://epec418.cyparty.com/xbxw.png', // 分享图标
                  success: function () {
                    // 用户确认分享后执行的回调函数
                  },
                  cancel: function () {
                    // 用户取消分享后执行的回调函数
                  }
                });
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
              });
              wx.error(function (res) {

                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签
                //                    alert(res)
              });
            }
          ).catch(
            error => {

            });
      }
    },
    // beforeRouteEnter(to, from, next) {
    //   to.meta.keepAlive = false;
    //   next();
    // },
    beforeRouteEnter(to, from, next) {
      if (from.meta.index == "1") {
        window.scrollTo(0, 0);
      }
      next();
    },
    deactivated() {
      this.actionShow = false;
    }
  };

</script>
<style>
  @import '../../../static/CSS/index.css';
  @import "../../../static/CSS/details.css";
  @import "../../../static/CSS/publish.css";

</style>
