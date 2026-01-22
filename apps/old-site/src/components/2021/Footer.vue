<template>
  <div class="footer">
    <div class="container">
      <div class="row">
        <div class="col-12 col-sm-6 col-lg">
          <div class="footer-item">
            <div class="footer-item__title">
              <h4>主辦校 / 國立陽明交通大學</h4>
              <small>National Yang Ming Chiao Tung University</small>
            </div>
            <div class="footer-item__content">
              <a class="footer-item__link" target="_blank" href="http://www.nycu.edu.tw/"><i class="fas fa-globe-asia"></i> 官方網站</a><br>
              <a class="footer-item__link" target="_blank" href="https://www.facebook.com/YangMingChiaoTung/"><i class="fab fa-facebook"></i> Facebook</a><br>
              <a class="footer-item__link" target="_blank" href="https://activity.sa.nctu.edu.tw/"><i class="fas fa-globe-asia"></i> 課外活動組</a><br>
              <a class="footer-item__link" target="_blank" href="https://sport.sa.nctu.edu.tw/"><i class="fas fa-globe-asia"></i> 體育室</a>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg">
          <div class="footer-item">
            <div class="footer-item__title">
              <h4>協辦校 / 國立清華大學</h4>
              <small>National Tsing Hua University</small>
            </div>
            <div class="footer-item__content">
              <a class="footer-item__link" target="_blank" href="http://www.nthu.edu.tw/"><i class="fas fa-globe-asia"></i> 官方網站</a><br>
              <a class="footer-item__link" target="_blank" href="https://www.facebook.com/nthu.tw/"><i class="fab fa-facebook"></i> Facebook</a><br>
              <a class="footer-item__link" target="_blank" href="http://dsa.site.nthu.edu.tw/"><i class="fas fa-globe-asia"></i> 課外活動組</a><br>
              <a class="footer-item__link" target="_blank" href="http://peo.nthu.edu.tw/"><i class="fas fa-globe-asia"></i> 體育室</a>
            </div>
          </div>
        </div>
        
        <div class="col-12 col-sm-6 col-lg">
          <div class="footer-item">
            <div class="footer-item__title">
              <h4>賽事媒體</h4>
              <small>Media</small>
            </div>
            <div class="footer-item__content">
              <a class="footer-item__link" target="_blank" href="https://castnet.nctu.edu.tw/"><i class="fas fa-globe-asia"></i> 喀報Castnet</a><br>
              <a class="footer-item__link" target="_blank" href="https://www.facebook.com/NTHUTsing/"><i class="fab fa-facebook"></i> 清一下。影音新聞</a><br>
              <a class="footer-item__link" target="_blank" href="https://www.facebook.com/gotoandplay.nctu/"><i class="fab fa-facebook"></i> goto&Play交大網路電台</a>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg">
          <div class="footer-item">
            <div class="footer-item__title">
              <h4>兩校後援組織</h4>
              <small>Fan Clubs</small>
            </div>
            <div class="footer-item__content">
              <a class="footer-item__link" target="_blank" href="https://www.facebook.com/nctu.meichu/"><i class="fab fa-facebook"></i> 陽明交大梅竹後援會</a><br>
              <a class="footer-item__link" target="_blank" href="https://www.facebook.com/meichuwin/"><i class="fab fa-facebook"></i> 清大梅竹工作會</a>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg">
          <div class="footer-item">
            <div class="footer-item__title">
              <h4>兩校火力班</h4>
              <small>"Huo-Li" Groups</small>
            </div>
            <div class="footer-item__content">
              <a class="footer-item__link" target="_blank" href="https://www.facebook.com/nctu.on.fire/"><i class="fab fa-facebook"></i> 陽明交大火力班</a><br>
              <a class="footer-item__link" target="_blank" href="https://www.facebook.com/%E6%88%8A%E6%88%8C%E6%A2%85%E7%AB%B9%E7%81%AB%E5%8A%9B%E7%8F%AD-1571693219711454/"><i class="fab fa-facebook"></i> 清大火力班</a>
            </div>
          </div>
        </div>
      </div>
      <p class="footer__copyright">
        Copyright © 2021 辛丑梅竹賽籌備委員會<br>
        <router-link :to="{name: 'index-2022'}">
          壬寅梅竹
        </router-link>,
        <router-link :to="{name: 'index-2021'}">
          辛丑梅竹
        </router-link>, 
        <router-link :to="{name: 'index-2020'}">
          庚子梅竹
        </router-link>, 
        <router-link :to="{name: 'index'}">
          己亥梅竹
        </router-link>
      </p>
    </div>
  </div>
</template>