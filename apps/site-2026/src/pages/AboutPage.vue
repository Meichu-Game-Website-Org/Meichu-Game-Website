<template>
  <div class="about">
    <MobileAbout></MobileAbout>
    <DesktopAbout></DesktopAbout>
  </div>
</template>

<script>
import { Option as OptionApi } from '@meichu/services'
import MobileAbout from '@/components/MobileAbout.vue'
import DesktopAbout from '@/components/DesktopAbout.vue'

export default {
  name: 'about',

  metaInfo: {
    title: '關於梅竹',
    titleTemplate: '%s | 乙巳梅竹',
  },

  components: {
    MobileAbout,
    DesktopAbout
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
        year_id: 57
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


