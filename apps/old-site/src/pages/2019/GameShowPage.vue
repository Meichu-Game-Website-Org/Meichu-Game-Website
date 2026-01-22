<template>
  <div class="container">

    <h1 class="game-name">{{ game.name }}</h1>

    <div :class="'scoreboard status-' + game.status">
      <img :src="game.photo" class="game-photo" alt="">
      <img src="@/assets/nctu-logo.png" class="nctu-logo" alt="">
      <img src="@/assets/nthu-logo.png" class="nthu-logo" alt="">

      <div class="game-mask"></div>

      <div class="scoreboard-nctu-score" v-if="showScore">{{ game.score_nctu }}</div>
      <div class="scoreboard-nthu-score" v-if="showScore">{{ game.score_nthu }}</div>

      <div :class="'scoreboard-status game-status-' + game.status">
        {{ GAME_STATUS[game.status] }}
      </div>

      <div class="scoreboard-info">
        <span class="info-item">
          <i class="fas fa-clock"></i> {{ moment(game.date).format('MM/DD') }} {{ game.time }}
        </span>
        <span class="info-item">
          <i class="fas fa-location-arrow"></i> <a :href="game.location_url" class="game-location-url" title="在 Google Maps 中查看"> {{ game.location }}</a>
        </span>
      </div>

    </div>

    <div class="record-row" v-if="game.is_record">
      <table class="record">
        <tr>
          <th class="head">隊伍</th>
          <th class="head" v-for="record in game.records" :key="record.id">{{ record.name }}</th>
        </tr>
        <tr>
          <td class="record-team-nctu">
            <span class="normal">{{ game.team_nctu.name }}</span>
            <div class="short">交大</div>
          </td>
          <td v-for="record in game.records" :key="record.id">{{ record.score_nctu }}</td>
        </tr>
        <tr>
          <td class="record-team-nthu">
            <span class="normal">{{ game.team_nthu.name }}</span>
            <div class="short">清大</div>
          </td>
          <td v-for="record in game.records" :key="record.id">{{ record.score_nthu }}</td>
        </tr>
      </table>
    </div>

    <div class="row">

      <div class="col-12 col-sm-6">
        <h2><i class="fas fa-arrow-alt-circle-right"></i> 入場須知</h2>
        <p class="pre-text">{{ game.info_entry }}</p>
      </div>

      <div class="col-12 col-sm-6">
        <h2><i class="fas fa-align-left"></i> 賽事規則</h2>
        <p class="pre-text">{{ game.info_rule }}</p>
      </div>

    </div>

    <h2><i class="fas fa-users"></i> 隊伍介紹</h2>

    <div class="row">
      <div class="col-12 col-sm-6" v-if="game.team_nctu">
        <section class="team">
          <img :src="game.team_nctu.photo" class="team-photo" alt="">
          <div class="team-content">
            <h3 class="team-name">{{ game.team_nctu.name }}</h3>
            <p class="pre-text">{{ game.team_nctu.intro }}</p>

            <div class="team-link">
              <a :href="game.team_nctu.link_facebook" v-if="game.team_nctu.link_facebook" target="_blank" class="team-link-item">
                <i class="fab fa-facebook"></i> Facebook
              </a>
              <a :href="game.team_nctu.link_instagram" v-if="game.team_nctu.link_instagram" target="_blank" class="team-link-item">
                <i class="fab fa-instagram"></i> Instagram
              </a>
              <a :href="game.team_nctu.link_website" v-if="game.team_nctu.link_website" target="_blank" class="team-link-item">
                <i class="fas fa-link"></i> 網站
              </a>
            </div>
          </div>
        </section>
      </div>
      <div class="col-12 col-sm-6">
        <section class="team" v-if="game.team_nthu">
          <img :src="game.team_nthu.photo" class="team-photo" alt="">
          <div class="team-content">
            <h3 class="team-name">{{ game.team_nthu.name }}</h3>
            <p class="pre-text">{{ game.team_nthu.intro }}</p>

            <div class="team-link">
              <a :href="game.team_nthu.link_facebook" v-if="game.team_nthu.link_facebook" target="_blank" class="team-link-item">
                <i class="fab fa-facebook"></i> Facebook
              </a>
              <a :href="game.team_nthu.link_instagram" v-if="game.team_nthu.link_instagram" target="_blank" class="team-link-item">
                <i class="fab fa-instagram"></i> Instagram
              </a>
              <a :href="game.team_nthu.link_website" v-if="game.team_nthu.link_website" target="_blank" class="team-link-item">
                <i class="fas fa-link"></i> 網站
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>


    <h2><i class="fas fa-video"></i> 轉播資訊</h2>

    <template v-if="game.is_live">
      <iframe width="100%" height="600" :src="game.live_url" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

      <div class="row">
        <div class="col-12 col-sm-6 align-center" style="padding: .25rem; border-right: 1px solid #666;">{{ game.live_org }}</div>
        <div class="col-12 col-sm-6 align-center" style="padding: .25rem;">{{ game.live_author }}</div>
      </div>
    </template>
    <template v-else>
      <p>敬請期待</p>
    </template>

    <h2><i class="fas fa-bullhorn"></i> 相關公告 / 媒體報導</h2>

    <div class="row" v-if="game.news.length">
      <div class="col-12 col-sm-6 col-md-4" v-for="news in game.news" :key="news.id">
        <section class="news">
          <h3 class="news-title">
            <a :href="news.link" v-if="news.type_of == 'link' || news.type_of == 'news'">
              {{ news.title }}
            </a>
            <router-link :to="{name: 'news-show', params: {id: news.id}}" v-else>
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
    <div v-else>尚無相關消息</div>

    <h2><i class="fas fa-percentage"></i> 歷史對戰數據</h2>

    <div class="stat" v-if="game.score_old_draw || game.score_old_nctu || game.score_old_nthu">
      <div class="stat-nctu">
        <span class="number-nctu">
          {{ statNCTU }}<small>%</small>
        </span>
        <span style="font-size: .9rem;">交通大學</span>
        <span style="font-size: .9rem;">
          {{ game.score_old_nctu }}勝場
          <template v-if="game.score_old_draw > 0">{{ game.score_old_draw }}平手</template>
        </span>
      </div>
      <div class="stat-bar">
        <div class="bar-item bar-nctu" :style="'width: ' + statNCTU + '%'"></div>
        <div class="bar-item bar-draw" :style="'width: ' + (100-statNCTU-statNTHU) + '%'"></div>
        <div class="bar-item bar-nthu" :style="'width: ' + statNTHU + '%'"></div>
        <span class="bar-desc">* 截至戊戌梅竹（2018）</span>
      </div>
      <div class="stat-nthu">
        <span class="number-nthu">
          {{ statNTHU }}<small>%</small>
        </span>
        <span style="font-size: .9rem;">清華大學</span>
        <span style="font-size: .9rem;">
          {{ game.score_old_nthu }}勝場
          <template v-if="game.score_old_draw > 0">{{ game.score_old_draw }}平手</template>
        </span>
      </div>
    </div>

    <div class="stat" v-else>
      <div class="stat-nctu">
        <span class="number-nctu">
          <small>---%</small>
        </span>
        <span style="font-size: .9rem;">交通大學</span>
        <span style="font-size: .9rem;">
          0勝場
        </span>
      </div>
      <div class="stat-bar">
        <span class="bar-first">本屆為該賽第一場</span>
      </div>
      <div class="stat-nthu">
        <span class="number-nthu">
          ---<small>%</small>
        </span>
        <span style="font-size: .9rem;">清華大學</span>
        <span style="font-size: .9rem;">
          0勝場
        </span>
      </div>
    </div>

    <div style=" width: 100%; margin-top: 2rem; text-align: center;">
      <router-link :to="{name: 'game-list'}" class="to-game-list">
        <i class="fas fa-grip-horizontal"></i> 查看所有賽事
      </router-link>
    </div>




  </div>
</template>

<script>

import moment from 'moment'
import { Game as GameApi } from '@meichu/services'
import {GAME_STATUS} from '@/utils'

export default {
  name: 'game-show',

  data: function() {
    return {
      slug: null,
      game: {},
      moment,
      GAME_STATUS
    }
  },

  created() {
    this.slug = this.$route.params.slug
    this.fetch()
  },

  computed: {
    showScore() {
      return this.game.status == 'running' ||
             this.game.status == 'pause' ||
             this.game.status == 'nctu' ||
             this.game.status == 'nthu' ||
             this.game.status == 'draw' ||
             this.game.status == 'end'
    },
    statNCTU() {
      return Number.parseFloat(100*(this.game.score_old_nctu / (this.game.score_old_nctu + this.game.score_old_nthu + this.game.score_old_draw))).toFixed(0)
    },
    statNTHU() {
      return Number.parseFloat(100*(this.game.score_old_nthu / (this.game.score_old_nctu + this.game.score_old_nthu + this.game.score_old_draw))).toFixed(0)
    },
  },

  methods: {
    fetch() {
      const params = {
        year_id: 1
      }
      GameApi.fetchGameBySlug(this.slug, params)
        .then((game) => {
          this.game = game
        })
    }
  }


}

</script>