<template>
  <div>
    <nav >
      <ul class="nav">
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'index-2023'}">
            <!-- <i class="fas fa-home"></i>  -->
            首頁
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'game-list-2023'}">
            賽事
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'news-list-2023'}">
            公告
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'about-2023'}">
            關於
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'history-2023'}">
            歷史
          </router-link>
        </li>
        <li class="nav-item">
          
            <a href="https://drive.google.com/drive/folders/1A6YhtzDkBYhAWvGpixGZrtVwmS3Ymv2L?usp=share_link" target="_blank" class="nav-link">
            <div class="schoolteam">
            
            校隊與教練<br/>獎勵辦法
            
            </div></a>
          <!-- <span
            v-on:mouseover="mouseover"
            v-on:mouseleave="mouseleave"
            :class="{ isOpen }"
            >
                <li>
                    <a href="">
                        test
                    </a>
                </li>
        </span> -->
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


<script>
export default {
  methods: {
        mouseover: function () {
            this.isOpen = true;
        },
        mouseleave: function () {
            this.isOpen = false;
        }
    }
}
</script>

<style>

</style>