<template>
  <span>
    <icon-button
      name="Delete"
      color="error"
      icon="mdi-trash-can-outline"
      @clicked="dialog = !dialog"
    />
    <v-dialog v-model="dialog" width="300">
      <v-card dark class="pa-3 text-center">
        <p>Delete this item ?</p>
        <v-btn @click="$emit('delete')" color="error" text>
          DELETE
        </v-btn>
        <v-btn color="primary" text @click="dialog = false">
          CANCEL
        </v-btn>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
import IconButton from "./IconButton";

export default {
  name: "delete-button",
  components: { IconButton },
  data() {
    return {
      dialog: false
    };
  }
};
</script>
