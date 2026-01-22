<template>
  <div>
    <nav>
      <ul class="nav">
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'index-2021'}">
            <i class="fas fa-home"></i> 
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'game-list-2021'}">
            賽事
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'news-list-2021'}">
            公告
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'about-2021'}">
            關於
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'history-2021'}">
            歷史
          </router-link>
        </li>
        <li class="nav-item">
          <a href="https://web.facebook.com/MeiChuGamePreparatoryCommittee/" target="_blank" class="nav-link">
            <i class="fab fa-facebook"></i>
          </a>
        </li>
        <li class="nav-item">
          <a href="https://www.instagram.com/meichu_prep_cmte/" target="_blank" class="nav-link">
            <i class="fab fa-instagram"></i> 
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

