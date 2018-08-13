<template>
  <div>
    <van-nav-bar title="详情" @click-left="onClickLeft" fixed>
      <van-icon name="home" slot="left" />
    </van-nav-bar>
    <div class='contentBox' v-if="this.$route.query.type === 'news'">
      <h2>{{this.info.title}}</h2>
      <p class='name'>{{this.info.author}} {{this.info.publish_time|formatDate}}</p>
      <!-- <div :v-html="load(url1)"></div> -->
      <p class='contents' v-html="this.info.content"></p>
    </div>
    <div class='contentBox' v-if="this.$route.query.type === 'xbVideo'">
      <h2>{{this.info.title}}</h2>
      <p class='name'>{{this.info.author}} {{this.info.uploadTime|formatDate}}</p>
      <!-- <div :v-html="load(url1)"></div> -->
      <p class='contents'>
        <video-player v-show="isPlay" class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions"></video-player>
      </p>
    </div>
    <div class='contentBox' v-if="this.$route.query.type === 'shVideo'">
      <h2>{{this.info.title}}</h2>
      <p class='name'>{{this.info.author}} {{this.info.uploadTime|formatDate}}</p>
      <!-- <div :v-html="load(url1)"></div> -->
      <p class='contents'>
        <video-player v-show="isPlay" class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions"></video-player>
      </p>
      <p class='contents' v-html="this.info.content">{{this.info.content}}</p>
    </div>
    <div v-show="isShow" class='tip'>相关推荐</div>
    <div v-show="isShow" style="min-height:15vh;backgrouncolor:#fff">
      <div v-show="isShow" class='news  van-hairline--bottom' v-for="(item,index) in list" :key="index" @click="goPage(item.article_id) ">
        <img :src="item.pic1" class='detailImg'>
        <p class='newsTitle'>{{item.title}}</p>
        <p class='date'>{{item.publish_time|formatDate}}</p>
      </div>
    </div>
    <div class='tip'>用户评论</div>
    <div class='command'>
      <div v-show="this.cList.length == 0" style="text-align: center;color:#878787">
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
    <van-goods-action>
      <van-goods-action-mini-btn icon="arrow-left" @click="goBack">
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
    NavBar,
    Icon,
    GoodsAction,
    GoodsActionBigBtn,
    GoodsActionMiniBtn,
    Popup,
    Panel,
    Button,
    Cell,
    CellGroup,
    Field
  } from "vant";
  export default {
    components: {
      [NavBar.name]: NavBar,
      [Icon.name]: Icon,
      [GoodsAction.name]: GoodsAction,
      [GoodsActionBigBtn.name]: GoodsActionBigBtn,
      [GoodsActionMiniBtn.name]: GoodsActionMiniBtn,
      [Popup.name]: Popup,
      [Panel.name]: Panel,
      [Button.name]: Button,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [Field.name]: Field
    },
    data() {
      return {
        article_id: "", //文章ID，点击先关推荐跳转用
        info: "", //文章详情
        // date: "",
        add: "add-o", //收藏
        comment: 0, //评论数
        message: "", //评论内容
        sofa: true, //沙发是否显示
        show: false, //评论框是否显示
        rncikName: "", //回复人昵称
        isShow: false, //显示推荐
        desc: "",//回复人显示
        list: [], //相关推荐
        isPlay: false,
        cList: [{
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
            src: " " //url地址 必填，巨坑
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
    created() {
      this.init();
    },
    mounted() {
      this.comment = this.cList.length;
      // this.load(this.url1)
    },
    methods: {
      init() {
        this.info = "";
        this.list = [];
        this.isShow = false;
        this.playerOptions.poster = '';
        this.getShowInfo();
        this.getShowreLate();
        this.goTop();
      },
      goTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      },
      goPage(article_id) {
        this.$router.push({
          path: "/details",
          query: {
            id: article_id,
            type: "news"
          }
        });
      },
      checkText() {
        if (this.message.length > 255) {
          this.message = this.message.substring(0, 255);
        }
      },
      getShowInfo() {
        if (this.$route.query.type === "news") {
          setTimeout(() => {
            this.axios
              .get(
                "http://jhyt.cyparty.com/app/api/news", {
                  params: {
                    article_id: this.$route.query.id,
                    action: "show_info"
                  }
                }
              )
              .then(
                res => {
                  // 响应成功回调
                  this.info = res.data.result[0];
                }
              ).catch(
                error => {

                });
          }, 500);
        } else if (this.$route.query.type === "xbVideo") {
          setTimeout(() => {
            this.axios
              .get(
                "http://xibei.hnocse.com/xb/tv", {
                  params: {
                    id: this.$route.query.id,
                    action: "show"
                  }
                }
              )
              .then(
                res => {
                  // 响应成功回调
                  this.info = res.data[0];
                  this.playerOptions.sources[0].src = this.info.video_url;
                  this.playerOptions.poster = this.info.image;
                  this.isPlay = true
                }
              ).catch(
                error => {

                });
          }, 500);
        } else if (this.$route.query.type === "shVideo") {
          setTimeout(() => {
            this.axios
              .get(
                "http://xibei.hnocse.com/sinopec/tv", {
                  params: {
                    id: this.$route.query.id,
                    action: "show_info"
                  }
                }
              )
              .then(
                res => {
                  // 响应成功回调
                  this.info = res.data;
                  this.playerOptions.sources[0].src = this.info.video_url;
                  this.playerOptions.poster = this.info.image_url;
                  this.isPlay = true
                }
              ).catch(
                error => {

                });
          }, 500);
        }

      },
      getShowreLate() {
        if (this.$route.query.type === "news") {
          setTimeout(() => {
            this.axios
              .get(
                "http://jhyt.cyparty.com/app/api/news", {
                  params: {
                    article_id: this.$route.query.id,
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
          }, 500);
        } else {
          this.isShow = false;
        }
      },
      onClickLeft() {
        this.$router.push("/index");
      },
      onComment(obj) {
        this.show = true;
        this.rncikName = obj.nickName;
        this.desc = "回复：" + obj.nickName;
      },
      onSubmit() {
        this.show = true;
        this.rncikName = "";
      },
      goBack() {
        this.$router.go(-1);
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
      onAdd() {
        if (this.add === "add") {
          this.add = "add-o";
        } else {
          this.add = "add";
        }
      }
      // load(url) {
      //   if (url && url.length > 0) {
      //     // 加载中
      //     let param = {
      //       accept: 'text/html, text/plain',
      //       dataType:'jsonp'
      //     }
      //     this.$http.get(url, param).then((response) => {
      //       // 处理HTML显示
      //       this.html = response.data
      //     }).catch(() => {
      //       this.html = '加载失败'
      //     })
      //   }
      // }
    },
    watch: {
      $route: "init"
    },
    beforeRouteLeave(to, from, next) {
      to.meta.keepAlive = true;
      next();
    }
  };

</script>

<style>
  @import "../../../static/CSS/details.css";
</style>
