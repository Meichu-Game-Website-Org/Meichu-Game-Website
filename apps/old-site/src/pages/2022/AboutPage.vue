<template>
  <div class="about-page" id="about">
    <div class="news_list_page_back_box">
      <img src="@/assets/2022/背景2_素材.svg" class="news_list_page_back" alt="" />
    </div>

      <img src="@/assets/2022/logo_nobackground.svg" class="about_icon" alt="" />

    <div class="row">
      <div class="col margin-new">
        <h2 class="about-title">
          <span class="message_title">壬寅梅竹</span><img src="@/assets/2022/梅竹_圈-素材.svg" slot="title_circle_behind" class="title_circle_behind" alt="" />
        </h2>
        <div class="pre-text">{{options['about-meichu']}}</div>

        <h2 class="about-title">
          <span class="message_title">梅竹賽歷史</span><img src="@/assets/2022/梅竹_圈-素材.svg" slot="title_circle_behind" class="title_circle_behind" alt="" />
        </h2>
        <div class="pre-text">{{options['meichu-history']}}</div>

        <h2 class="about-title">
          <span class="message_title">相關單位</span><img src="@/assets/2022/梅竹_圈-素材.svg" slot="title_circle_behind" class="title_circle_behind" alt="" />
        </h2>
        <div class="org_box">
        <div class="org-item">
          <div class="org-item__title">
            <h4 class="org-chinese_font">主辦單位 / 梅竹賽籌備委員會</h4>
            <small>Organizer / Meichu Game Preparatory Committee</small>
          </div>
          <div class="org-item__content">
            由兩校學生所組成，負責梅竹賽事之籌辦。<br>
            <a class="org-item__link" target="_blank" href="https://www.facebook.com/MeiChuGamePreparatoryCommittee/"><i class="fab fa-facebook"></i> Facebook</a>
            <a class="org-item__link" target="_blank" href="https://www.instagram.com/meichu_prep_cmte/"><i class="fab fa-instagram"></i> Instagram</a>
            <a class="org-item__link" target="_blank" href="https://meichu.games/"><i class="fas fa-globe-asia"></i> 官方網站</a>
          </div>
        </div>
        <div class="org-item">
          <div class="org-item__title">
            <h4 class="org-chinese_font">主辦校 / 國立清華大學</h4>
            <small>National Tsing Hua University</small>
          </div>
          <div class="org-item__content">
            主辦學校為橋藝、撞球、飛鏢、射箭等賽事之主場。<br>
            <a class="org-item__link" target="_blank" href="http://www.nthu.edu.tw/"><i class="fas fa-globe-asia"></i> 官方網站</a>
            <a class="org-item__link" target="_blank" href="https://www.facebook.com/nthu.tw/"><i class="fab fa-facebook"></i> Facebook</a>
            <a class="org-item__link" target="_blank" href="http://dsa.site.nthu.edu.tw/"><i class="fas fa-globe-asia"></i> 課外活動組</a>
            <a class="org-item__link" target="_blank" href="http://peo.nthu.edu.tw/"><i class="fas fa-globe-asia"></i> 體育室</a>
          </div>
        </div>
        <div class="org-item">
          <div class="org-item__title">
            <h4 class="org-chinese_font">協辦校 / 國立陽明交通大學</h4>
            <small >National Yang Ming Chiao Tung University</small>
          </div>
          <div class="org-item__content">
            協辦學校為男籃、圍棋、劍道、壘球等賽事之主場。<br>
            <a class="org-item__link" target="_blank" href="http://www.nycu.edu.tw/"><i class="fas fa-globe-asia"></i> 官方網站</a>
            <a class="org-item__link" target="_blank" href="https://www.facebook.com/YangMingChiaoTung/"><i class="fab fa-facebook"></i> Facebook</a>
            <a class="org-item__link" target="_blank" href="https://activity.sa.nctu.edu.tw/"><i class="fas fa-globe-asia"></i> 課外活動指導組</a>
            <a class="org-item__link" target="_blank" href="https://sport.sa.nctu.edu.tw/"><i class="fas fa-globe-asia"></i> 體育室</a>
          </div>
        </div>
        <div class="org-item">
          <div class="org-item__title">
            <h4 class="org-chinese_font">兩校後援組織</h4>
            <small >Fan Clubs</small>
          </div>
          <div class="org-item__content">
            賽前造勢活動、電競賽、兩校各自賽事紀念品等皆由後援組織所負責。<br>
            <a class="org-item__link" target="_blank" href="https://www.facebook.com/nctu.meichu/"><i class="fab fa-facebook"></i> 陽明交大梅竹後援會</a>
            <a class="org-item__link" target="_blank" href="https://www.facebook.com/meichuwin/"><i class="fab fa-facebook"></i> 清大梅竹工作會</a>
          </div>
        </div>
        <div class="org-item">
          <div class="org-item__title">
            <h4 class="org-chinese_font">兩校火力班</h4>
            <small >"Huo-Li" Groups</small>
          </div>
          <div class="org-item__content">
            在比賽現場帶動觀眾，一起為選手及學校加油。<br>
            <a class="org-item__link" target="_blank" href="https://www.facebook.com/nctu.on.fire/"><i class="fab fa-facebook"></i> 陽明交大火力班</a>
            <a class="org-item__link" target="_blank" href="https://www.facebook.com/%E6%88%8A%E6%88%8C%E6%A2%85%E7%AB%B9%E7%81%AB%E5%8A%9B%E7%8F%AD-1571693219711454/"><i class="fab fa-facebook"></i> 清大火力班</a>
          </div>
        </div>
        <div class="org-item">
          <div class="org-item__title">
            <h4 class="org-chinese_font">賽事媒體</h4>
            <small>Media</small>
          </div>
          <div class="org-item__content">
            提供轉播服務以及賽後回顧、賽事戰況的相關新聞。<br>
            <a class="org-item__link" target="_blank" href="https://www.facebook.com/gotoandplay.nctu/"><i class="fab fa-facebook"></i> goto&Play交大網路電台</a>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { Option as OptionApi } from '@meichu/services'

export default {
  name: 'about',

  metaInfo: {
    title: '關於梅竹',
    titleTemplate: '%s | 壬寅梅竹',
  },

  data: function() {
    return {
      options: {}
    }
  },

  created() {
    this.fetch()
  },

  methods: {
    fetch() {
      const params = {
        data: ['about-meichu', 'meichu-history'],
        year_id: 54
      }
      OptionApi.fetchOptions(params).then((data) => {
        this.options = Object.assign({}, ...data.options.map(option => ({
          [option.key]: option.value
        })))
      })
    }
  }
}

</script>