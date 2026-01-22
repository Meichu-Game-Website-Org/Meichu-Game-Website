<template>
  <div>
    <div class="container header">
      <div style="text-align: center; width:100%;">
        <router-link :to="{name: 'index'}">
          <img src="@/assets/title-horizontal.png" class="logo" alt="己亥梅竹 | 2019 Meichu Games">
        </router-link>
      </div>

      <ul class="nav">
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'game-list'}">
            賽事
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'news-list'}">
            消息
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'about'}">
            關於梅竹
          </router-link>
        </li>
        <!-- <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'ticket'}">
            票務
          </router-link>
        </li> -->
        <!-- <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'about'}">
            關於梅竹
          </router-link>
        </li> -->
        <li class="nav-item">
          <a href="https://web.facebook.com/MeiChuGamePreparatoryCommittee/" target="_blank" class="nav-link">
            Facebook
          </a>
        </li>
      </ul>

    </div>
  </div>
</template>