<template>
  <div class="history-page">
    <h1>歷史紀錄</h1>
    <div class="title-bar"/>
    <Loading v-if="isLoading"/>
    <div class="history-center" v-if="!isLoading">
      <table class="record history-table">
        <thead>
          <tr>
            <th class="head" width="50">年度</th>
            <th class="head" width="50">勝校</th>
            <th class="head">比數</th>
            <th class="head" v-for="item in itemList" :key="item.id">{{ item.name }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="archive in archiveList" :key="archive.year.year">
            <td>{{ archive.year.year - 1911 }}<br>{{ archive.year.short }}</td>
            <template v-if="archive.year.outcome == 'stop'">
              <td :colspan="itemList.length + 2">{{ getOutcome(archive.year.outcome) }}</td>
            </template>
            <template v-else-if="archive.year.outcome == 'friendly'">
              <td colspan="2">{{ getOutcome(archive.year.outcome) }}</td>
              <td v-for="row in archive.archive"  :class="'history-table__verdict history-table__verdict--' + row.outcome" :key="row.id">
                {{ getSchool(row.outcome) }}
              </td>
            </template>
            <template v-else>
              <td :class="'history-table__verdict history-table__verdict--' + archive.year.outcome">{{ getOutcome(archive.year.outcome, archive.year.year) }}</td>
              <td>{{ getScore(archive.year.outcome, archive.year.score_nctu, archive.year.score_nthu) }}</td>
              <td v-for="row in archive.archive" :class="'history-table__verdict history-table__verdict--' + row.outcome" :key="row.id">
                {{ getSchool(row.outcome) }}
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

import { History as HistoryApi } from '@meichu/services'
import Loading from '@/components/Loading.vue'

export default {
  name: 'history-list',

  components: {
    Loading
  },

  metaInfo: {
    title: '歷史紀錄'
  },

  data: function() {
    return {
      archiveList: [],
      itemList: [],
      isLoading: true
    }
  },

  created() {
    this.fetch()
  },

  methods: {
    fetch() {
      HistoryApi.fetchFullArchives()
        .then((data) => {
          this.archiveList = data.archives.filter(archive => archive.item_id != 30 && archive.item_id != 31)
          this.itemList = data.items.filter(item => item.slug != 'opening' && item.slug != 'closing')
        })
        .then(() => {
          this.isLoading = false
        })
    },
    
    getOutcome(outcome, year) {
      const d = [
        {
          'nctu': '陽明交通',
          'nthu': '清華',
          'draw': '平手',
          'stop': '全面停賽',
          'none': '?',
          'friendly': '全面友誼賽'
        },
        {
          'nctu': '交通',
          'nthu': '清華',
          'draw': '平手',
          'stop': '全面停賽',
          'none': '?',
          'friendly': '全面友誼賽'
        }
      ]
      return (year < 2021) ? d[1][outcome] : d[0][outcome]
    },

    getSchool(outcome) {
      const d = {
        'nctu': '竹',
        'nthu': '梅',
        'stop': '停',
        'draw': '和'
      }
      return d[outcome]
    },

    getScore(outcome, nctu, nthu) {
      if (outcome == 'nctu' || outcome == 'draw') {
        return nctu + ':' + nthu
      } else if (outcome == 'nthu') {
        return nthu + ':' + nctu
      } else {
        return ''
      }
    }
  }
}

</script>

<style scoped lang="scss">
.history-page {
  z-index: 0;
}
.history-center{
  position: relative;
  text-align: center;
  overflow-x: auto;
  white-space: nowrap;
  padding-left: 5vw;
  width: 95vw;
}
.history-table {
  text-align: center;
  font-size: .75rem;
  border-right: 1px solid rgba($text, 0.5);
  border-collapse: collapse;
  th, td {
    padding: 0 5px;
  }
  tr {
    border: 1px solid rgba($text, 0.5);
    td {
      border-right: 1px solid rgba($text, 0.5);
      border-left: 1px solid rgba($text, 0.5);
    }
  }
  .history-table__verdict--nctu {
    background: $nctu;
  }
  .history-table__verdict--nthu {
    background: $nthu;
  }
  .history-table__verdict--stop {
    background: $stop;
  }
  .history-table__verdict--draw {
    background: $equal;
  }
}
</style>