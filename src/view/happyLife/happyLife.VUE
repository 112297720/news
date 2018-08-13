<template>
  <div>
    <van-loading v-show="loadingShow" color="black" size="1rem" class="loadingShow" />
    <div class='searchBox'>
      <p class="pageTitle">悦生活</p>
      <!-- <img src="../../../static/images/search.png" class="searchBtn"> -->
      <p class="publishP" @click="onPublish" >发布</p><van-icon @click="onPublish"   name="edit" color="#fff" class="publishBtn" />
    </div>
    <div>
      <van-swipe :autoplay="4000" style="padding-top:.9rem;">
        <van-swipe-item v-for="(image, index) in images" :key="index">
          <div class="swipeTitleDiv" @click="clicked(index)">
            <!-- <p class="swipeTitle">12312</p> -->
          </div>
          <img class="swipeImg" v-lazy="image">
        </van-swipe-item>
      </van-swipe>
    </div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" pulling-text='↓下拉即可刷新...' loosing-text='↑松开即可刷新...' loading-text='正在刷新列表...'>
      <div class="postList">
        <van-list :immediate-check=false v-model="loading" :finished="finished" @load="getList()" loading-text='正在加载...'>
          <div class="post" v-for="(item, index) in postList" :key="index">
            <div class="postView" @click="showPop(item)">
              <img :src="item.headImg" class='pheadImg'>
              <p class='nickName'>{{item.nickName}}</p>
              <p class='commDate'>{{item.publish_time|formatDate}}</p>
              <p class='pcommInfo'>{{item.content}}</p>
            </div>
            <div class="postImgs">
              <img :preview="index" class="postImg" v-for="(item, i) in item.images" :key="i" v-lazy="item">
            </div>
            <div class="viewCount" @click="showPop(item)">
              <van-icon name="chat" color="#a6acc1;" v-if="item.viewCount>=100" info="99+" />
              <van-icon name="chat" color="#a6acc1;" v-else :info="item.viewCount" />
            </div>
          </div>
        </van-list>
      </div>
    </van-pull-refresh>
    <van-popup id='popup' v-model="popShow" position="right" :overlay="false" style="z-index:2000">
      <div class="postInfo" v-show="postInfo!=null">
        <div class="postView">
          <img :src="postInfo.headImg" class='pheadImg'>
          <p class='nickName'>{{postInfo.nickName}}</p>
          <p class='commDate'>{{postInfo.publish_time|formatDate}}</p>
          <p class='pInfo' v-html='postInfo.content'></p>
        </div>
        <div>
          <img preview="999" class="pImg" v-for="(item, index) in postInfo.images" :key="index" v-lazy="item">
        </div>
      </div>
      <div class='tip'>用户回复</div>
      <div class='command'>
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
      <van-goods-action-mini-btn icon="arrow-left" @click="popShow = false,actionShow=false">
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
    <div class="footer"></div>
  </div>
</template>
<script>
  import qs from 'qs';
  import {
    Panel,
    PullRefresh,
    Uploader,
    Row,
    Col,
    Icon,
    Button,
    Popup,
    Loading,
    Toast,
    List,
    Swipe,
    SwipeItem,
    Field,
    Cell,
    CellGroup,
    GoodsAction,
    GoodsActionBigBtn,
    GoodsActionMiniBtn
  }
  from "vant";
  export default {
    data() {
      return {
        loadingShow: false, //加载显示
        fileList: [], //上传文件列表数据
        filetype: ['image', 'audio', 'video'], //文件类型
        show: false, //评论弹出层显示or隐藏
        pMsg: '', //弹出层信息
        popShow: false, //详情弹出层显示or隐藏
        actionShow: false, //动作条显示or隐藏
        uploading: false, //上传等待弹出层
        filenum: 0, //上传文件剩余数量
        total: 0, //上传文件总数量
        loading: false,
        finished: false,
        page: 0, //列表刷新次数
        isLoading: false, //下拉刷新
        images: [
          require('../../../static/images/1.jpg'),
          require('../../../static/images/2.jpg')
        ],
        postInfo: {},
        postList: [], //帖子列表
        add: "add-o", //收藏
        comment: 0, //评论数
        message: "", //评论内容
        desc: "", //回复人显示
        cList: [] //评论列表
      };
    },
    components: {
      [Panel.name]: Panel,
      [Uploader.name]: Uploader,
      [PullRefresh.name]: PullRefresh,
      [Icon.name]: Icon,
      [Button.name]: Button,
      [Row.name]: Row,
      [Col.name]: Col,
      [Popup.name]: Popup,
      [Loading.name]: Loading,
      [Toast.name]: Toast,
      [List.name]: List,
      [Swipe.name]: Swipe,
      [SwipeItem.name]: SwipeItem,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [GoodsAction.name]: GoodsAction,
      [GoodsActionBigBtn.name]: GoodsActionBigBtn,
      [GoodsActionMiniBtn.name]: GoodsActionMiniBtn,
      [Field.name]: Field
    },
    created() {
      // this.$toast.loading({ mask: true, message: '加载中...',duration:0 });
      this.initList();
    },
    mounted() {
      this.comment = this.cList.length;
    },
    updated() {
      setTimeout(() => {
        this.loadingShow = false;
      }, 400);
      // setTimeout(() => {
      //   this.$toast.clear();
      // }, 400);
    },
    methods: {
      onPublish(){
        this.$router.push({
            path: "/publish"
          });
      },
      clicked(index) {
        if (index == 0) {
          this.$router.push({
            path: "/uploadImg"
          });
        }
      },
      initList() {
        this.postList = [{
            user_id: 1,
            nickName: "测试用户1",
            content: "新华社北京7月13日电（记者陈键兴）13日上午，中共中央总书记习近平在人民大会堂会见中国国民党前主席连战率领的台湾各界人士参访团时强调，大道之行、人心所向，势不可挡。我们有充分的信心和足够的能力，牢牢把握正确方向，坚定不移推动两岸关系和平发展、推进祖国和平统一进程。希望两岸同胞共同努力，坚持体现一个中国原则的“九二共识”，坚决反对和遏制“台独”，扩大深化两岸各领域交流合作，增进同胞亲情福祉，在新时代携手同心书写中华民族伟大复兴新篇章。<br>习近平指出，“不畏浮云遮望眼，自缘身在最高层。”只要大家登高望远，就能看清主流、把握大势，共同推动两岸关系克难前行。我们对两岸关系未来充满信心，因为推动两岸关系和平发展、携手致力民族复兴，是符合民族整体利益、顺应时代潮流、造福两岸同胞、得到两岸同胞拥护的正确道路；因为不管经历多少风雨，两岸同胞在民族、文化认同和情感上从未分离；因为尽管数十年来两岸关系跌宕起伏，但总体趋势是向前发展的；因为两岸是密不可分、休戚与共的命运共同体。两岸同胞对更加美好生活的共同追求，对两岸关系走近走好的一致向往，是任何人都阻挡不了的。<br>习近平指出，“不忘初心，方得始终。”正确道路要坚持走下去。特别是在当前台海形势下，两岸同胞更要坚定信心，团结前行。",
            headImg: "http://image.yy.com/yywebalbumbs2bucket/46783fac143b433891c652219b942864_1514110116802.jpg",
            publish_time: "2018-07-15 10:29:56",
            viewCount: '100',
            images: [
              require('../../../static/images/1.jpg'),
              require('../../../static/images/2.jpg'),
            ]
          },
          {
            user_id: 2,
            nickName: "测试用户2",
            rncikName: "测试用户3",
            content: "今天心情不错！",
            headImg: "http://img3.imgtn.bdimg.com/it/u=20733103,1267671152&fm=27&gp=0.jpg",
            publish_time: "2018-07-14 10:29:56",
            viewCount: '16',
            images: [
              require('../../../static/images/1.jpg'),
            ]
          },
          {
            user_id: 2,
            nickName: "测试用户2",
            rncikName: "测试用户3",
            content: "发个瞅瞅",
            headImg: "http://img3.imgtn.bdimg.com/it/u=20733103,1267671152&fm=27&gp=0.jpg",
            publish_time: "2018-07-14 10:29:56",
            viewCount: '3',
            images: [

            ]
          }
        ]
      },
      onRefresh() {
        this.page = 0;
        this.finished = false;
        setTimeout(() => {
          this.initList();
          this.isLoading = false;
        }, 500);
      },
      getList() {
        let p = 0;
        p = this.page;
        let res = [{
          user_id: 3,
          nickName: "测试用户3",
          content: "哈哈哈！😃😃😃😃😃 ",
          headImg: "http://img5.imgtn.bdimg.com/it/u=3527916118,1559491205&fm=27&gp=0.jpg",
          publish_time: "2018-07-13 10:29:56",
          viewCount: '0',
          images: []
        }, {
          user_id: 3,
          nickName: "测试用户3",
          content: "感觉还不错",
          headImg: "http://img5.imgtn.bdimg.com/it/u=3527916118,1559491205&fm=27&gp=0.jpg",
          publish_time: "2018-07-13 10:29:56",
          viewCount: '8',
          images: []
        }, {
          user_id: 3,
          nickName: "测试用户3",
          content: "发个帖子测试一下😃",
          headImg: "http://img5.imgtn.bdimg.com/it/u=3527916118,1559491205&fm=27&gp=0.jpg",
          publish_time: "2018-07-13 10:29:56",
          viewCount: '200',
          images: []
        }]

        if (res.length != 0) {
          if (JSON.stringify(this.postList[this.postList.length - 1]).indexOf(JSON.stringify(res[res.length - 1])) == -
            1) {
            this.page++;
            this.postList = this.postList.concat(res);
          } else {
            this.finished = true;
          }
        } else {
          this.finished = true;
        }
        this.loading = false;
      },
      checkText() {
        if (this.message.length > 255) {
          this.message = this.message.substring(0, 255);
        }
      },
      onComment(obj) {
        this.show = true;
        this.rncikName = obj.nickName;
        this.desc = "回复：" + obj.nickName;
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
      //睡眠函数 numberMillis -- 要睡眠的毫秒数
      sleep(numberMillis) {

        var now = new Date();
        var exitTime = now.getTime() + numberMillis;
        while (true) {
          now = new Date();
          if (now.getTime() > exitTime) {
            return;
          }
        }
      },
      showPop(obj) {

        this.popShow = true;
        this.actionShow = true;

        this.postInfo = obj;

        this.$previewRefresh();

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
      //提交上传
      subClick() {
        this.filenum = 0;
        if (this.fileList.length != 0) {
          this.total = this.fileList.length;
          this.uploading = true;

          for (let i = 0; i < this.fileList.length; i++) {
            this.axios.post(
                "http://10.81.108.54:8080/api/file/uploadFile", qs.stringify({
                  fileBase64Code: this.fileList[i].content.split(',')[1],
                  fileType: this.fileList[i].type,
                  fileName: this.fileList[i].name,
                  size: this.fileList[i].size
                })
              )
              .then(
                res => {
                  // this.sleep(1000); //休眠1000毫秒
                  // 响应成功回调
                  if (i == this.total - 1) {
                    setTimeout(() => {
                      this.uploading = false;
                    }, 2000);
                  }
                  this.fileList.splice(this.fileList.indexOf(this.fileList[i]), 1);
                  this.filenum++;
                }
              ).catch(
                error => {
                  if (i == this.total - 1) {
                    setTimeout(() => {
                      this.uploading = false;
                    }, 2000);
                  }
                  this.pMsg = '由于网络原因上传失败，请重新上传';
                  this.show = true;
                  setTimeout(() => {
                    this.show = false;
                    this.pMsg = '';
                  }, 4000);
                });
          }
        }

      },
      logContent(file) {
        // console.log(file);
        this.pMsg = '文件超过10M无法上传';
        this.show = true;
        setTimeout(() => {
          this.show = false;
          this.pMsg = '';
        }, 4000);
      },
      affterRead() {
        return file => {

          if (file.length > 1) {
            for (let i = 0; i < file.length; i++) {
              if (file[i].file.type.indexOf('image') != -1 || file[i].file.type.indexOf('video') != -1) {
                //压缩图片
                this.cutImg(file[i])
              } else {
                this.pMsg = '不支持的文件格式';
                this.show = true;
                setTimeout(() => {
                  this.show = false;
                  this.pMsg = '';
                }, 1500);
              }
            }
          } else {
            if (file.file.type.indexOf('image') != -1 || file.file.type.indexOf('video') != -1) {
              //压缩图片
              this.cutImg(file)
            } else {
              this.pMsg = '不支持的文件格式';
              this.show = true;
              setTimeout(() => {
                this.show = false;
                this.pMsg = '';
              }, 2000);
            }
          }
        }
      },
      // showImg(img) {
      //   // const instance = ImagePreview([img])
      //   console.log(img)
      // },
      clearItem(i) {
        this.fileList.splice(i, 1);
      },
      cutImg(file) {
        var that = this;
        var item = {}; //压缩后对象
        if (file.file.type.indexOf('image') == 0) {
          // 压缩图片需要的一些元素和对象
          var img = new Image();
          // console.log(file.content)
          img.src = file.content;
          // 缩放图片需要的canvas
          var canvas = document.createElement('canvas');
          var context = canvas.getContext('2d');
          var width = 1080; //图像大小
          var quality = 0.8; //图像质量

          img.onload = function (e) {
            // 图片原始尺寸
            var w = img.width;
            var h = img.height;
            if (w > 1080) {
              canvas.width = width;
              canvas.height = width * (h / w);
              // 在canvas绘制前填充白色背景  
              context.fillStyle = "#fff";
              context.fillRect(0, 0, canvas.width, canvas.height);
              context.lineTo(canvas.width, canvas.height);
              // 图片压缩
              context.drawImage(img, 0, 0, canvas.width, canvas.height);
              item.content = canvas.toDataURL("image/jpeg", quality);
              var blob = that.dataURItoBlob(canvas.toDataURL("image/jpeg", quality));
              item.type = blob.type;
              item.size = blob.size;
              item.name = file.file.name;
            } else {
              item.type = file.file.type;
              item.name = file.file.name;
              item.content = file.content;
              item.size = file.file.size;
            }

            that.fileList = that.fileList.concat(item)
          }
        } else {
          item.type = file.file.type;
          item.name = file.file.name;
          item.content = file.content;
          item.size = file.file.size;
          that.fileList = that.fileList.concat(item)
        }

      },
      //base64 转 blob 对象
      dataURItoBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], {
          type: mimeString
        });
      }
    },
    beforeRouteEnter(to, from, next) {
      if (from.meta.index == "1") {
        window.scrollTo(0, 0);
      }
      next();
    },
    deactivated() {
      this.actionShow = false;
    }
  }

  ;

</script>
<style>
  @import "../../../static/CSS/index.css";
  @import "../../../static/CSS/details.css";
  @import "../../../static/CSS/publish.css";

</style>
