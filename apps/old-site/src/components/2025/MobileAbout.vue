<template>
  <div class="mobile-about">
    <div class="circle">
      <img src="@/assets/2025/about-circle.png" alt="Circle">
    </div>
    <h1>關於</h1>
    <div class="title_bar"/>

    <div class="about-section">
      <div class="about-title">
        <div class="line-container">
          <div class="hazard-line"></div>
          <div class="hazard-line"></div>
        </div>
        <div class="about-title__content">
          <div>乙巳<br>梅竹</div>
        </div>
        <img src="@/assets/2025/about-basketball.png" alt="Basketball Panda">
      </div>
      <div class="about-content break-line">
        <Loading v-if="isLoading"/>
        <p v-else>{{options['about-meichu']}}</p>
      </div>
    </div>
    <div class="about-section">
      <div class="about-title">
        <img src="@/assets/2025/about-badminton.png" alt="Badminton Fox">
        <div class="about-title__content">
          <div>梅竹<br>歷史</div>
        </div>
        <div class="line-container">
          <div class="hazard-line"></div>
          <div class="hazard-line"></div>
        </div>
      </div>
      <div class="about-content break-line">
        <Loading v-if="isLoading"/>
        <p v-else>{{options['meichu-history']}}</p>
      </div>
    </div>
    <div class="about-section">
      <div class="about-title">
        <div class="line-container">
          <div class="hazard-line"></div>
          <div class="hazard-line"></div>
        </div>
        <div class="about-title__content">
          <div>相關<br>單位</div>
        </div>
        <div class="img-container">
          <img src="@/assets/2025/about-fox.png" alt="Fox">
          <img src="@/assets/2025/about-panda.png" alt="Panda">
        </div>
      </div>
      <div class="about-content">
        <OrgCard
          v-for="org in organizations" :key="org.nameEn"
          :nameZh="org.nameZh"
          :nameEn="org.nameEn"
          :desc="org.desc"
          :links="org.links"></OrgCard>
      </div>
    </div>
  </div>
</template>

<script>
import { Option as OptionApi } from '@meichu/services'
import OrgCard from '@/components/2025/OrgCard'
import Loading from '@/components/2025/Loading.vue'

export default {
  name: 'about',

  components: {
    OrgCard,
    Loading
  },

  metaInfo: {
    title: '關於梅竹',
    titleTemplate: '%s | 乙巳梅竹',
  },

  data: function() {
    return {
      options: {},
      isLoading: true,
      organizations: [
        {
          nameZh: '主辦單位 / 梅竹籌備委員會',
          nameEn: 'Organizer / Meichu Game Preparatory Committee',
          desc: '由兩校學生所組成，負責梅竹賽事之籌辦。',
          links: [
            {
              link: 'https://meichu.games/',
              text: '官方網站',
              type: 'website'
            },
            {
              link: 'https://www.facebook.com/MeiChuGamePreparatoryCommittee/',
              text: 'Facebook',
              type: 'facebook'
            },
            {
              link: 'https://www.instagram.com/meichu_prep_cmte/',
              text: 'Instagram',
              type: 'instagram'
            }
          ]
        },
        {
          nameZh: '主辦校 / 國立陽明交通大學',
          nameEn: 'Host / National Yang Ming Chiao Tung University',
          desc: '主辦學校為桌球、排球、羽球等賽事之主場。',
          links: [
            {
              link: 'http://www.nycu.edu.tw/',
              text: '官方網站',
              type: 'website'
            },
            {
              link: 'https://www.facebook.com/YangMingChiaoTung/',
              text: 'Facebook',
              type: 'facebook'
            },
            {
              link: 'https://osa.nycu.edu.tw/activity-ct/',
              text: '課外活動輔導二組',
              type: 'website'
            },
            {
              link: 'https://peo.nycu.edu.tw/',
              text: '體育室',
              type: 'website'
            }
          ]
        },
        {
          nameZh: '協辦校 / 國立清華大學',
          nameEn: 'Co-host / National Tsing Hua University',
          desc: '協辦學校為籃球、網球、象棋等賽事之主場。',
          links: [
            {
              link: 'http://www.nthu.edu.tw/',
              text: '官方網站',
              type: 'website'
            },
            {
              link: 'https://www.facebook.com/nthu.tw/',
              text: 'Facebook',
              type: 'facebook'
            },
            {
              link: 'http://dsa.site.nthu.edu.tw/',
              text: '課外活動組',
              type: 'website'
            },
            {
              link: 'https://nthupeo.site.nthu.edu.tw/',
              text: '體育室',
              type: 'website'
            }
          ]
        },
        {
          nameZh: '兩校後援組織',
          nameEn: 'Fan Clubs',
          desc: '賽前造勢活動、電競賽等皆由後援組織所負責。',
          links: [
            {
              link: 'https://www.facebook.com/nycu.meichu/',
              text: '陽明交大梅竹後援會',
              type: 'facebook'
            },
            {
              link: 'https://www.facebook.com/meichuwin/',
              text: '清大梅竹工作會',
              type: 'facebook'
            }
          ]
        },
        {
          nameZh: '兩校火力班',
          nameEn: '" Huo-Li " Groups',
          desc: '在比賽現場帶動觀眾，一起為選手及學校加油。',
          links: [
            {
              link: 'https://www.facebook.com/nctu.on.fire/',
              text: '陽明交大火力班',
              type: 'facebook'
            },
            {
              link: 'https://www.facebook.com/%E6%88%8A%E6%88%8C%E6%A2%85%E7%AB%B9%E7%81%AB%E5%8A%9B%E7%8F%AD-1571693219711454/',
              text: '清大火力班',
              type: 'facebook'
            }
          ]
        }
      ]
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
        this.isLoading = false
      })
    }
  }
}
</script>

<style>

</style>