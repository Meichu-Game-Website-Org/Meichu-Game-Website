<template>
  <div class="mobile-about">
    <div class="about-cover">
      <img src="@/assets/about-cover-mobile.png" alt="丙午梅竹封面" class="cover-img">
    </div>

    <div class="about-section">
      <h2>丙午梅竹</h2>
      <div class="title-bar"/>
      <div class="about-content break-line">
        <Loading v-if="isLoading"/>
        <p v-else v-html="formattedAboutMeichu"></p>
      </div>
    </div>

    <div class="about-section">
      <h2>梅竹賽歷史</h2>
      <div class="title-bar"/>
      <div class="about-content break-line">
        <Loading v-if="isLoading"/>
        <p v-else v-html="formattedMeichuHistory"></p>
      </div>
    </div>

    <div class="about-section">
      <h2>相關單位</h2>
      <div class="title-bar"/>
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
import OrgCard from '@/components/OrgCard.vue'
import Loading from '@/components/Loading.vue'

export default {
  name: 'MobileAbout',

  components: {
    OrgCard,
    Loading
  },

  metaInfo: {
    title: '關於梅竹',
    titleTemplate: '%s | 丙午梅竹',
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
          nameZh: '主辦校 / 國立清華大學',
          nameEn: 'Host / National Tsing Hua University',
          desc: '主辦學校為桌球、排球、羽球等賽事之主場。',
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
              link: 'https://dsa.site.nthu.edu.tw/',
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
          nameZh: '協辦校 / 國立陽明交通大學',
          nameEn: 'Co-host / National Yang Ming Chiao Tung University',
          desc: '協辦學校為籃球、網球、象棋等賽事之主場。',
          links: [
            {
              link: 'http://www.nycu.edu.tw/',
              text: '官方網站',
              type: 'website'
            },
            {
              link: 'https://www.facebook.com/nycu.taiwan/',
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
          nameZh: '兩校後援組織',
          nameEn: 'Fan Clubs',
          desc: '賽前造勢活動、電競賽等皆由後援組織所負責。',
          links: [
            {
              link: 'https://www.facebook.com/meichuwin/',
              text: '清大梅竹工作會',
              type: 'facebook'
            },
            {
              link: 'https://www.facebook.com/nycu.meichu/',
              text: '陽明交大梅竹後援會',
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
              link: 'https://www.facebook.com/%E6%88%8A%E6%88%8C%E6%A2%85%E7%AB%B9%E7%81%AB%E5%8A%9B%E7%8F%AD-1571693219711454/',
              text: '清大火力班',
              type: 'facebook'
            },
            {
              link: 'https://www.facebook.com/nctu.on.fire/',
              text: '陽明交大火力班',
              type: 'facebook'
            },
          ]
        }
      ]
    }
  },

  computed: {
    formattedAboutMeichu() {
      return this.options['about-meichu'] ? this.options['about-meichu'].replace(/\n/g, '<br>') : '';
    },
    formattedMeichuHistory() {
      return this.options['meichu-history'] ? this.options['meichu-history'].replace(/\n/g, '<br>') : '';
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

<style scoped lang="scss">
.mobile-about {
  display: none;
  background-color: #130f13;
  color: white;
  min-height: 100vh;
  padding: 0 10%;
  
  @media (max-width: $screen-md) {
    display: block;
  }

  .about-cover {
    width: 115%;
    margin-left: -7.5%;
    margin-bottom: 2rem;
    .cover-img {
      width: 100%;
      height: auto;
    }
  }

  .about-section {
    margin-bottom: 3.5rem;
    text-align: center;
    padding: 0 5%;
  }

  .title-bar {
    width: 100%;
    left: 0;
  }

  .about-content {
    font-size: 1rem;
    line-height: 17px;
    text-align: justify;
    font-weight: 500;
    
    p {
      margin-bottom: 1.5rem;
    }
  }

  .break-line {
    white-space: normal;
    word-wrap: break-word;
    word-break: break-all;
  }
}
</style>
