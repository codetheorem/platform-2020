<template>
  <div class="home-page">
    <div class="home-header">
      <h2>Welcome, Hugo</h2>
    </div>
    <div class="home-main">
      <div class="home-links">
        <h5>HELPFUL LINKS</h5>
        <p>Over here maybe put a general introduction to Technica’s core features. </p>
        <p>Then add a list of helpful links to the Technica Slack Channel, Hacker Resources, Technica 2020 Schedule, Our Speakers, etc.</p>
      </div>
      <div class="home-announcements">
        <h5>ANNOUNCEMENTS</h5>
        <div class="announcements-list">
          <Banner text="This is a sample announcement. Welcome to Technica!"/>
          <Banner text="This is a sample announcement. Welcome to Technica!"/>
        </div>
      </div>
    </div>
    <div class="home-footer">

    </div>
  </div>
</template>

<script>
import Banner from '@/components/Banner.vue';

export default {
  name: 'Home',
  components: {
    Banner,
  },
};
</script>

<style scoped>
.home-page {
  background-color: #F6F4F7;
  width: 100vw;
  height: 100vh;
}

h2 {
  color: var(--bright-purple);
}

.home-header {
  padding-top: 2rem;
}

.home-main {
  display: flex;
  padding: 2rem;
  padding-left: 10rem;
  padding-right: 10rem;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.home-links {
  width: 80%;
  height: 30vh;
  background: #DED2E5;
  border-radius: 8px;
  margin-right: 3rem;
  padding: 1rem;
}

.home-announcements {
  background: #FFFFFF;
  border-radius: 8px;
  width: 80%;
  height: 30vh;
  padding: 1rem;
}

.announcements-list {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

</style>
