<template>
  <div class="footer-mobile">
    <div class="footer-mobile__logo">
      <img src="@/assets/2026-meichu-prep-logo.svg" alt="丙午梅籌logo" />
    </div>

    <div class="footer-mobile__content">
      <div class="footer-mobile__section">
        <div class="section-title">
          <div class="section-title__zh">主辦校</div>
          <div class="section-title__zh">國立清華大學</div>
          <div class="section-title__en">National Tsing Hua University</div>
        </div>
        <div class="section-links">
          <a href="http://www.nthu.edu.tw/" target="_blank">
            <img src="@/assets/website-icon.svg" alt="icon"> 官方網站
          </a>
          <a href="https://www.facebook.com/nthu.tw/" target="_blank">
            <img src="@/assets/facebook.svg" alt="icon"> Facebook
          </a>
          <a href="http://dsa.site.nthu.edu.tw/" target="_blank">
            <img src="@/assets/website-icon.svg" alt="icon"> 課外活動組
          </a>
          <a href="https://nthupeo.site.nthu.edu.tw/" target="_blank">
            <img src="@/assets/website-icon.svg" alt="icon"> 體育室
          </a>
        </div>
      </div>

      <div class="footer-mobile__section">
        <div class="section-title">
          <div class="section-title__zh">協辦校</div>
          <div class="section-title__zh">國立陽明交通大學</div>
          <div class="section-title__en">National Yang Ming Chiao Tung University</div>
        </div>
        <div class="section-links">
          <a href="http://www.nycu.edu.tw/" target="_blank">
            <img src="@/assets/website-icon.svg" alt="icon"> 官方網站
          </a>
          <a href="https://www.facebook.com/YangMingChiaoTung/" target="_blank">
            <img src="@/assets/facebook.svg" alt="icon"> Facebook
          </a>
          <a href="https://osa.nycu.edu.tw/activity-ct" target="_blank">
            <img src="@/assets/website-icon.svg" alt="icon"> 課外輔導活動二組
          </a>
          <a href="https://peo.nycu.edu.tw/" target="_blank">
            <img src="@/assets/website-icon.svg" alt="icon"> 體育室
          </a>
        </div>
      </div>

      <div class="footer-mobile__section">
        <div class="section-title">
          <div class="section-title__zh">兩校</div>
          <div class="section-title__zh">後援組織</div>
          <div class="section-title__en">Fan Clubs</div>
        </div>
        <div class="section-links">
          <a href="https://www.instagram.com/nthu_meichu_working_group/" target="_blank">
            <img src="@/assets/instagram.svg" alt="icon"> 清大梅竹工作會
          </a>
          <a href="https://www.facebook.com/nycu.meichu" target="_blank">
            <img src="@/assets/facebook.svg" alt="icon"> 陽明交大梅竹後援會
          </a>
        </div>
      </div>

      <div class="footer-mobile__section">
        <div class="section-title">
          <div class="section-title__zh">兩校</div>
          <div class="section-title__zh">火力班</div>
          <div class="section-title__en">"Hou-Li" Groups</div>
        </div>
        <div class="section-links">
          <a href="https://www.instagram.com/nthuhou-li/" target="_blank">
            <img src="@/assets/instagram.svg" alt="icon"> 清大火力班
          </a>
          <a href="https://www.instagram.com/nycu_fireclass/" target="_blank">
            <img src="@/assets/instagram.svg" alt="icon"> 陽明交大火力班
          </a>
        </div>
      </div>
    </div>

    <div class="footer-mobile__copyright">
      <div>Copyright © 2026 丙午梅竹賽籌備委員會</div>
      <div>Designed by YuChi Huang. Built by <a href="https://github.com/Sean20405" target="_blank">Sean</a></div>
      <div class="prev-links">
        <a href="/2025/">乙巳梅竹</a>｜
        <a href="/2024/">甲辰梅竹</a>｜
        <a href="/2023/">癸卯梅竹</a>｜
        <a href="/2022/">壬寅梅竹</a>｜
        <a href="/2021/">辛丑梅竹</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MobileFooter'
}
</script>

<style scoped lang="scss">
.footer-mobile {
  display: block;
  background-color: #130f13;
  color: #fff;
  padding: 40px 10%;
  text-align: left;
  
  @media (min-width: $screen-md) {
    display: none;
  }

  &__logo {
    text-align: center;
    margin-bottom: 50px;
    img {
      width: 73%;
      max-width: 320px;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  &__section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 50px;

    .section-title {
      flex: 1;
      &__zh {
        font-size: 15px;
        font-weight: 700;
        line-height: 18px;
        letter-spacing: 1px;
        @media (max-width: $screen-sm) {
          font-size: 13px;
          line-height: 16px;
        }
      }
      &__en {
        margin-top: 8px;
        color: $primary;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 1px;
        line-height: 1;
        @media (max-width: $screen-sm) {
          font-size: 10px;
        }
      }
    }

    .section-links {
      flex: 0.8;
      display: flex;
      flex-direction: column;
      gap: 2px;
      a {
        color: #fff;
        text-decoration: none;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 1px;
        display: flex;
        align-items: flex-start;
        gap: 10px;
        img {
          width: 13px;
          height: 13px;
          margin-top: 3.5px;
        }
      }
      @media (max-width: $screen-sm) {
        flex: 1.2;
        font-size: 11px;
        img {
          width: 11px;
          height: 11px;
        }
      }
    }
  }

  &__copyright {
    margin-top: 50px;
    text-align: center;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.6;
    a {
      color: $primary;
      text-decoration: none;
    }
    .prev-links {
      margin-top: 10px;
      a {
        margin: 0 2px;
        color: $primary;
      }
    }
  }
}
</style>
