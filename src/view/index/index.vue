<template>
  <div>
    <transition name="van-fade">
      <van-loading v-show="loadingShow" color="black" size="1rem" class="loadingShow" />
    </transition>
    <div class='tab'>
      <van-tabs v-model="active" v-bind:line-width="60" @click="onClick" @change="onChange" swipeable sticky>
        <van-tab  :title="tabs[0].title">
          <van-pull-refresh v-show="active==0"  v-model="isLoading" @refresh="onRefresh(active)" pulling-text='↓下拉即可刷新...' loosing-text='↑松开即可刷新...' loading-text='正在刷新列表...'>
            <van-list :immediate-check="false" v-model="loading1" :finished="finished1" @load="getList(tabs[active].menu_id,active)" loading-text='正在加载...'>
              <div v-if="active==0" v-for="(item, index) in list1" :key="index">
                <div class='topImg' v-lazy:background-image="item.pic1" v-if="index===0" @click="showPop(item.article_id,'news')">
                  <div class='opacity'>
                  </div>
                  <div class='opacitytext'>{{item.title}}</div>
                </div>
                <div v-else class='content content1 van-hairline--bottom' @click="showPop(item.article_id,'news')">
                  <p class='title'>{{item.title}}</p>
                  <p class='bottom bottom1'>{{item.publish_time|formatDate}}
                    <span class='reading'>{{item.view_count}}阅读</span>
                  </p>
                  <img v-lazy="item.pic1">
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
          <div class='useless'></div>
        </van-tab>
        <van-tab  :title="tabs[1].title">
          <van-pull-refresh v-show="active==1" v-model="isLoading" @refresh="onRefresh(active)" pulling-text='↓下拉即可刷新...' loosing-text='↑松开即可刷新...' loading-text='正在刷新列表...'>
            <van-list :immediate-check="false"  v-model="loading2" :finished="finished2" @load="getList(tabs[active].menu_id,active)" loading-text='正在加载...'>
              <div v-if="active==1" v-for="(item, index) in list2" :key="index">
                <div class='topImg' v-lazy:background-image="item.pic1" v-if="index===0" @click="showPop(item.article_id,'news')">
                  <div class='opacity'>
                  </div>
                  <div class='opacitytext'>{{item.title}}</div>
                </div>
                <div v-else class='content content1 van-hairline--bottom' @click="showPop(item.article_id,'news')">
                  <p class='title'>{{item.title}}</p>
                  <p class='bottom bottom1'>{{item.publish_time|formatDate}}
                    <span class='reading'>{{item.view_count}}阅读</span>
                  </p>
                  <img v-lazy="item.pic1">
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
          <div class='useless'></div>
        </van-tab>
        <van-tab  :title="tabs[2].title">
          <van-pull-refresh v-show="active==2" v-model="isLoading" @refresh="onRefresh(active)" pulling-text='↓下拉即可刷新...' loosing-text='↑松开即可刷新...' loading-text='正在刷新列表...'>
            <van-list :immediate-check="false"  v-model="loading3" :finished="finished3" @load="getList(tabs[active].menu_id,active)" loading-text='正在加载...'>
              <div v-if="active==2" v-for="(item, index) in list3" :key="index">
                <div class='topImg' v-lazy:background-image="item.cover" v-if="index===0" @click="goURL(item.content_url)">
                  <div class='opacity'>
                  </div>
                  <div class='opacitytext'>{{item.title}}</div>
                </div>
                <div v-else class='content content1 van-hairline--bottom' @click="goURL(item.content_url)">
                  <p class='title'>{{item.title}}</p>
                  <p class='bottom bottom1'>{{item.createTime|formatDate}}
                    <span class='reading'>{{item.read_num}}阅读</span>
                  </p>
                  <img v-lazy="item.cover">
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
          <div class='useless'></div>
        </van-tab>
        <van-tab  :title="tabs[3].title">
          <van-pull-refresh v-show="active==3" v-model="isLoading" @refresh="onRefresh(active)" pulling-text='↓下拉即可刷新...' loosing-text='↑松开即可刷新...' loading-text='正在刷新列表...'>
            <van-list :immediate-check="false"  v-model="loading4" :finished="finished4" @load="getList(tabs[active].menu_id,active)" loading-text='正在加载...'>
              <div v-if="active==3" v-for="(item, index) in list4" :key="index">
                <div class='picNew van-hairline--bottom' @click="showPop(item.link_id,'topic',item.type,item.pic1,item.title)">
                  <div v-lazy:background-image="item.pic1" class="bigImg"></div>
                  <p class='picNewTitle'>{{item.title}}</p>
                  <p class='picNewTime'>{{item.publish_time|formatDate}}</p>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
          <div class='useless'></div>
        </van-tab>
      </van-tabs>
    </div>

    <van-popup id='popupList' v-model="popListShow" position="right" :overlay="false" style="z-index:2000">
      <div class="postInfo">
        <div class='topImg' v-lazy:background-image="topicImg" :key="topicImg">
          <div class='opacity'>
          </div>
          <div class='opacitytext'>{{topicName}}</div>
        </div>
        <div v-for="(item, index) in topicList" :key="index">
          <div class='content content1 van-hairline--bottom' @click="showPop(item.article_id,'news')">
            <p class='title'>{{item.title}}</p>
            <p class='bottom bottom1'>{{item.publish_time|formatDate}}
              <span class='reading'>{{item.view_count}}阅读</span>
            </p>
            <img v-lazy="item.pic1">
          </div>
        </div>

      </div>
      <div class='useless'></div>
    </van-popup>

    <van-popup id='popup' v-model="popShow" position="right" :overlay="false" style="z-index:2000">
      <div class="postInfo">
        <div class='contentBox' v-if="infoType == 'news'">
          <h2>{{info.title}}</h2>
          <p class='name'>{{info.author}} {{info.uploadTime|formatDate}}</p>
          <p class='contents' v-html="info.content"></p>
        </div>

        <div class='contentBox' v-if="infoType == 'video'">
          <h2>{{info.title}}</h2>
          <p class='name'>{{info.author}} {{info.uploadTime|formatDate}}</p>
          <!-- <div :v-html="load(url1)"></div> -->
          <p class='contents'>
            <video-player v-show="isPlay" class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions"></video-player>
          </p>
          <p class='contents' v-html="info.content"></p>
        </div>
        <iframe v-if="infoType == 'h5'" class="h5" frameborder="0" :src="info"></iframe>
      </div>

      <!-- <div v-show="isShow" class='tip'>相关推荐</div>
      <div v-show="isShow" style="min-height:15vh;backgrouncolor:#fff">
        <div v-show="isShow" class='news  van-hairline--bottom' v-for="(item,index) in list" :key="index" @click="showDetailPop(item.article_id,'news')">
          <img :src="item.pic1" class='detailImg'>
          <p class='newsTitle'>{{item.title}}</p>
          <p class='date'>{{item.publish_time|formatDate}}</p>
        </div>
      </div> -->

      <div v-show="isShow" class='tip'>用户回复</div>
      <div v-show="isShow" class='command'>
        <div v-show="this.cList.length == 0" style="text-align: center;color:#878787;height:3rem;">
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
      <div v-show="isShow" class="footer"></div>
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
      <van-goods-action-mini-btn icon="arrow-left" @click="close(infoType)">
        后退
      </van-goods-action-mini-btn>
      <van-goods-action-big-btn v-show="isShow" class="commBtn" @click="onSubmit">
        <van-icon name="edit" /> 写评论…
      </van-goods-action-big-btn>
      <van-goods-action-mini-btn v-show="isShow" icon="chat" :info="comment" @click="onSubmit">
        评论
      </van-goods-action-mini-btn>
      <van-goods-action-mini-btn v-show="isShow" :icon="add" @click="onAdd">
        收藏
      </van-goods-action-mini-btn>
    </van-goods-action>

    <van-goods-action v-show="h5actionShow" style="z-index:2001 !importent;">
      <van-goods-action-mini-btn icon="arrow-left" @click="close('topic')">
        后退
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
    Loading
  } from "vant";
  import wx from 'weixin-js-sdk';
  import sha1 from 'sha1';
  export default {
    data() {
      return {
        scroll: 0,
        scroll1: 0,
        scroll2: 0,
        scroll3: 0,
        scroll4: 0,
        loadingShow: true, //加载显示
        list1: [], //列表1数据
        list2: [], //列表2数据
        list3: [], //列表3数据
        list4: [], //列表4数据
        hotNew: [], //头条
        topicList: [], //专题详情列
        topicImg: '', //专题图
        topicName: '', //专题名
        active: 0, //Tab选中标签index
        page1: 0, //列表1页码
        page2: 0, //列表2页码
        page3: 0, //列表3页码
        page4: 0, //列表4页码
        loading1: false,
        finished1: false,
        loading2: false,
        finished2: false,
        loading3: false,
        finished3: false,
        loading4: false,
        finished4: false,
        isLoading: false, //下拉刷新
        info: "", //文章详情
        infoType: "", //文章类型
        isShow: false, //显示推荐
        list: [], //相关推荐
        popShow: false, //详情弹出层显示or隐藏
        popListShow: false, //专题列表弹出层显示or隐藏
        actionShow: false, //动作条显示or隐藏
        h5actionShow: false,
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
        shareTitle: "奋进西北 — 首页", //分享标题
        tabs: [{
            title: "西北头条",
            menu_id: "4"
          },
          {
            title: "石化声音",
            menu_id: "2"
          },
          {
            title: "第一时间",
            menu_id: "0"
          },
          {
            title: "专题报道",
            menu_id: "23"
          }
        ],
        isPlay: false,
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
      [Loading.name]: Loading
    },
    created() {
      // this.getHotNew();//热门
      this.initList(4, 0);
      this.initList(2, 1);
      this.initList(0, 2);
      this.initList(23, 3);
      let url = window.location.href;
      if (url.indexOf("#") > -1) {
        url = url.split("#")[0];
      }
      this.pageUrl = url + "#/index";
      if (this.$route.query.id != null) {
        if (this.$route.query.typeID != null) {
          this.showPop(this.$route.query.id, this.$route.query.type, this.$route.query.typeID, this.$route.query.img,
            this.$route.query.name)
        } else {
          this.showPop(this.$route.query.id, this.$route.query.type)
        }
      } else {
        this.getJsapi_ticket(this.pageUrl, this.shareTitle);
      }


    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll);
      this.comment = this.cList.length;
      // document.getElementById('popup').scrollTop=0
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
      close(index) {
        history.pushState(null, null, this.pageUrl)
        if (index == 'news' || index == 'video' || index == 'h5') {
          document.getElementById('popup').scrollTop = 0;
          this.popShow = false;
          this.actionShow = false;
          if (this.listUrl.length > 0) {
            this.shareTitle = this.topicName;
            this.shareUrl = this.listUrl;
            this.getJsapi_ticket(this.shareUrl, this.shareTitle);
          } else {
            this.shareTitle = "奋进西北"
            this.shareUrl = this.pageUrl
            this.getJsapi_ticket(this.shareUrl, this.shareTitle);
          }

        }
        if (index == 'topic') {
          this.topicImg = "";
          document.getElementById('popupList').scrollTop = 0;
          this.popListShow = false;
          this.h5actionShow = false;
          this.shareUrl = this.pageUrl
          this.shareTitle = "奋进西北"
          this.getJsapi_ticket(this.shareUrl, this.shareTitle);
        }
        this.isPlay = false;
        this.info = "";
        this.playerOptions.sources[0].src = "";
        if (this.popListShow) {
          this.h5actionShow = true;
        }
        if (this.popShow) {
          this.h5actionShow = false;
        }
        // console.log(this.shareUrl)
      },
      getShowreLate(id, type) {
        if (type == "news") {
          setTimeout(() => {
            this.axios
              .get(
                "http://jhyt.cyparty.com/app/api/news", {
                  params: {
                    article_id: id,
                    action: "show_relate"
                  }
                }
              )
              .then(
                res => {
                  // 响应成功回调
                  this.list = res.data.result;
                  this.isShow = true;
                }
              ).catch(
                error => {

                });
          }, 300);
        } else {
          this.isShow = false;
        }
      },
      showDetailPop(id, type) {
        this.showPop(id, type);
        document.getElementById('popup').scrollTop = 0;
      },
      showPop(id, type, typeID, img, name) {
        this.loadingShow = true;
        this.detailUrl = "";
        if (typeID != null) {
          this.listUrl = this.pageUrl + "?id=" + id + "&type=" + type + "&typeID=" + typeID +
            "&img=" + img + "&name=" + name;
          this.shareUrl = this.listUrl
        } else if (id != null) {
          this.detailUrl = this.pageUrl + "?id=" + id + "&type=" + type;
          this.shareUrl = this.detailUrl
        }
        this.h5actionShow = false;
        this.actionShow = false;
        if (type == 'news') {
          this.actionShow = true;
          setTimeout(() => {
            this.axios
              .get(
                "http://xibei.hnocse.com/app/api/news", {
                  params: {
                    article_id: id,
                    action: "show_info"
                  }
                }
              )
              .then(
                res => {
                  // 响应成功回调
                  this.info = res.data.result[0];
                  this.shareTitle = this.info.title;
                  this.getJsapi_ticket(this.shareUrl, this.shareTitle);
                  if (this.info.content.toLowerCase().indexOf('http') != 0) {
                    this.infoType = 'news';
                    this.isShow = true;
                  }
                  if (this.info.content.toLowerCase().indexOf('http') == 0) {
                    this.infoType = 'h5';

                    this.info = this.info.description;
                    this.isShow = false;
                  }
                  if (this.info.video.trim() != "") {
                    this.infoType = 'video';
                    this.isShow = true;
                    this.playerOptions.sources[0].src = this.info.video;
                    this.playerOptions.poster = this.info.pic1;
                    this.isPlay = true;
                  }
                  // this.getShowreLate(id, this.infoType)
                }
              ).catch(
                error => {

                });
          }, 300);
          this.popShow = true;
        }
        if (type == 'topic') {
          this.topicList = [];
          this.infoType = 'topic';
          this.topicImg = '';
          this.topicName = '';
          setTimeout(() => {
            this.axios
              .get(
                "http://xibei.hnocse.com/app/api/news", {
                  params: {
                    link_id: id,
                    action: "show_subject",
                    type: typeID
                  }
                }
              )
              .then(
                res => {
                  // 响应成功回调
                  this.topicList = res.data.result
                  this.getJsapi_ticket(this.shareUrl, name);
                }
              ).catch(
                error => {

                });
          }, 300);
          this.popListShow = true;
          this.h5actionShow = true;
          this.topicImg = img;
          this.topicName = name;
          this.shareTitle = name;
        }

        if (type == 'h5') {
          this.infoType = 'h5';
          this.info = id;
          this.popShow = true;
          this.actionShow = true;
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
      goURL(url) {
        window.open(url, "_blank");
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
        if (this.active == 2) {
          this.scroll3 = this.scroll
        }
        if (this.active == 3) {
          this.scroll4 = this.scroll
        }
      },
      onChange(index, title) {
        // console.log(this.scroll)
        if (index == 0) {
          window.scroll(0, this.scroll1);
        }
        if (index == 1) {
          window.scroll(0, this.scroll2);
        }
        if (index == 2) {
          window.scroll(0, this.scroll3);
        }
        if (index == 3) {
          window.scroll(0, this.scroll4);
        }
      },
      onClick(index, title) {
        if (index == 0) {
          window.scroll(0, this.scroll1);
        }
        if (index == 1) {
          window.scroll(0, this.scroll2);
        }
        if (index == 2) {
          window.scroll(0, this.scroll3);
        }
        if (index == 3) {
          window.scroll(0, this.scroll4);
        }
      },
      initList(id, index) {
        if (index === 2) {
          setTimeout(() => {
            this.axios
              .get(
                "http://jusha.cyparty.com/article/tag", {
                  params: {
                    action: "show_article",
                    source: "xb",
                    keyword: "",
                    page: 0,
                    size: 10
                  }
                }
              )
              .then(
                res => {
                  // 响应成功回调
                  if (res.data.result.length != 0) {
                    this.list3 = res.data.result;
                  } else {
                    this.finished3 = true;
                  }
                  this.loading3 = false;
                }
              ).catch(
                error => {

                });
          }, 300);
        } else {
          setTimeout(() => {
            this.axios
              .get(
                "http://xibei.hnocse.com/app/api/news", {
                  params: {
                    action: "show",
                    menu_id: id,
                    keyword: "",
                    page: 0,
                    size: 10
                  }
                }
              )
              .then(
                res => {
                  if (index == 0) {
                    if (res.data.result.length != 0) {
                      this.list1 = res.data.result;
                    } else {
                      this.finished1 = true;
                    }
                    this.loading1 = false;
                  }
                  if (index == 1) {
                    if (res.data.result.length != 0) {
                      this.list2 = res.data.result;
                    } else {
                      this.finished2 = true;
                    }
                    this.loading2 = false;
                  }
                  if (index == 3) {
                    if (res.data.result.length != 0) {
                      this.list4 = res.data.result;
                    } else {
                      this.finished4 = true;
                    }
                    this.loading4 = false;
                  }
                },
              ).catch(
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
        if (index === 2) {
          this.page3 = 0;
          this.finished3 = false;
        }
        if (index === 3) {
          this.page4 = 0;
          this.finished4 = false;
        }
        setTimeout(() => {
          this.initList(this.tabs[this.active].menu_id, this.active);
          this.isLoading = false;
        }, 300);
      },
      // getHotNew() {
      //   this.$http.get("http://jhyt.cyparty.com/app/api/news", {
      //       params: {
      //         action: "show_hot",
      //         menu_id: "28"
      //       }
      //     }, {
      //       emulateJSON: true
      //     })
      //     .then(
      //       res => {
      //         // 响应成功回调
      //         this.hotNew.push(res.data.result[0]);
      //       },
      //       res => {
      //         // 响应错误回调
      //       }
      //     );

      // },

      getList(id, index) {
        let p = 0;
        if (index === 0) {
          p = this.page1;
        }
        if (index === 1) {
          p = this.page2;
        }
        if (index === 2) {
          p = this.page3;
        }
        if (index === 3) {
          p = this.page4;
        }

        if (id == 0) {
          setTimeout(() => {
            this.axios
              .get(
                "http://jusha.cyparty.com/article/tag", {
                  params: {
                    action: "show_article",
                    source: "xb",
                    keyword: "",
                    page: p + 1,
                    size: 10
                  }
                }
              )
              .then(
                res => {
                  // 响应成功回调
                  if (res.data.result.length != 0) {
                    if (JSON.stringify(this.list3[this.list3.length - 1]).indexOf(JSON.stringify(res.data.result[
                        res.data.result.length - 1])) == -1) {
                      this.page3++;
                      this.list3 = this.list3.concat(res.data.result);
                    } else {
                      this.finished3 = true;
                    }
                  } else {
                    this.finished3 = true;
                  }
                  this.loading3 = false;
                }
              ).catch(
                error => {

                });
          }, 300);
        } else {
          setTimeout(() => {
            this.axios
              .get(
                "http://xibei.hnocse.com/app/api/news", {
                  params: {
                    action: "show",
                    menu_id: id,
                    keyword: "",
                    page: p + 1,
                    size: 10
                  }
                }
              )
              .then(
                res => {
                  if (index === 0) {
                    if (res.data.result.length != 0) {
                      if (JSON.stringify(this.list1[this.list1.length - 1]).indexOf(JSON.stringify(res.data.result[
                          res.data.result.length - 1])) == -1) {
                        this.page1++;
                        this.list1 = this.list1.concat(res.data.result);
                      } else {
                        this.finished1 = true;
                      }
                    } else {
                      this.finished1 = true;
                    }
                    this.loading1 = false;
                  }
                  if (index === 1) {
                    if (res.data.result.length != 0) {
                      if (JSON.stringify(this.list2[this.list2.length - 1]).indexOf(JSON.stringify(res.data.result[
                          res.data.result.length - 1])) == -1) {
                        this.page2++;
                        this.list2 = this.list2.concat(res.data.result);
                      } else {
                        this.finished2 = true;
                      }
                    } else {
                      this.finished2 = true;
                    }
                    this.loading2 = false;
                  }
                  if (index === 3) {
                    if (res.data.result.length != 0) {
                      if (JSON.stringify(this.list4[this.list4.length - 1]).indexOf(JSON.stringify(res.data.result[
                          res.data.result.length - 1])) == -1) {
                        this.page4++;
                        this.list4 = this.list4.concat(res.data.result);
                      } else {
                        this.finished4 = true;
                      }
                    } else {
                      this.finished4 = true;
                    }
                    this.loading4 = false;
                  }
                }
              ).catch(
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
                  desc: '西北油田', // 分享描述
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
                  desc: '西北油田', // 分享描述
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
                  desc: '西北油田', // 分享描述
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
    beforeRouteEnter(to, from, next) {
      if (from.meta.index == "1") {
        window.scrollTo(0, 0);
      }
      next();
    },
    activated() {
      this.actionShow = false;
      this.h5actionShow = false;
      this.popShow = false;
      this.popListShow = false;
    },
    deactivated() {
      this.actionShow = false;
      this.h5actionShow = false;
      this.popShow = false;
      this.popListShow = false;
    }
  };

</script>
<style>
  @import "../../../static/CSS/index.css";
  @import "../../../static/CSS/details.css";
  @import "../../../static/CSS/publish.css";

</style>
