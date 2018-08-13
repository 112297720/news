<template>

  <div>
    <div v-show="uploading" class="loading">
      <van-loading color="white" size='1rem' />
      <p class="topmsg">请稍等,正在上传({{filenum}}/{{total}})…</p>
    </div>
    <div class='searchBox'>悦生活
      <img src="../../../static/images/search.png" class="searchBtn">
    </div>
    <div class="remind">
      <van-popup v-model="show" position="top" :overlay="false">{{pMsg}}</van-popup>
    </div>

    <div class="demo-uploader-container">
      <van-button type="danger" @click="subClick()" size="large">提交上传</van-button>
    </div>
    <div class="preview">
      <van-row gutter="10">
        <div v-if="imgFiles.length!=0" v-for="(item, index) in imgFiles" :key="index">
          <van-col class="imgCol" span="8">
            <van-icon class="itemClear" name="clear" @click="clearItem(index,item.type)" />
            <img @click="showImg(item.content)" class="imgView" :src="item.content">
          </van-col>
        </div>
        <div v-if="videoFiles.length!=0" v-for="(item,index) in videoFiles" :key="index">
          <van-col class="imgCol" span="24">
            <van-icon class="itemClear" name="clear" @click="clearItem(index,item.file.type)" />
            <div class="videoName">{{item.file.name}}</div>
            <img class="videoBg" />
            <!-- <video class="videoView" controlsList="nodownload" controls="controls" v-if="item.type.indexOf('video')!=-1" :src="item.content"></video> -->
          </van-col>
        </div>
        <van-uploader class="uploader" accept="image/*, audio/*,video/*" multiple :max-size="100*1024*1024" @oversize="logContent"
          :after-read="affterRead()">
          <van-col class="subCol">
            <img class="imgView" src="../../../static/images/sc.png">
          </van-col>
        </van-uploader>
      </van-row>
    </div>
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
    ImagePreview,
    List
  }

  from "vant";
  export default {
    data() {
      return {
        imgFiles: [], //上传图片列表数据
        videoFiles: [], //上传视频列表数据
        page: 0, //列表刷新次数
        filetype: ['image', 'audio', 'video'], //文件类型
        show: false, //弹出层显示or隐藏
        pMsg: '', //弹出层信息
        uploading: false, //上传等待弹出层
        filenum: 0, //上传文件剩余数量
        total: 0, //上传文件总数量
        loading: false,
        finished: false,
        isLoading: false //下拉刷新
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
      [ImagePreview.name]: ImagePreview,
      [List.name]: List
    },
    created() {
      
    },
    mounted() {},
    methods: {
      goPage(article_id) {
        this.$router.push({
          path: "/details",
          query: {
            id: article_id,
            type: "news"
          }
        });
      },
      onRefresh() {},
      getList(id) {},
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
      //提交上传
      subClick() {
        this.filenum = 0;
        if (this.imgFiles.length != 0) {
          this.total = this.imgFiles.length;
          this.uploading = true;

          for (let i = 0; i < this.imgFiles.length; i++) {
            this.axios.post(
                "http://10.81.108.54:8080/api/file/uploadFile", qs.stringify({
                  fileBase64Code: this.imgFiles[i].content.split(',')[1],
                  fileType: this.imgFiles[i].type,
                  fileName: this.imgFiles[i].name,
                  size: this.imgFiles[i].size
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
                  this.imgFiles.splice(this.imgFiles.indexOf(this.imgFiles[i]), 1);
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
      showImg(img) {
        const instance = ImagePreview([img])
      },
      clearItem(i, type) {
        if (type.indexOf('image') == 0) {
          this.imgFiles.splice(i, 1);
        }
        if (type.indexOf('video') == 0) {
          this.videoFiles.splice(i, 1);
        }

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

            that.imgFiles = that.imgFiles.concat(item)
          }
        } else {
          that.videoFiles = that.videoFiles.concat(file)
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
    }
  }

  ;

</script>
<style>
  @import "../../../static/CSS/index.css";
  @import "../../../static/CSS/publish.css";

</style>
