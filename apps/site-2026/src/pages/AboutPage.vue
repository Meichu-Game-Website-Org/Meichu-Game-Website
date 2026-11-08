<template>
  <div class="about">
    <MobileAbout :resource="resource" @retry="fetch" />
    <DesktopAbout :resource="resource" @retry="fetch" />
  </div>
</template>

<script>
import { Option as OptionApi, resourceMixin, loadResource, readOptions } from '@meichu/services'
import MobileAbout from '@/components/MobileAbout.vue'
import DesktopAbout from '@/components/DesktopAbout.vue'
import { YEAR_ID } from '@/utils'

export default {
  name: 'about',
  mixins: [resourceMixin],
  metaInfo: { title: '關於梅竹', titleTemplate: '%s | 丙午梅竹' },
  components: { MobileAbout, DesktopAbout },
  created() { this.fetch() },
  methods: {
    fetch() {
      return loadResource(this.resource, async () => readOptions(await OptionApi.fetchOptions({
        data: ['about-meichu', 'meichu-history'], year_id: YEAR_ID
      })), options => !Object.values(options).some(value => value.trim()))
    }
  }
}
</script>


