<template>
  <div id="game">
    <RequestState :resource="resource" empty-text="找不到這場賽事。" @retry="fetch" />
    <template v-if="resource.status === 'success'">
    
    <Scoreboard :game="game" />
    
    <div class="game__information">
      <!-- Live -->
      <div class="game-block">
        <h1>轉播資訊</h1>
        <div class="title-bar"/>
        <template v-if="game.is_live">
          <div class="iframe_block">
            <iframe :src="game.live_url" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen/>
          </div>
          <div class="row">
            <div class="col-12 align-center" style="padding: .25rem; border-right: 1px solid #666;">{{ game.live_org }}</div>
          </div>
        </template>
        <template v-else>
          <div class="text-box article-body">
            <p>本場賽事不提供轉播服務，敬請見諒。</p>
          </div>        
        </template>
      </div>
      <!-- Live END -->

      <!-- Entry Info -->
      <div class="game-block">
        <h1>入場須知</h1>
        <div class="title-bar"/>
        <p class="text-box article-body">{{ game.info_entry }}</p>
      </div>
      <!-- Entry Info END -->

      <!-- Rule -->
      <div class="game-block">
        <h1>賽事規則</h1>
        <div class="title-bar"/>
        <p class="text-box article-body">{{ game.info_rule }}</p>
      </div>
      <!-- Rule End -->

      <!-- Team -->
      <div class="game-block" v-if="slug != 'opening' && slug != 'closing'">
        <h1>隊伍介紹</h1>
        <div class="title-bar"/>
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
        <div class="title-bar"/>
        <div class="row" style="width: 100%; margin-left: 0;" v-if="game.news && game.news.length">
          <div style="width: 100%;" :key="news.id" v-for="news in game.news">
            <section class="news" style="width: 100%;">
              <h3 class="news-title">
                <a :href="news.link" v-if="news.type_of == 'link' || news.type_of == 'news'">
                  {{ news.title }}
                </a>
                <router-link :to="{name: 'news-show-2026', params: {id: news.id}}" v-else>
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
    </template>
    <BackToGameListBtn v-if="resource.status !== 'success'" />
  </div>
</template>

<script>
import { Game as GameApi, resourceMixin, loadResource, readGame } from '@meichu/services'
import Scoreboard from '@/components/Scoreboard.vue'
import TeamCard from '@/components/TeamCard.vue'
import GameHistory from '@/components/GameHistory.vue'
import BackToGameListBtn from '@/components/BackToGameListBtn.vue'
import RequestState from '@/components/RequestState.vue'
import { YEAR_ID } from '@/utils'

export default {
  name: 'game-show-2026',
  mixins: [resourceMixin],
  metaInfo() { return { title: this.game.name, titleTemplate: '%s | 丙午梅竹' } },
  components: { Scoreboard, TeamCard, GameHistory, BackToGameListBtn, RequestState },
  computed: {
    slug() { return this.$route.params.slug },
    game() { return this.resource.data || {} }
  },
  watch: {
    '$route.params.slug': { immediate: true, handler() { this.fetch() } }
  },
  methods: {
    fetch() {
      const slug = this.slug
      return loadResource(this.resource, async () => readGame(await GameApi.fetchGameBySlug(slug, { year_id: YEAR_ID })))
    }
  }
}
</script>

<style scoped lang="scss">
/* Game - Common */
#game {
  height: auto;
  .text-box {
    margin: 0 6.5%;
    @media (max-width: $screen-md) {
      margin: 0 16%;
    }
  }
  .align-center {
    text-align: center;
  }
  .game__information{
    position: relative;
    padding: 15vh 0 5rem 0;
    width: 100%;
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

.news {
  justify-content: center;
  text-align: center;
  padding-top: 7%;
  padding-left: 5%;
  padding-right: 5%;
  .news-title {
    font-size: 1.5rem;
    font-weight: 700;
    a {
      color: $primary;
      &:hover {
        color: $light;
      }
    }
  }
  .news-meta {
    font-size: .9rem;
  }
}

.game-block {
  margin: 2rem 1rem 5rem 1rem;
}
</style>