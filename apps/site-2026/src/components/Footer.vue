<template>
  <div class="footer">
    <div class="container">
      <div class="footer__logo">
        <img src="@/assets/2026-meichu-prep-logo.svg" alt="丙午梅籌logo"/>
      </div>
      <div class="row row-cols-2 row-cols-lg-4">
        <div class="col">
          <div class="footer-item">
            <div class="footer-item__title">
              <h4>主辦校<br/>國立清華大學</h4>
              <small>National Tsing Hua University</small>
              <hr>
            </div>
            <div class="footer-item__content">
              <a class="footer-item__link" target="_blank" href="http://www.nthu.edu.tw/"><img src="@/assets/website-icon.svg"> 官方網站</a>
              <a class="footer-item__link" target="_blank" href="https://www.facebook.com/nthu.tw/"><img src="@/assets/facebook.svg"> Facebook</a>
              <a class="footer-item__link" target="_blank" href="http://dsa.site.nthu.edu.tw/"><img src="@/assets/website-icon.svg"> 課外活動組</a>
              <a class="footer-item__link" target="_blank" href="https://nthupeo.site.nthu.edu.tw/"><img src="@/assets/website-icon.svg"> 體育室</a>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="footer-item">
            <div class="footer-item__title"> 
              <!-- to-do (exchange)-->
              <h4>協辦校<br/>國立陽明交通大學</h4>
              <small>National Yang Ming Chiao Tung University</small>
              <hr>
            </div>
            <div class="footer-item__content">
              <a class="footer-item__link" target="_blank" href="http://www.nycu.edu.tw/"><img src="@/assets/website-icon.svg">官方網站</a>
              <a class="footer-item__link" target="_blank" href="https://www.facebook.com/YangMingChiaoTung/"><img src="@/assets/facebook.svg">Facebook</a>
              <a class="footer-item__link" target="_blank" href="https://osa.nycu.edu.tw/activity-ct"><img src="@/assets/website-icon.svg">課外活動輔導二組</a>
              <a class="footer-item__link" target="_blank" href="https://peo.nycu.edu.tw/"><img src="@/assets/website-icon.svg"> 體育室</a>
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
              <a class="footer-item__link" target="_blank" href="https://castnet.nctu.edu.tw/"><img src="@/assets/website-icon.svg"> 喀報Castnet</a><br>
              <a class="footer-item__link" target="_blank" href="https://www.facebook.com/gotoandplay.nctu/"><img src="@/assets/facebook.svg"> goto&Play交大網路電台</a>
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
              <a class="footer-item__link" target="_blank" href="https://www.facebook.com/nycu.meichu"><img src="@/assets/facebook.svg"> 陽明交大梅竹後援會</a>
              <a class="footer-item__link" target="_blank" href="https://www.facebook.com/meichuwin/"><img src="@/assets/facebook.svg"> 清大梅竹工作會</a>
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
              <a class="footer-item__link" target="_blank" href="https://www.facebook.com/nctu.on.fire/"><img src="@/assets/facebook.svg"> 陽明交大火力班</a>
              <a class="footer-item__link" target="_blank" href="https://www.facebook.com/%E6%88%8A%E6%88%8C%E6%A2%85%E7%AB%B9%E7%81%AB%E5%8A%9B%E7%8F%AD-1571693219711454/"><img src="@/assets/facebook.svg"> 清大火力班</a>
            </div>
          </div>
        </div>
      </div>
      <div class="footer__copyright">
        Copyright © 2026 乙巳梅竹賽籌備委員會<br>
        Designed by YuChi Huang. Built by <a class="linked_font" target="_blank" href="https://github.com/Sean20405">Sean</a><br>
        <div class="prev-website">
          <a href="/2025/" class="linked_font">
            乙巳梅竹
          </a>｜
          <a href="/2024/" class="linked_font">
            甲辰梅竹
          </a>｜ 
          <a href="/2023/" class="linked_font">
            癸卯梅竹
          </a>｜ 
          <a href="/2022/" class="linked_font">
            壬寅梅竹
          </a>｜ 
          <a href="/2021/" class="linked_font">
            辛丑梅竹
          </a>｜ 
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.footer {
  text-align: center;
  font-size: .67rem;
  color: $text;
  margin-top: 0rem;
  padding: 3rem 0;
  position: relative;
  @media (max-width: $screen-md) {
    margin-left: 0;
    margin-top: 0rem;
  }
  .container{
    padding-left: 5vw;
    padding-right: 5vw;
    min-width: 90vw;
    @media (max-width: $screen-md) {
      .row {
        margin-left: 4vw;
        margin-right: -8vw;
      }
      .col {
        padding: 0 .5rem;
      }
    }
  }
  .footer__logo {
    margin: 1rem 0;
    display: flex;
    justify-content: center;
    img {
      width: 35%;
      @media (max-width: $screen-md) {
        width: 60%;
      }
    }
  }
  .footer-item {
    text-align: left;
    margin: 1rem 0;
    @media (max-width: $screen-lg) {
      margin: 2rem 0;
    }
    @media (max-width: $screen-md) {
      margin: 1.5rem 0;
      flex-wrap: wrap;
    }
    .footer-item__title {
      line-height: 17.5px;
      letter-spacing: 0.1em;
      font-weight: bold;
      h4 {
        font-weight: 700;
        font-size: 1rem;
        @media (max-width: $screen-md) {
          font-size: 1.2rem;
        }
      }
      .md-hidden {
        @media (max-width: $screen-lg) {
          display: none;
        }
      }
      .lg-hidden {
        @media (max-width: $screen-xl) {
          display: none;
        }
      }
      small{
        font-weight: bold;
        display: inline-block;
        height: 1.5rem;
        font-size: .625rem;
        color: $primary;
        vertical-align: bottom;
        @media (max-width: $screen-md) {
          font-size: .8rem;
        }
      }
      .sm-h-fit {
        @media (max-width: $screen-md) {
          height: fit-content; 
        }
      }
      hr {
        display: block;
        height: 3px;
        width: 100%;
        margin: .5rem 0;
        background-color: #D9D9D9;
        @media (max-width: $screen-md) {
          display: none;
        }
      }
    }
    .footer-item__content {
      border-top: 1.5px solid $background-lighter;
    }
    .footer-item__link {
      display: flex;
      color: $white;
      margin-right: .5rem;
      margin-bottom: .25rem;
      align-items: center;
      font-weight: 500;
      letter-spacing: 0.1em;
      gap: .35rem;
      &:hover {
        text-decoration: none;
        color: $linked_text;
      }
      img {
        display: inline-block;  
        height: 16px;
        margin-right: .25rem;
      }
      @media (max-width: $screen-md) {
        font-size: .8rem;
      }
    }
  }
  .footer__copyright {
    margin: 1rem 0;
    color: $text;
    font-weight: 500;
    font-size: .75rem;
    line-height: 1rem;
    z-index: 2;
    position: relative;
    margin: 1rem 0;
    .prev-website {
      margin-top: .5rem;
    }
    @media (max-width: $screen-md) {
      font-size: .8rem;
    }
  }
}
</style>