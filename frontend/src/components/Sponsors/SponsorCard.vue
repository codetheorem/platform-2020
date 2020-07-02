<template>
  <div>
    <h2>{{sponsor_name}}</h2>
    
  </div>
</template>

<script>

export default {
  name: 'SponsorCard',

  props: {
      sponsor_name: String
  }
};
</script>