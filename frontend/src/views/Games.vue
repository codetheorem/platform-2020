<template>
  <div class="page-container">
      <h2 class="page-header">Games</h2>
      <b-container style="margin-bottom: 5rem;">
          <div>
              <SectionTitle title="Minecraft" />
              <div class="game-container">
                   <div class="game-card">
                       <img src="../assets/minecraft_icon_2.png" />
                       <div>
                           Minecraft Free Build
                       </div>
                   </div>
                    <div class="game-card">
                       <img src="../assets/minecraft_icon_1.png" />
                       <div>
                           Build Battle #1
                       </div>
                   </div>
                    <div class="game-card">
                       <img src="../assets/minecraft_icon_1.png" />
                       <div>
                           Build Battle #2
                       </div>
                   </div>
              </div>
          </div>
            <div>
              <SectionTitle title="Skribbl" />
              <div class="game-container">
                   <div class="game-card">
                       <img src="../assets/Skribbl.png" />
                       <div>
                           Skribbl Session #1
                       </div>
                   </div>
                    <div class="game-card">
                       <img src="../assets/Skribbl.png" />
                       <div>
                           Skribbl Session #2
                       </div>
                   </div>
              </div>
          </div>
            <div>
              <SectionTitle title="Trivia" />
              <div class="game-container">
                   <div class="game-card">
                       <img src="../assets/Trivia.png" />
                       <div>
                           Trivia Session #1
                       </div>
                   </div>
                    <div class="game-card">
                       <img src="../assets/Trivia.png" />
                       <div>
                           Trivia Session #2
                       </div>
                   </div>
              </div>
          </div>
      </b-container>
  </div>
</template>

<script>
import SectionTitle from '../components/SectionTitle';

export default {
  name: 'Games',
  components: {
    SectionTitle,
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
}
</style>
