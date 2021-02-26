<template>
  <span>
    <icon-button name="Close" icon="mdi-close" @clicked="toggleDialog" />
    <v-dialog v-model="dialog" width="300">
      <v-card dark class="pa-3 text-center">
        <p>Discard changes ?</p>

        <v-btn color="primary" text @click="dialog = false">
          CANCEL
        </v-btn>
        <v-btn @click="close" color="error" text>
          DISCARD CHANGES
        </v-btn>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
import IconButton from "./IconButton";

export default {
  name: "close-button",
  components: { IconButton },
  props: ["filters", "defaultFilters"],
  data() {
    return {
      dialog: false
    };
  },

  methods: {
    close() {
      this.dialog = false;
      this.$emit("close");
    },
    toggleDialog() {
      if (this.defaultFilters.filter === this.filters.filter)
        return this.$emit("close");

      this.dialog = true;
    }
  }
};
</script>
