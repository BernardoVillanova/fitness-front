<template>
  <div :class="theme">
    <NavBar/>
    <ContentSection />
    <FooterSection />
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import ContentSection from "@/components/ContentSection.vue";
import FooterSection from "@/components/FooterSection.vue";

export default {
  name: "HomePage",
  components: {
    NavBar,
    ContentSection,
    FooterSection,
  },
};
</script>

<style>
.light-mode {
  background-color: white;
  color: black;
}
.dark-mode {
  background-color: black;
  color: white;
}
</style>
