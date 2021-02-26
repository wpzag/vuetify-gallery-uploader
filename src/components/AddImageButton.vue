<template>
  <span @click="addImage">
    <v-icon class="add-img-icon" size="60">mdi-plus</v-icon>
  </span>
</template>

<script>
export default {
  name: "add-image-button",
  data() {
    return {
      tooltip: false
    };
  },
  methods: {
    addImage() {
      this.$emit("addImage");
      this.tooltip = false;
    }
  }
};
</script>
<style scoped>
.add-img-icon {
  cursor: pointer;
  border: 5px dashed rgba(255, 255, 255, 0.2);
  padding: 15px;
  margin-bottom: 11px;
  transition: all 0.4s;
  color: rgba(255, 255, 255, 0.2);
}

.add-img-icon:hover {
  border: 5px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.3);
}
</style>
