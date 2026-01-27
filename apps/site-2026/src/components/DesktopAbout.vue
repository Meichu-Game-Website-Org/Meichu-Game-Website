<template>
  <div class="desktop-about">
    <div class="about-section">
      <div class="about-title">
        <img src="@/assets/about-basketball-desktop.png" alt="Basketball Panda">
      </div>
      <div class="about-content" :style="{ '--clip-path': 'polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)' }">
        <Loading v-if="isLoading"></Loading>
        <p v-else>{{options['about-meichu']}}</p>
      </div>
    </div>
    <div class="about-section">
      <div class="about-content" :style="{ '--clip-path': 'polygon(0 0, 100% 0, 100% 100%, 15% 100%, 0 85%)' }">
        <Loading v-if="isLoading"></Loading>
        <p v-else>{{options['meichu-history']}}</p>
      </div>
      <div class="about-title">
        <img src="@/assets/about-badminton-desktop.png" alt="Badminton Fox">
      </div>
    </div>
    <div class="about-section" :style="{'gap': '16px', 'justify-content': 'left'}">
      <div class="hazard-line"></div>
      <div class="hazard-line"></div>
      <div class="org">
        <div class="org-section">
          <div class="org-img">
            <div class="org-title">
              <img src="@/assets/about-purple-cross.png" alt="Purple">
              <div>相關單位</div>
            </div>
            <img src="@/assets/about-org.png" alt="2026 Meichu">
          </div>
          <div class="org-content">
            <div class="name-zh">主辦單位 / 梅竹籌備委員會</div>
            <div class="name-en">Organizer / Meichu Game Preparatory Committee</div>
            <div class="org-content__link">
              <div class="hazard-line"></div>
              <div class="desc">
                <div>由兩校學生所組成，負責梅竹賽事之籌辦。</div>
                <a href="https://meichu.games/">
                  <img src="@/assets/website-icon.svg" alt="icon">
                  官方網站
                </a>
                <a href="https://www.facebook.com/MeiChuGamePreparatoryCommittee/">
                  <img src="@/assets/facebook.svg" alt="icon">
                  Facebook
                </a>
                <a href="https://www.instagram.com/meichu_prep_cmte/">
                  <img src="@/assets/instagram.svg" alt="icon">
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="org-section">
          <div class="org-content">
            <div class="name-zh">主辦校 / 國立陽明交通大學</div>
            <div class="name-en">Host / National Yang Ming Chiao Tung University</div>
            <div class="org-content__link">
              <div class="hazard-line"></div>
              <div class="desc">
                <div>主辦學校為桌球、排球、羽球等賽事之主場。</div>
                <div class="links">
                  <div>
                    <a href="http://www.nycu.edu.tw/">
                      <img src="@/assets/website-icon.svg" alt="icon">
                      官方網站
                    </a>
                    <a href="https://www.facebook.com/YangMingChiaoTung/">
                      <img src="@/assets/facebook.svg" alt="icon">
                      Facebook
                    </a>
                  </div>
                  <div>
                    <a href="https://osa.nycu.edu.tw/activity-ct/">
                      <img src="@/assets/website-icon.svg" alt="icon">
                      課外活動輔導二組
                    </a>
                    <a href="https://peo.nycu.edu.tw/">
                      <img src="@/assets/website-icon.svg" alt="icon">
                      體育室
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="org-img">
            <img src="@/assets/about-volleyball-fox.png" alt="Volleyball Fox">
          </div>
        </div>
        <div class="org-section">
          <div class="org-img">
            <img src="@/assets/about-volleyball-panda.png" alt="Volleyball Panda">
          </div>
          <div class="org-content">
            <div class="name-zh">協辦校 / 國立清華大學</div>
            <div class="name-en">Co-host / National Tsing Hua University</div>
            <div class="org-content__link">
              <div class="hazard-line"></div>
              <div class="desc">
                <div>協辦學校為籃球、網球、象棋等賽事之主場。</div>
                <div class="links">
                  <div>
                    <a href="http://www.nthu.edu.tw/">
                      <img src="@/assets/website-icon.svg" alt="icon">
                      官方網站
                    </a>
                    <a href="https://www.facebook.com/nthu.tw/">
                      <img src="@/assets/facebook.svg" alt="icon">
                      Facebook
                    </a>
                  </div>
                  <div>
                    <a href="http://dsa.site.nthu.edu.tw/">
                      <img src="@/assets/website-icon.svg" alt="icon">
                      課外活動組
                    </a>
                    <a href="https://nthupeo.site.nthu.edu.tw/">
                      <img src="@/assets/website-icon.svg" alt="icon">
                      體育室
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="org-section">
          <div class="org-content">
            <div class="name-zh">兩校後援組織</div>
            <div class="name-en">Fan Clubs</div>
            <div class="org-content__link">
              <div class="hazard-line"></div>
              <div class="desc">
                <div>賽前造勢活動、電競賽等皆由後援組織所負責</div>
                <div>
                  <a href="https://www.facebook.com/nycu.meichu/">
                    <img src="@/assets/facebook.svg" alt="icon">
                    陽明交大梅竹後援會
                  </a>
                  <a href="https://www.facebook.com/meichuwin/">
                    <img src="@/assets/facebook.svg" alt="icon">
                    清大梅竹工作會
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="org-content" :style="{ 'text-align': 'end' }">
            <div class="name-zh">兩校火力班</div>
            <div class="name-en">" Huo-Li " Groups</div>
            <div class="org-content__link" :style="{ 'justify-content': 'end' }">
              <div class="desc">
                <div>在比賽現場帶動觀眾，一起為選手及學校加油</div>
                <div>
                  <a href="https://www.facebook.com/nctu.on.fire/">
                    陽明交大火力班
                    <img src="@/assets/facebook.svg" alt="icon">
                  </a>
                  <a href="https://www.facebook.com/%E6%88%8A%E6%88%8C%E6%A2%85%E7%AB%B9%E7%81%AB%E5%8A%9B%E7%8F%AD-1571693219711454/">
                    清大火力班
                    <img src="@/assets/facebook.svg" alt="icon">
                  </a>
                </div>
              </div>
              <div class="hazard-line"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Option as OptionApi } from '@meichu/services'
import Loading from '@/components/Loading.vue'

export default {
  name: 'about',

  components: {
    Loading
  },

  metaInfo: {
    title: '關於梅竹',
    titleTemplate: '%s | 乙巳梅竹',
  },

  data() {
    return {
      isLoading: true,
    }
  },

  created() {
    this.fetch()
  },

  methods: {
    fetch() {
      const params = {
        data: ['about-meichu', 'meichu-history'],
        year_id: 57
      }
      OptionApi.fetchOptions(params).then((data) => {
        this.options = Object.assign({}, ...data.options.map(option => ({
          [option.key]: option.value
        })))
      })
      .then(() => {
        this.isLoading = false;
      })
    }
  }
}
</script>

<style>

</style>