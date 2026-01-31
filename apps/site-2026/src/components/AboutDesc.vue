<template>
  <div class="about-section">
    <div 
      class="about-content full-width-tabs" 
      :style="{ '--clip-path': 'polygon(0 0, 100% 0, 100% 90%, 95% 100%, 0 100%)' }"
    >
      <div class="tabs-header">
        <h2 
          :class="['tab-item', { active: currentTab === 'about-meichu' }]"
          @click="currentTab = 'about-meichu'"
        >
          丙午梅竹
        </h2>
        <h2 
          :class="['tab-item', { active: currentTab === 'meichu-history' }]"
          @click="currentTab = 'meichu-history'"
        >
          梅竹賽歷史
        </h2>
      </div>
      
      <div class="title-bar"/>

      <div class="content-body">
        <Loading v-if="isLoading"></Loading>
        <p v-else class="fade-in-text">{{ options[currentTab] }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { Option as OptionApi } from '@meichu/services'
import Loading from '@/components/Loading.vue'

export default {
  name: 'AboutDesc',

  components: {
    Loading
  },

  data() {
    return {
      isLoading: true,
      currentTab: 'about-meichu',
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
      .then(() => {
        this.isLoading = false;
      })
    }
  }
}
</script>

<style scoped lang="scss">
.about-section {
  width: 100%;
  margin-bottom: 40px;
}
/* 文字方塊與斜角實作 */
.full-width-tabs {
  padding: 40px 12vw;
  min-height: 400px;
  clip-path: var(--clip-path);
}
/* Tabs 導覽樣式 */
.tabs-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
}

.tab-item {
  cursor: pointer;
  transition: color 0.3s ease;
  color: rgba($primary, 0.3);
}
.tab-item.active {
  color: $white;
}
.tab-item:hover {
  color: rgba($primary, 0.7);
}

.title-bar {
  width: 100%;
  left: 0;
}

.content-divider {
  border: none;
  border-top: 1px solid #333;
  margin: 20px 0;
}

.content-body {
  line-height: 40px;
  white-space: pre-wrap;
  text-align: justify;
}

.fade-in-text {
  animation: fadeIn 0.4s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
