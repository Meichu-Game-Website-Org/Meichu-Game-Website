<template>
  <section :class="['team-box', variantClass]">
    <img :src="team.photo" class="team-photo" alt="">
    <div class="team-content">
      <div class="team-name">{{ team.name }}</div>
      <p class="article-body">{{ team.intro }}</p>
      <div class="team-link">
        <a :href="team.link_facebook" v-if="team.link_facebook" target="_blank" class="team-link-item">
          <i class="fab fa-facebook"></i> Facebook
        </a>
        <a :href="team.link_instagram" v-if="team.link_instagram" target="_blank" class="team-link-item">
          <i class="fab fa-instagram"></i> Instagram
        </a>
        <a :href="team.link_website" v-if="team.link_website" target="_blank" class="team-link-item">
          <i class="fas fa-link"></i> 網站
        </a>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TeamCard',
  props: {
    team: {
      type: Object,
      required: true
    },
    variant: {
      type: String,
      required: true,
      validator: value => ['nctu', 'nthu'].includes(value)
    }
  },
  computed: {
    variantClass() {
      return this.variant === 'nthu' ? 'team1' : 'team2';
    }
  }
}
</script>

<style scoped lang="scss">
.team-box {
  border-radius: 20px;
  border: 1.5px solid $white;
  margin-bottom: 1rem;
  height: 100%;
  @media (max-width: $screen-md) {
    width: 75%;
    height: auto;
  }
}
.team1 {
  background-color: rgba($nthu, 0.3);
  margin: 0 0 0 10%;
  @media (max-width: $screen-md) {
    margin: 1rem auto;
  }
}
.team2 {
  background-color: rgba($nctu, 0.3);
  margin: 0 10% 0 0;
  @media (max-width: $screen-md) {
    margin: 1rem auto;
  }
}
.team-photo {
  display: block;
  width: 86%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: 10px;
  margin: 7% auto 0;
  @media (max-width: $screen-md) {
    width: 80%;
    margin: 10% auto 0;
  }
}
.team-content {
  padding: 7%;
  @media (max-width: $screen-md) {
    padding: 10%;
  }
}
.team-name {
  font-weight: 800;
  @media (max-width: $screen-md) {
    font-size: 1.17rem;
  }
}
.team-link {
  padding: .75rem 1.5rem;
  position: relative;
  right: 0;
  text-align: right;
  margin-bottom: -1.5rem;
  margin: .25rem -1.5rem -1.5rem;
  .team-link-item {
    margin-left: .5rem;
    color: $primary;
    &:hover {
      text-decoration: none;
      color: $text;
    }
  }
}
</style>
