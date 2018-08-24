<template>

  <div id="app" :class="[isIos ? 'xn-ios':'']">
    <!-- <transition :name="transitionName"> -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive">
      </router-view>
    </keep-alive>
    <!-- </transition> -->
    <transition :name="transitionName">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>

    <div class="right-return-top">
      <transition name="van-slide-bottom">
        <div class="return-top" @click="returnTop" v-show="topShow">
          <img src="../static/images/return_top.png">
        </div>
      </transition>
    </div>
    <audio style="display: none" id="beep" :src="beep" preload="auto">
    </audio>
    <div class="tabbar" v-show="isShow">
      <van-tabbar v-model="actives" @change="onChange">
        <van-tabbar-item to="index">
          <span>新闻</span>
          <template slot="icon" slot-scope="props">
            <img :src="props.active ? icon.active1 : icon.normal1" />
          </template>
        </van-tabbar-item>
        <van-tabbar-item to="paper">
          <span>读报</span>
          <template slot="icon" slot-scope="props">
            <img :src="props.active ? icon.active2 : icon.normal2" />
          </template>
        </van-tabbar-item>
        <van-tabbar-item to="videoNews">
          <span>视频</span>
          <template slot="icon" slot-scope="props">
            <img :src="props.active ? icon.active3 : icon.normal3" />
          </template>
        </van-tabbar-item>
        <van-tabbar-item to="happyLife">
          <span>悦生活</span>
          <template slot="icon" slot-scope="props">
            <img :src="props.active ? icon.active4 : icon.normal4" />
          </template>
        </van-tabbar-item>
        <van-tabbar-item>
          <span>我的</span>
          <template slot="icon" slot-scope="props">
            <img :src="props.active ? icon.active5 : icon.normal5" />
          </template>
        </van-tabbar-item>
      </van-tabbar>
    </div>
  </div>

</template>


<script>
  import {
    Tabbar,
    TabbarItem,
    Toast
  } from "vant";
  export default {
    data() {
      return {
        isIos: false,
        isShow: false,
        scroll: 0,
        topShow: false,
        transitionName: "",
        icon: {
          normal1: require("../static/images/new.png"),
          active1: require("../static/images/new_active.png"),
          normal2: require("../static/images/paper.png"),
          active2: require("../static/images/paper_active.png"),
          normal3: require("../static/images/video.png"),
          active3: require("../static/images/video_active.png"),
          normal4: require("../static/images/life.png"),
          active4: require("../static/images/life_active.png"),
          normal5: require("../static/images/my.png"),
          active5: require("../static/images/my_active.png")
        },
        beep: require("../static/css/beep.mp3"),
        actives: 0
      };
    },
    components: {
      [Tabbar.name]: Tabbar,
      [TabbarItem.name]: TabbarItem,
      [Toast.name]: Toast
    },

    created() {

    },
    updated() {
      setTimeout(() => {
        Toast.clear();
      }, 1000);
    },
    mounted() {
      this.getDevice();
      // history.pushState(null, null, document.title);
      // window.addEventListener('popstate', function () {
      //   history.pushState(null, null, document.title);
      // });
      window.onpopstate = () => {
        window.history.go(1)
      }
      window.addEventListener('scroll', this.handleScroll);
    },
    methods: {
      onChange(active) {
        document.getElementById('beep').play();
      },
      returnTop() {
        // window.scroll(0,0);
        let back = setInterval(() => {
          if (document.body.scrollTop || document.documentElement.scrollTop) {
            document.body.scrollTop -= 100;
            document.documentElement.scrollTop -= 100;
          } else {
            clearInterval(back)
          }
        });
      },
      handleScroll() {
        this.scroll =
          document.documentElement &&
          document.documentElement.scrollTop + document.body.scrollTop;
        if (this.scroll > window.innerHeight / 2) {
          this.topShow = true;
        } else {
          this.topShow = false;
        }

      },
      getDevice() {
        if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
          this.isIos = true;
        }
      }
    },
    watch: {
      //使用watch 监听$router的变化
      $route(to, from) {
        if (to.name == "details") {
          this.isShow = false;
        }
        if (to.name == "uploadImg") {
          this.isShow = false;
        }
        if (to.name == "index") {
          this.isShow = true;
          this.actives = 0;
        }
        if (to.name == "paper") {
          this.isShow = true;
          this.actives = 1;
        }
        if (to.name == "videoNews") {
          this.isShow = true;
          this.actives = 2;
        }
        if (to.name == "happyLife") {
          this.isShow = true;
          this.actives = 3;
        }
        // this.transitionName = 'van-fade';
        // if (from.meta.index == null) {
        //   console.log('null'+from.meta.index)

        // }else{
        //   console.log(from.meta.index)

        // }
        // if (to.meta.index < from.meta.index) {

        // } else {

        // }
        Toast({
          type: 'loading',
          mask: true,
          loadingType: 'spinner',
          message: '加载中...',
          duration: 0
        });
      }
    }
  };

</script>
