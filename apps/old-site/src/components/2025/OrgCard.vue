<template>
  <div class="org-card">
    <div class="name-zh">{{ nameZh }}</div>
    <div class="name-en">{{ nameEn }}</div>
    <div class="content">
      <div class="hazard-line"></div>
      <div class="decs">
        <div style="margin-bottom:2px;">{{ desc }} </div>
        <div v-for="link in links" :key="link.link">
          <a :href="link.link">
            <img src="@/assets/2025/compass.svg" alt="icon" v-if="link.type=='website'">
            <img src="@/assets/2025/facebook.svg" alt="icon" v-if="link.type=='facebook'">
            <img src="@/assets/2025/instagram.svg" alt="icon" v-if="link.type=='instagram'" :style="{ 'padding': '0 1px' }">
            {{ link.text }}
          </a>
        </div>
      </div>      
    </div>
  </div>
</template>

<script>
export default {
  props: ['nameZh', 'nameEn', 'desc', 'links']
}
</script>

<style>

</style>