<template>
  <div id="game">
    
    <Scoreboard :game="game" />
    
    <div class="game__information">
      <!-- Live -->
      <div class="game-block">
        <h1>轉播資訊</h1>
        <div class="title_bar"/>
        <template v-if="game.is_live">
          <div class="iframe_block">
            <iframe :src="game.live_url" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen/>
          </div>
          <div class="row">
            <div class="col-12 align-center" style="padding: .25rem; border-right: 1px solid #666;">{{ game.live_org }}</div>
          </div>
        </template>
        <template v-else>
          <div class="no-news">
            <p>本場賽事不提供轉播服務，敬請見諒。</p>
          </div>        
        </template>
      </div>
      <!-- Live END -->

      <!-- Entry Info -->
      <div class="game-block">
        <h1>入場須知</h1>
        <div class="title_bar"/>
        <p class="text-box article-body">{{ game.info_entry }}</p>
      </div>
      <!-- Entry Info END -->

      <!-- Rule -->
      <div class="game-block">
        <h1>賽事規則</h1>
        <div class="title_bar"/>
        <p class="text-box article-body">{{ game.info_rule }}</p>
      </div>
      <!-- Rule End -->

      <!-- Team -->
      <div class="game-block" v-if="slug != 'opening' && slug != 'closing'">
        <h2>隊伍介紹</h2>
        <div class="title_bar"/>
        <div class="row">
          <div class="col-12 col-md-6" v-if="game.team_nthu">
            <TeamCard :team="game.team_nthu" variant="nthu" />
          </div>
          <div class="col-12 col-md-6" v-if="game.team_nctu">
            <TeamCard :team="game.team_nctu" variant="nctu" />
          </div>
        </div>
      </div>
      <!-- Team END -->

      <!-- Announcement & Report -->
      <div class="game-block">
        <h1>相關公告 / 媒體報導</h1>
        <div class="title_bar"/>
        <div class="row" style="width: 100vw; margin-left: 0;" v-if="game.news && game.news.length">
          <div style="width: 100vw;" :key="news.id" v-for="news in game.news">
            <section class="news" style="width: 100vw;">
              <h3 class="news-title">
                <a :href="news.link" v-if="news.type_of == 'link' || news.type_of == 'news'">
                  {{ news.title }}
                </a>
                <router-link :to="{name: 'news-show-2024', params: {id: news.id}}" v-else>
                  {{ news.title }}
                </router-link>
              </h3>
              <div class="news-meta">
                {{ news.org }}
                <span v-if="news.author">{{ news.author }}</span>
              </div>
            </section>
          </div>
        </div>
        <div v-else align=center>尚無相關消息</div>
      </div>
      <!-- Announcement & Report END -->

      <!-- History Record -->
      <GameHistory :game="game" :slug="slug" />
      <!-- History Record END -->
      <BackToGameListBtn />
    </div>
  </div>
</template>

<script>

import { Game as GameApi } from '@meichu/services'
import Scoreboard from '@/components/Scoreboard.vue'
import TeamCard from '@/components/TeamCard.vue'
import GameHistory from '@/components/GameHistory.vue'
import BackToGameListBtn from '@/components/BackToGameListBtn.vue'

export default {
  name: 'game-show-2026',
  components: {
    Scoreboard,
    TeamCard,
    GameHistory,
    BackToGameListBtn
  },
  scrollToTop() {
    window.scrollTo(0,0);
  },
  metaInfo() {
    return {
      title: this.game.name,
      titleTemplate: '%s | 乙巳梅竹',
    }
  },

  data: function() {
    return {
      slug: null,
      game: {}
    }
  },

  created() {
    this.slug = this.$route.params.slug
    this.fetch()
  },

  methods: {
    fetch() {
      const params = {
        year_id: 57
      }
      GameApi.fetchGameBySlug(this.slug, params)
        .then((game) => {
          this.game = game;
          this.game.team_nctu.photo = "https://meichu.games" + this.game.team_nctu.photo;
          this.game.team_nthu.photo = "https://meichu.games" + this.game.team_nthu.photo;
        })
    }
  }


}

</script>

<style scoped lang="scss">
/* Game - Common */
#game {
  height: auto;
  @media (max-width: $screen-md) {
    padding-top: 60px;
  }
  .text-box {
    margin: 0 6.5%;
  }
  .align-center {
    text-align: center;
  }
  .game__information{
    position: relative;
    padding: 15vh 0 5rem 0;
    width: 100vw;
    @media (max-width: $screen-md) {
      padding: 5vh 0 5rem 0;
      top: 0;
    }
  }
  .iframe_block{
    margin: 20px 6.5vw;
    width: 87%;
    aspect-ratio: 16 / 9;
    iframe {
      width: 100%;
      height: 100%;
    }
  }
}

.game-block {
  margin: 2rem 1rem 5rem 1rem;
}
</style>