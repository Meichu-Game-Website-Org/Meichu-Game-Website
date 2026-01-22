<template>
  <div>
    <nav >
      <ul class="nav">
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'index-2022'}">
            <!-- <i class="fas fa-home"></i>  -->
            首頁
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'game-list-2022'}">
            賽事
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'news-list-2022'}">
            公告
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'about-2022'}">
            關於
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'history-2022'}">
            歷史
          </router-link>
        </li>
        <li class="nav-item">
          <a href="https://meichu54.weebly.com/" target="_blank" class="nav-link">
            <div class="schoolteam">
            
            校隊與教練<br/>獎勵辦法
            
            </div></a>
        </li>
        <li class="nav-item">
          <a href="https://web.facebook.com/MeiChuGamePreparatoryCommittee/" target="_blank" class="nav-link">
            <!-- <i class="fab fa-facebook"></i> -->
            Facebook
          </a>
        </li>
        <li class="nav-item">
          <a href="https://www.instagram.com/meichu_prep_cmte/" target="_blank" class="nav-link">
            <!-- <i class="fab fa-instagram"></i>  -->
            Instagram
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>
