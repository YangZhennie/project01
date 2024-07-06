<template>
  <el-container class="home-container">
    <HomeHeader />
    <el-container>
      <HomeAside />
      <HomeMain />
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
/* 固定顶部和侧边栏，滑动main，采用子绝父相的形式 */
.home-container {
  height: 100%;
}
</style>