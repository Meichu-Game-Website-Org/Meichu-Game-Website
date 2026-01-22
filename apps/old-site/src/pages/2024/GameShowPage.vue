<template>
  <div id="game">
    <div class="news_list_page_back_box">
      <img src="@/assets/2024/news_background.svg" class="news_list_page_back" alt="" />
    </div>
    <div :class="'game__scoreboard status-' + game.status">

      <div class="game__mask"></div>

      <h1 class="game__name">{{ game.name }}</h1>

      <!-- <div class="scoreboard-nctu-score" v-if="showScore">{{ game.score_nctu }}</div>
      <div class="scoreboard-nthu-score" v-if="showScore">{{ game.score_nthu }}</div> -->

      <div :class="'game__scoreboard__status game-status-' + game.status">
        {{ GAME_STATUS[game.status] }}
      </div>

      <div class="game__info">
        <span class="game__info__item">
          <i class="fas fa-clock"></i>{{ moment(game.date).format('MM/DD') }} {{ game.time }}
        </span>
        <span class="game__info__item">
          <i class="fas fa-location-arrow"></i> <a :href="game.location_url" class="game__location" title="在 Google Maps 中查看">{{ game.location }}</a>
        </span>
      </div>
    </div>
    <div class="game__information">
    <div class="row">
      <div :class="{'col-12': true}">
        <h2 class="about-title">
          <span class="message_title">轉播資訊</span>
        </h2>
        <div class="title_bar"/>
        <template v-if="game.is_live">
          <div class="iframe_block">
          <iframe width="100%" height="450" :src="game.live_url" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
          <div class="row">
            <div class="col-12 col-sm-6 align-center" style="padding: .25rem; border-right: 1px solid #666;">{{ game.live_org }}</div>
            <div class="col-12 col-sm-6 align-center" style="padding: .25rem;">{{ game.live_author }}</div>
          </div>
        </template>
        <template v-else>
          <div class="no-news">
          <p>敬請期待</p>
          </div>        
        </template>
      </div>
      <div :class="{'col-12': true}" v-if="game.is_record">
        <h2 class="about-title">
          <span class="message_title">分場紀錄</span>
        </h2>
        <div class="title_bar"/>
        <div class="record-row" v-if="game.is_record">
          <table class="record">
            <tr>
              <th class="head">＃</th>
              <th class="head record-team-nctu">
                <span class="normal">{{ game.team_nctu.name }}</span>
                <div class="short">陽明交大</div>
              </th>
              <th class="head record-team-nthu">
                <span class="normal">{{ game.team_nthu.name }}</span>
                <div class="short">清大</div>
              </th>
            </tr>
            <tr  :key="record.id" v-for="record in game.records">
              <td class="head">{{ record.name }}</td>
              <td>{{ record.score_nctu }}</td>
              <td>{{ record.score_nthu }}</td>
            </tr>
          </table>
        </div>
      </div>
      
    </div>

    <div class="row">

      <div class="col-12">
        <div class="game-block">
        <h2 class="about-title">
          <span class="message_title">入場須知</span>
        </h2>
        <div class="title_bar"/>
        <p class="pre-text text-box">{{ game.info_entry }}</p>
        </div>
      </div>

      <div class="col-12">
        <div class="game-block">
        <h2 class="about-title">
          <span class="message_title">賽事規則</span>
        </h2>
        <div class="title_bar"/>
        <p class="pre-text text-box">{{ game.info_rule }}</p>
        </div>
      </div>

    </div>

    <section v-if="slug != 'opening' && slug != 'closing'">
      <h2 class="about-title">
          <span class="message_title">隊伍介紹</span>
        </h2>
        <div class="title_bar"/>
      <div class="row">
        <div class="col-12 col-sm-6" v-if="game.team_nctu">
          <section class="team1">
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
          <section class="team2" v-if="game.team_nthu">
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
    </section>

    <section>
      <h2 class="about-title">
          <span class="message_title">相關公告 / 媒體報導</span>
        </h2>
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
      <div v-else><div class="no-news">尚無相關消息</div></div>
    </section>
    <!-- <h2 class="about-title">
          <span class="message_title">場地圖</span>
        </h2>
        <div class="title_bar"/>
    <router-link @click.native="$scrollToTop" :to="{name: 'course-2024'}">
      <div class="no-course">按此查看</div>
      </router-link> -->

    <section v-if="slug != 'opening' && slug != 'closing'">
      <h2 class="about-title">
          <span class="message_title">歷史對戰數據</span>
        </h2>
        <div class="title_bar"/>
      <div class="stat" v-if="game.score_old_draw || game.score_old_nctu || game.score_old_nthu">
        <div class="stat-nctu">
          <span class="number-nctu">
            {{ statNCTU }}<small>%</small>
          </span>
          <span style="font-size: .9rem;">陽明交通大學</span>
          <span style="font-size: .9rem;">
            {{ game.score_old_nctu }}勝場
            <template v-if="game.score_old_draw > 0">{{ game.score_old_draw }}平手</template>
          </span>
        </div>
        <div class="stat-bar">
          <div class="bar-item bar-nctu" :style="'width: ' + statNCTU + '%'"></div>
          <div class="bar-item bar-draw" :style="'width: ' + (100-statNCTU-statNTHU) + '%'"></div>
          <div class="bar-item bar-nthu" :style="'width: ' + statNTHU + '%'"></div>
          <span class="bar-desc">* 截至癸卯梅竹（2023）</span>
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
          <span style="font-size: .9rem;">陽明交通大學</span>
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
    </section>

    <div style=" width: 100%; margin-top: 2rem; text-align: center;">
      <router-link :to="{name: 'game-list-2024'}" class="to-game-list">
         查看所有賽事
      </router-link>
    </div>
    </div>
  </div>
</template>

<script>

import moment from 'moment'
import { Game as GameApi } from '@meichu/services'
import {GAME_STATUS} from '@/utils'

export default {
  name: 'game-show-2024',
  scrollToTop() {
    window.scrollTo(0,0);
  },
  metaInfo() {
    return {
      title: this.game.name,
      titleTemplate: '%s | 甲辰梅竹',
    }
  },

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
      return Math.min(Number.parseFloat(100*(this.game.score_old_nthu / (this.game.score_old_nctu + this.game.score_old_nthu + this.game.score_old_draw))).toFixed(0), 100-this.statNCTU)
    },
  },

  methods: {
    fetch() {
      const params = {
        year_id: 56
      }
      GameApi.fetchGameBySlug(this.slug, params)
        .then((game) => {
          this.game = game
        })
    }
  }


}

</script>