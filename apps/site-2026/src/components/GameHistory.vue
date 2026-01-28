<template>
  <div class="game-block" v-if="slug != 'opening' && slug != 'closing'">
    <h1>歷史對戰紀錄</h1>
    <div class="title-bar"/>
    <div class="stat" v-if="game.score_old_draw || game.score_old_nctu || game.score_old_nthu">
      <div class="stat-nthu">
        <span class="number-nthu">
          <i>{{ statNTHU }}<small>%</small></i>
        </span>
        <span class="stat-content">清華大學<br>
          {{ game.score_old_nthu }} 勝場
          <template v-if="game.score_old_draw > 0">{{ game.score_old_draw }} 平手</template>
        </span>
      </div>
      <div class="stat-bar">
        <div class="bar-item bar-nthu" :style="'width: ' + statNTHU + '%'"></div>
        <div class="bar-item bar-draw" :style="'width: ' + (100-statNCTU-statNTHU) + '%'"></div>
        <div class="bar-item bar-nctu" :style="'width: ' + statNCTU + '%'"></div>
        <span class="bar-desc">* 截至乙巳梅竹（2025）</span>
      </div>
      <div class="stat-nctu">
        <span class="number-nctu">
          <i>{{ statNCTU }}<small>%</small></i>
        </span>
        <span class="stat-content">陽明交通大學<br>
          {{ game.score_old_nctu }} 勝場
          <template v-if="game.score_old_draw > 0">{{ game.score_old_draw }} 平手</template>
        </span>
      </div>
    </div>

    <div class="stat" v-else>
      <div class="stat-nthu">
        <span class="number-nthu">
          ---<small>%</small>
        </span>
        <span class="stat-content">清華大學</span>
        <span class="stat-content">
          0 勝場
        </span>
      </div>
      <div class="stat-bar">
        <span class="bar-first">本屆為該賽第一場</span>
      </div>
      <div class="stat-nctu">
        <span class="number-nctu">
          <small>---%</small>
        </span>
        <span class="stat-content">陽明交通大學</span>
        <span class="stat-content">
          0 勝場
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameHistory',
  props: {
    game: {
      type: Object,
      required: true
    },
    slug: {
      type: String,
      default: null
    }
  },
  computed: {
    statNCTU() {
      const total = (this.game.score_old_nctu || 0) + (this.game.score_old_nthu || 0) + (this.game.score_old_draw || 0);
      return total === 0 ? 0 : Number.parseFloat(100 * (this.game.score_old_nctu / total)).toFixed(0);
    },
    statNTHU() {
      const total = (this.game.score_old_nctu || 0) + (this.game.score_old_nthu || 0) + (this.game.score_old_draw || 0);
      return total === 0 ? 0 : Math.min(Number.parseFloat(100 * (this.game.score_old_nthu / total)).toFixed(0), 100 - this.statNCTU);
    }
  }
}
</script>

<style scoped lang="scss">
.game-block {
  margin: 2rem 1rem 5rem 1rem;
}

.stat {
  margin: 2rem 6.5%;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  span {
    display: block;
  }
  .number-nctu, .number-nthu {
    font-size: 1.33rem;
    font-weight: 900;
  }
  .stat-nctu {
    color: $nctu;
    white-space: nowrap;
  }
  .stat-nthu {
    color: $nthu;
    white-space: nowrap;
  }
  .stat-content {
    font-size: .67rem;
    color: $white;
  }
  .stat-bar {
    flex-grow: 2;
    padding: 0 1.5rem;
    @media (max-width: $screen-md) {
      padding: 0 1rem;
    }
    .bar-desc {
      margin-top: .5rem;
      font-size: .67rem;
    }
    .bar-first {
      font-size: 1.25rem;
    }
    .bar-item {
      display: inline-block;
      &.bar-nctu {
        height: 10px;
        background: $nctu;
        border-radius: 0 .25rem .25rem 0;
      }
      &.bar-nthu {
        height: 10px;
        background: $nthu;
        border-radius: .25rem 0 0 .25rem;
      }
      &.bar-draw {
        height: 10px;
        background: $gray;
      }
    }
  }
}
</style>
