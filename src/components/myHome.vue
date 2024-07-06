<template>
  <el-container class="home-container" direction="vertical">
    <HomeHeader/>
  <el-container>
      <HomeAside/>
      <HomeMain/>
  </el-container>
</el-container>
</template>

<script>
import HomeHeader from "./HomeHeader";
import HomeAside from "./HomeAside";
import HomeMain from "./HomeMain";

export default {
  name: "myHome",
  components: {
    HomeHeader,
    HomeAside,
    HomeMain,
  },
  methods: {},
};
</script>

<style scoped>
.home-container {
  height: 100%;
}

</style>