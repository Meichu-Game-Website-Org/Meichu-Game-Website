<template>
  <div class="about-section">
    <div 
      class="about-content full-width-tabs" 
      :style="{ '--clip-path': 'polygon(0 0, 100% 0, 100% 90%, 95% 100%, 0 100%)' }"
    >
      <div class="tabs-header" role="tablist" aria-label="關於梅竹內容">
        <h2 v-for="tab in tabs" :key="tab.key" class="tab-heading" role="presentation">
          <button
            :id="`${tabId}-${tab.key}`"
            type="button"
            role="tab"
            :class="['tab-item', { active: currentTab === tab.key }]"
            :aria-selected="currentTab === tab.key"
            :aria-controls="`${tabId}-panel`"
            :tabindex="currentTab === tab.key ? 0 : -1"
            @click="currentTab = tab.key"
            @keydown="onTabKeydown($event, tab.key)"
          >{{ tab.label }}</button>
        </h2>
      </div>
      
      <div class="title-bar"/>

      <div :id="`${tabId}-panel`" class="content-body" role="tabpanel" :aria-labelledby="`${tabId}-${currentTab}`" tabindex="0">
        <RequestState :resource="resource" empty-text="目前尚無介紹內容。" @retry="$emit('retry')" />
        <p v-if="resource.status === 'success'" class="fade-in-text">{{ options[currentTab] || '目前尚無介紹內容。' }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useId } from 'vue'
import RequestState from '@/components/RequestState.vue'

export default {
  name: 'AboutDesc',
  components: { RequestState },
  props: { resource: { type: Object, required: true } },
  setup() { return { tabId: useId() } },
  data() { return {
    currentTab: 'about-meichu',
    tabs: [{ key: 'about-meichu', label: '丙午梅竹' }, { key: 'meichu-history', label: '梅竹賽歷史' }]
  } },
  computed: { options() { return this.resource.data || {} } },
  methods: {
    onTabKeydown(event, key) {
      const index = this.tabs.findIndex(tab => tab.key === key)
      let next
      if (event.key === 'ArrowRight') next = (index + 1) % this.tabs.length
      else if (event.key === 'ArrowLeft') next = (index + this.tabs.length - 1) % this.tabs.length
      else if (event.key === 'Home') next = 0
      else if (event.key === 'End') next = this.tabs.length - 1
      else return
      event.preventDefault()
      this.currentTab = this.tabs[next].key
      this.$nextTick(() => this.$el.querySelector(`#${this.tabId}-${this.currentTab}`)?.focus())
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
  padding: 0;
  border: 0;
  background: transparent;
  font: inherit;
  cursor: pointer;
  transition: color 0.3s ease;
  color: $primary;
}
.tab-item:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 4px;
}
.tab-item.active {
  color: $white;
}
.tab-item:hover {
  color: $white;
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
  line-height: 36px;
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
