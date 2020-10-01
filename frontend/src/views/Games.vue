<template>
  <div class="page-container">
      <h2 class="page-header">Games</h2>
      <b-container style="margin-bottom: 5rem;">
          <div>
              <SectionTitle title="Minecraft" />
              <div class="game-container">
                   <router-link :to="'/schedule?event=' + eventIds.minecraft1">
                        <div class="game-card">
                            <img src="../assets/minecraft_icon_2.png" />
                            <div>
                                Minecraft Free Build
                            </div>
                        </div>
                   </router-link>
                   <router-link :to="'/schedule?event=' + eventIds.minecraft2">
                    <div class="game-card">
                        <img src="../assets/minecraft_icon_1.png" />
                        <div>
                            Build Battle #1
                        </div>
                    </div>
                   </router-link>
                   <router-link :to="'/schedule?event=' + eventIds.minecraft3">
                    <div class="game-card">
                       <img src="../assets/minecraft_icon_1.png" />
                       <div>
                           Build Battle #2
                       </div>
                    </div>
                   </router-link>
              </div>
          </div>
            <div>
              <SectionTitle title="Skribbl" />
              <div class="game-container">
                  <router-link :to="'/schedule?event=' + eventIds.Skribbl1">
                    <div class="game-card">
                        <img src="../assets/Skribbl.png" />
                        <div>
                            Skribbl Session #1
                        </div>
                    </div>
                   </router-link>
                   <router-link :to="'/schedule?event=' + eventIds.Skribbl2">
                        <div class="game-card">
                        <img src="../assets/Skribbl.png" />
                        <div>
                            Skribbl Session #2
                        </div>
                    </div>
                   </router-link>
              </div>
          </div>
            <div>
              <SectionTitle title="Trivia" />
                <div class="game-container">
                    <router-link :to="'/schedule?event=' + eventIds.Trivia1">
                        <div class="game-card">
                            <img src="../assets/Trivia.png" />
                            <div>
                                Trivia Session #1
                            </div>
                        </div>
                    </router-link>
                    <router-link :to="'/schedule?event=' + eventIds.Trivia1">
                        <div class="game-card">
                            <img src="../assets/Trivia.png" />
                            <div>
                                Trivia Session #2
                            </div>
                        </div>
                    </router-link>
                </div>
          </div>
      </b-container>
  </div>
</template>

<script>
import SectionTitle from '../components/SectionTitle';
import generalMixin from '../mixins/general';

export default {
  name: 'Games',
  components: {
    SectionTitle,
  },
  mixins: [generalMixin],
  computed: {
    eventIds() {
      return this.getEnvVariable('eventIds');
    },
  },
};
</script>

<style scoped>
.section-container {
    width: 80%;
    height: fit-content;
}

.game-container {
    margin-top: 1rem;
    display: flex;
    justify-content: space-around;
}

.game-card {
    background: #FFFFFF;
    border-radius: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 1rem;
    color: #2c3e50;
}
</style>
