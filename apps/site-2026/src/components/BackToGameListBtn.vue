<template>
  <div class="to-game-list">
    <router-link :to="{name: 'game-list-2026'}" custom v-slot="{ navigate }">
      <button @click="navigate" role="link" class="rotating-btn-wrapper">
        <div class="border-layer"></div>
        <span class="btn-text">查看所有賽事</span>
      </button>
    </router-link>
  </div>
</template>

<style scoped lang="scss">
.to-game-list {
  display: flex;
  justify-content: center;
}

.rotating-btn-wrapper {
  position: relative;
  width: 20vw;
  height: 84px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 40px;
  cursor: pointer;
  background: #D9D9D933;
  border: none;
  outline: none;
  box-shadow: 1px 1px 10px 0px rgba(255, 255, 255, 0.1);
}

.border-layer {
  position: absolute;
  inset: 0;
  padding: 3px;
  border-radius: 40px; 
  -webkit-mask: 
     linear-gradient(#fff 0 0) content-box, 
     linear-gradient(#fff 0 0);
  mask: 
     linear-gradient(#fff 0 0) content-box, 
     linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  
  // 使用 conic-gradient 模擬旋轉漸層
  background: conic-gradient(
    from var(--angle),
    $nctu 0%,
    $nthu 50%,
    $nctu 100%
  );
  animation: rotate-border 3.2s linear infinite; // 800ms * 4 個狀態 = 3.2s
}

.btn-text {
  position: relative;
  z-index: 2;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 600;
}

// 註冊自定義屬性以便讓角度可以被動畫化
@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

@keyframes rotate-border {
  to {
    --angle: 360deg;
  }
}
</style>