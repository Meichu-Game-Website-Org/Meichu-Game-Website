<template>
  <div class="desktop-about">
    <img class="about-cover-img" src="@/assets/about-cover.webp" alt="About cover">
    <AboutDesc />
    <div class="org">
      <h2>相關單位</h2>
      <div class="title-bar"/>
      <div class="org-section">
        <OrgCard 
          style="width: 64.6%"
          :nameZh="organizations[0].nameZh"
          :nameEn="organizations[0].nameEn"
          :desc="organizations[0].desc"
          :links="organizations[0].links"
        />
        <div class="org-img">
          <img src="@/assets/about-org-58.svg" alt="58" width="40%">
        </div>
      </div>
      <div class="org-section">
        <div class="org-img">
          <img src="@/assets/about-org-panda.png" alt="Panda">
        </div>
        <OrgCard 
          style="width: 64.6%"
          :nameZh="organizations[1].nameZh"
          :nameEn="organizations[1].nameEn"
          :desc="organizations[1].desc"
          :links="organizations[1].links"
        />
      </div>
      <div class="org-section">
        <OrgCard 
          style="width: 64.6%"
          :nameZh="organizations[2].nameZh"
          :nameEn="organizations[2].nameEn"
          :desc="organizations[2].desc"
          :links="organizations[2].links"
        />
        <div class="org-img">
          <img src="@/assets/about-org-fox.png" alt="Fox" style="transform: scale(1.3);">
        </div>
      </div>
      <div class="org-section">
        <OrgCard 
          style="width: 50%"
          :nameZh="organizations[3].nameZh"
          :nameEn="organizations[3].nameEn"
          :desc="organizations[3].desc"
          :links="organizations[3].links"
        />
        <OrgCard 
          style="width: 50%"
          :nameZh="organizations[4].nameZh"
          :nameEn="organizations[4].nameEn"
          :desc="organizations[4].desc"
          :links="organizations[4].links"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AboutDesc from '@/components/AboutDesc.vue'
import OrgCard from '@/components/OrgCard.vue'

export default {
  name: 'about',

  components: {
    AboutDesc,
    OrgCard
  },

  metaInfo: {
    title: '關於梅竹',
    titleTemplate: '%s | 丙午梅竹',
  },

  data() {
    return {
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
          nameEn: '“Huo-Li” Groups',
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
            }
          ]
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.desktop-about {
  display: block;
  @media (max-width: $screen-md) {
    display: none;
  }
  .about-cover-img {
    width: 76%;
    margin: 0 auto 40px auto;
    display: block;
  }
  
  .org {
    margin: 0 12vw;
  }
  .org-section {
    padding: .5rem 0;
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    .org-img {
      width: 30%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .org-title {
      position: relative;
      div {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        font-weight: 700;
        letter-spacing: 0.2em;
        text-indent: 0.2em;
        white-space: nowrap;
        color: rgba(88, 188, 176, 1);
        @media (max-width: $screen-xl) {
          font-size: 2.5rem;
        }
        @media (max-width: $screen-lg) {
          font-size: 2rem;
        }
      }
    }
  }
}
</style>