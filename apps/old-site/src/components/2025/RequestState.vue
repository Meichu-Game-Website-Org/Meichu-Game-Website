<template>
  <div v-if="resource.status !== 'success'" class="request-state" :aria-busy="resource.status === 'loading'">
    <p v-if="resource.status === 'loading'" role="status">資料載入中…</p>
    <template v-else-if="resource.status === 'error'">
      <p role="alert">{{ resource.error }}</p>
      <button type="button" @click="$emit('retry')">重新載入</button>
    </template>
    <p v-else-if="resource.status === 'empty'" role="status">{{ emptyText }}</p>
  </div>
</template>

<script>
export default {
  name: 'RequestState',
  props: {
    resource: { type: Object, required: true },
    emptyText: { type: String, default: '目前尚無資料。' }
  }
}
</script>

<style scoped>
.request-state { position: relative; z-index: 1; padding: 2rem 1rem; text-align: center; white-space: normal; line-height: 1.6; }
.request-state p { margin: 0 0 1rem; }
button { min-height: 44px; padding: .5rem 1.25rem; border: 1px solid currentColor; border-radius: 4px; background: transparent; color: inherit; font: inherit; cursor: pointer; }
button:hover { text-decoration: underline; }
button:focus-visible { outline: 2px solid currentColor; outline-offset: 4px; }
</style>
