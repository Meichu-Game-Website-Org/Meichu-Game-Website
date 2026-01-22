<template>
  <div class="footer">
    <!-- <div class="footer_back">
      <img src="@/assets/2022/背景2_素材.svg" class="banner__image" alt="" />
    </div> -->
    <div class="container">
      <div class="footer__logo">
        <img src="@/assets/2025/2025-meichu-prep-logo.png" alt="乙巳梅籌logo"/>
      </div>
      <div class="row row-cols-2 row-cols-lg-4">
        <div class="col">
          <div class="footer-item">
            <div class="footer-item__title"> 
              <!-- to-do (exchange)-->
              <h4>主辦校<br/>國立陽明交通大學</h4>
              <small>National Yang Ming Chiao Tung University</small>
              <hr>
            </div>
            <div class="footer-item__content">
              <a class="footer-item__link" target="_blank" href="http://www.nycu.edu.tw/"><img src="@/assets/2025/compass.svg">官方網站</a>
              <a class="footer-item__link" target="_blank" href="https://www.facebook.com/YangMingChiaoTung/"><img src="@/assets/2025/facebook.svg">Facebook</a>
              <a class="footer-item__link" target="_blank" href="https://osa.nycu.edu.tw/activity-ct"><img src="@/assets/2025/compass.svg">課外活動輔導二組</a>
              <a class="footer-item__link" target="_blank" href="https://peo.nycu.edu.tw/"><img src="@/assets/2025/compass.svg"> 體育室</a>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="footer-item">
            <div class="footer-item__title">
              <h4>協辦校<br/>國立清華大學</h4>
              <small>National Tsing Hua University</small>
              <hr>
            </div>
            <div class="footer-item__content">
              <a class="footer-item__link" target="_blank" href="http://www.nthu.edu.tw/"><img src="@/assets/2025/compass.svg"> 官方網站</a>
              <a class="footer-item__link" target="_blank" href="https://www.facebook.com/nthu.tw/"><img src="@/assets/2025/facebook.svg"> Facebook</a>
              <a class="footer-item__link" target="_blank" href="http://dsa.site.nthu.edu.tw/"><img src="@/assets/2025/compass.svg"> 課外活動組</a>
              <a class="footer-item__link" target="_blank" href="https://nthupeo.site.nthu.edu.tw/"><img src="@/assets/2025/compass.svg"> 體育室</a>
            </div>
          </div>
        </div>
        
        <!-- <div class="col">
          <div class="footer-item">
            <div class="footer-item__title">
              <h4 >賽事媒體<br/>&nbsp;</h4>
              <small class="english ">Media<br/>&nbsp;</small>
            </div>
            <div class="footer-item__content">
              <a class="footer-item__link" target="_blank" href="https://castnet.nctu.edu.tw/"><img src="@/assets/2025/compass.svg"> 喀報Castnet</a><br>
              <a class="footer-item__link" target="_blank" href="https://www.facebook.com/gotoandplay.nctu/"><img src="@/assets/2025/facebook.svg"> goto&Play交大網路電台</a>
            </div>
          </div>
        </div> -->
        <div class="col">
          <div class="footer-item">
            <div class="footer-item__title">
              <h4>兩校<br class="md-hidden"/>後援組織</h4>
              <small class="sm-h-fit">Fan Clubs</small>
              <hr>
            </div>
            <div class="footer-item__content">
              <a class="footer-item__link" target="_blank" href="https://www.facebook.com/nycu.meichu"><img src="@/assets/2025/facebook.svg"> 陽明交大梅竹後援會</a>
              <a class="footer-item__link" target="_blank" href="https://www.facebook.com/meichuwin/"><img src="@/assets/2025/facebook.svg"> 清大梅竹工作會</a>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="footer-item">
            <div class="footer-item__title">
              <h4>兩校<br class="md-hidden"/>火力班</h4>
              <small class="sm-h-fit">"Huo-Li" Groups</small>
              <hr>
            </div>
            <div class="footer-item__content">
              <a class="footer-item__link white_font" target="_blank" href="https://www.facebook.com/nctu.on.fire/"><img src="@/assets/2025/facebook.svg"> 陽明交大火力班</a>
              <a class="footer-item__link white_font" target="_blank" href="https://www.facebook.com/%E6%88%8A%E6%88%8C%E6%A2%85%E7%AB%B9%E7%81%AB%E5%8A%9B%E7%8F%AD-1571693219711454/"><img src="@/assets/2025/facebook.svg"> 清大火力班</a>
            </div>
          </div>
        </div>
      </div>
      <div class="footer__copyright">
        Copyright © 2025 乙巳梅竹賽籌備委員會<br>
        Designed by <a class="linked_font" target="_blank" href="https://iamannsu.wixsite.com/my-site">EnYi</a>. Built by <a class="linked_font" target="_blank" href="https://github.com/Sean20405">Sean</a><br>
        <div class="prev-website">
          <router-link :to="{name: 'index-2024'}" class="linked_font">
            甲辰梅竹
          </router-link>&nbsp;·&nbsp;
          <router-link :to="{name: 'index-2023'}" class="linked_font">
            癸卯梅竹
          </router-link>&nbsp;·&nbsp;
          <router-link :to="{name: 'index-2022'}" class="linked_font">
            壬寅梅竹
          </router-link>&nbsp;·&nbsp;
          <router-link :to="{name: 'index-2021'}" class="linked_font">
            辛丑梅竹
          </router-link>&nbsp;·&nbsp;
          <router-link :to="{name: 'index-2020'}" class="linked_font">
            庚子梅竹
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>