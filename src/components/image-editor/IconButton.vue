<template>
  <v-tooltip v-model="show" top>
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" icon @click="$emit('clicked')">
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>
    <span>{{ name }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: "icon-button",
  data() {
    return {
      show: false
    };
  },
  props: ["name", "icon"]
};
</script>
