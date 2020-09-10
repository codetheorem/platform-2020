<template>
  <div class="container content-container col-md-7 col-lg-8 col-xl-5">
        <div class="content-container-title">
            <slot name="title"></slot>
        </div>
        <div class="content-container-body">
            <slot name="body"></slot>
        </div>
  </div>
</template>

<script>
export default {
  name: 'ContentContainer',
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .content-container {
    background: #FFFFFF;
    border-radius: 8px;
    padding: 3rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
  }

  @media (max-width: 800px) {
    .content-container {
      padding: 1rem;
    }
  }

  .content-container-title {
    margin-top: 3rem;
  }
</style>
