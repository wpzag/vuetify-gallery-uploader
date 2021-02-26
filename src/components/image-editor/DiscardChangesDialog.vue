<template>
  <v-dialog :value="value" width="300">
    <v-card dark class="pa-3 text-center">
      <p>Discard changes ?</p>

      <v-btn color="primary" text @click="$emit('cancel')">
        CANCEL
      </v-btn>
      <v-btn @click="close" color="error" text>
        DISCARD CHANGES
      </v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "discard-changes-dialog",

  props: ["value"],

  methods: {
    close() {
      this.$emit("close");
    }
  }
};
</script>
