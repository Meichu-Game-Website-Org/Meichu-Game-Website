<template>
  <div class="curr-score">
    <h1>正式賽當前積點</h1>
    <div class="title-bar"/>
    <div class="curr-score__updates">
      <button type="button" :disabled="requestPending" @click="fetch">{{ requestPending ? '更新中…' : '更新積點' }}</button>
      <span v-if="updatedAt && ['success', 'empty'].includes(resource.status)">
        最後更新（台灣時間）：<time :datetime="updatedAt">{{ updatedTime }}</time>
      </span>
    </div>
    <RequestState :resource="resource" empty-text="目前尚無正式賽積點資料。" @retry="fetch" />
    <div v-if="resource.status === 'success'" class="curr-score__score">
      <div class="score__school">
        <img src="@/assets/index-score-panda.png" alt="熊貓"/>
        <div>清華大學</div>
      </div>
      <div class="score__score" role="img" :aria-label="`清華大學 ${score.nthu} 點，陽明交通大學 ${score.nctu} 點`">
        <div class="left">
          <ScoreNumber :value="this.score['nthu']" />
        </div>
        <div class="center">:</div>
        <div class="right">
          <ScoreNumber :value="this.score['nctu']" />
        </div>
      </div>
      <div class="score__school">
        <img src="@/assets/index-score-fox.png" alt="狐狸" style="transform: scale(1.4);"/>
        <div>陽明交通大學</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Game as GameApi, resourceMixin, loadResource, readGames } from '@meichu/services'
import ScoreNumber from '@/components/ScoreNumber.vue'
import RequestState from '@/components/RequestState.vue'
import { YEAR_ID } from '@/utils'
import { SCORE_REFRESH_INTERVAL } from '@/game-display'

export default {
  name: 'curr-score',
  mixins: [resourceMixin],
  components: { ScoreNumber, RequestState },
  data() { return { requestPending: false, lastAttemptAt: 0, updatedAt: null } },
  computed: {
    score() { return this.resource.data },
    updatedTime() {
      return this.updatedAt ? new Intl.DateTimeFormat('zh-TW', {
        timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }).format(new Date(this.updatedAt)) : ''
    }
  },
  created() { this.fetch() },
  activated() {
    if (Date.now() - this.lastAttemptAt >= SCORE_REFRESH_INTERVAL) this.fetch()
  },
  methods: {
    fetch() {
      if (this.requestPending) return
      this.requestPending = true
      this.lastAttemptAt = Date.now()
      return loadResource(this.resource, async () => {
        const games = readGames(await GameApi.fetchAllGames({ year_id: YEAR_ID })).filter(game => game.type_of === 'official')
        if (!games.length) return null
        const draw = games.filter(game => game.status === 'draw').length
        return {
          nthu: games.filter(game => game.status === 'nthu').length + 0.5 * draw,
          nctu: games.filter(game => game.status === 'nctu').length + 0.5 * draw
        }
      }).then(() => {
        if (['success', 'empty'].includes(this.resource.status)) this.updatedAt = new Date().toISOString()
      }).finally(() => { this.requestPending = false })
    }
  }
}
</script>


<style lang="scss" scoped>
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.curr-score {
  padding: 100px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .curr-score__updates {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: .75rem 1rem;
    margin: 1rem 1rem 2rem;
    font-size: max(.8rem, 14px);
    line-height: 1.5;
    text-align: center;
    button {
      min-height: 44px;
      border: 1px solid currentColor;
      border-radius: 4px;
      padding: .5rem 1.25rem;
      color: inherit;
      background: transparent;
      font: inherit;
      cursor: pointer;
      &:hover:not(:disabled) { text-decoration: underline; }
      &:disabled { opacity: .65; cursor: wait; }
      &:focus-visible { outline: 2px solid currentColor; outline-offset: 4px; }
    }
  }

  @media (max-width: $screen-md) {
    padding: 0;
  }

  .curr-score__score {
    padding: 0 10%;
    display: flex;
    justify-content: space-between;
    @media (max-width: $screen-md) {
      padding: 0 5%;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
    }
  }
  .score__school {
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (max-width: $screen-md) {
      gap: 1rem;
      &:last-child {
        flex-direction: column-reverse;
      }
    }

    img {
      width: 18vw;
      @media (max-width: $screen-md) {
        width: 42vw;
      }
    }
    div {
      font-weight: 700;
      letter-spacing: 0.1em;
      text-align: center;
      font-size: 1.33rem;
      // @media (max-width: $screen-xl) {
      //   font-size: 1.rem;
      // }
      @media (max-width: $screen-lg) {
        font-size: .9rem;
      }
      @media (max-width: $screen-md) {
        font-size: 2rem;
      }
      @media (max-width: $screen-sm) {
        font-size: 1.33rem;
      }
    }
  }
  .score__score {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    font-weight: 800;
    line-height: normal;

    font-size: 5.3rem;
    @media (max-width: $screen-xl) {
      font-size: 4.7rem;
    }
    @media (max-width: $screen-lg) {
      font-size: 3.5rem;
    }
    @media (max-width: $screen-md) {
      gap: 2rem;
      font-size: 7rem;
      flex-direction: column;
    }
    @media (max-width: $screen-sm) {
      gap: 0px;
      font-size: 5rem;
    }
    .left {
      margin-right: auto;
      text-align: right;
      height: 1.5em; /* Ensure height for SVG */
      display: flex;
      align-items: center;
      @media (max-width: $screen-md) {
        margin: 0;
      }
    }
    .right {
      margin-left: auto;
      text-align: left;
      height: 1.5em; /* Ensure height for SVG */
      display: flex;
      align-items: center;
      @media (max-width: $screen-md) {
        margin: 0;
      }
    }
    .center {
      margin: 0 auto;
      animation: blink 2s infinite ease-in-out;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      transform: translateY(-0.1em); /* 向上微調以對齊數字中心 */
    }
  }
}
</style>
