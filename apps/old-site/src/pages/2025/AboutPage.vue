<template>
  <div class="about">
    <MobileAbout :resource="resource" @retry="fetch" />
    <DesktopAbout :resource="resource" @retry="fetch" />
  </div>
</template>

<script>
import { archiveResourceMixin } from '@/utils/archive-resource'
import { Option as OptionApi, loadResource, readOptions } from '@meichu/services'
import MobileAbout from '@/components/2025/MobileAbout'
import DesktopAbout from '@/components/2025/DesktopAbout'

export default {
  mixins: [archiveResourceMixin],
  name: 'about',

  metaInfo: {
    title: '關於梅竹',
    titleTemplate: '%s | 乙巳梅竹',
  },

  components: {
    MobileAbout,
    DesktopAbout
  },

  created() {
    this.fetch()
  },

  computed: {
    options() { return this.resource.data || {} },
  },

  methods: {
    fetch() {
      return loadResource(this.resource, () => OptionApi.fetchOptions({
        data: ['about-meichu', 'meichu-history'], year_id: 57
      }).then(readOptions), options => !Object.values(options).some(value => value.trim()))
    }
  }
}
</script>


