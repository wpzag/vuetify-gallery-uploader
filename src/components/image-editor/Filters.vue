<template>
  <div style="position:absolute; top: 50px; right: 50px; width: 200px">
    <div class="text-left">
      <v-slider
        max="1"
        min="0"
        step="0.01"
        v-model="grayscale"
        label="Grayscale"
        dark
        thumb-label
        thumb-color="grey"
        @change="filterChanged"
      />

      <v-slider
        max="1"
        min="0"
        step="0.01"
        v-model="sepia"
        label="Sepia"
        dark
        thumb-label
        thumb-color="grey"
        @change="filterChanged"
      />
      <v-slider
        max="1"
        min="0"
        step="0.01"
        v-model="saturate"
        label="Saturate"
        dark
        thumb-label
        thumb-color="grey"
        @change="filterChanged"
      />
      <v-slider
        max="360"
        min="0"
        step="1"
        v-model="hueRotate"
        label="Hue Rotate"
        dark
        thumb-label
        thumb-color="grey"
        @change="filterChanged"
      />
      <v-slider
        max="1"
        min="0"
        step="0.01"
        v-model="invert"
        label="Invert"
        dark
        thumb-label
        thumb-color="grey"
        @change="filterChanged"
      />
      <v-slider
        max="3"
        min="0"
        step="0.01"
        v-model="brightness"
        label="Brightness"
        dark
        thumb-label
        thumb-color="grey"
        @change="filterChanged"
      />
      <v-slider
        max="1"
        min="0"
        step="0.01"
        v-model="contrast"
        label="Contrast"
        dark
        thumb-label
        thumb-color="grey"
        @change="filterChanged"
      />
      <v-slider
        max="50"
        min="0"
        step="0.1"
        v-model="blur"
        label="Blur"
        dark
        thumb-label
        thumb-color="grey"
        @change="filterChanged"
      />
      <v-card flat color="black" dark class="text-center">
        <icon-button name="Reset" icon="mdi-restore" @clicked="reset" />
        <icon-button name="Save" icon="mdi-check-bold" @clicked="save" />
        <close-button
          @close="close"
          :filters="filters"
          :defaultFilters="defaultFilters"
        />
        <!--        <icon-button name="Close" icon="mdi-close" @clicked="close" />-->
      </v-card>
    </div>
  </div>
</template>
<script>
import IconButton from "./IconButton";
import CloseButton from "./CloseButton";
export default {
  name: "filters",
  components: { CloseButton, IconButton },
  props: ["selected", "filterMode"],
  data() {
    return {
      grayscale: 0,
      sepia: 0,
      saturate: 1,
      hueRotate: 0,
      invert: 0,
      brightness: 1,
      contrast: 1,
      blur: 0,
      suffix: {
        hueRotate: "deg",
        blur: "px"
      },
      defaultFilters: {}
    };
  },
  created() {
    this.defaultFilters = {
      filter: Object.entries(this._data)
        .filter(item => typeof item[1] !== "object")
        .map(
          item =>
            `${this.toDash(item[0])}(${item[1]}${this.suffix[item[0]] || ""})`
        )
        .join(" ")
    };
  },
  computed: {
    filters() {
      return {
        filter: Object.entries(this._data)
          .filter(item => typeof item[1] !== "object")
          .map(
            item =>
              `${this.toDash(item[0])}(${item[1]}${this.suffix[item[0]] || ""})`
          )
          .join(" ")
      };
    }
  },
  watch: {
    selected() {
      if (this.filterMode) {
        this.reset();
        this.close();
      }
      // console.log(this.$refs[this.selectedFilter]);
    }
  },

  methods: {
    filterChanged() {
      this.$emit("changed", this.filters);
    },
    toDash: str => str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),

    reset() {
      this.grayscale = 0;
      this.sepia = 0;
      this.saturate = 1;
      this.hueRotate = 0;
      this.invert = 0;
      this.brightness = 1;
      this.contrast = 1;
      this.blur = 0;
      this.filterChanged();
    },
    save() {
      let img = new Image();
      img.src = this.$parent.$refs.selectedImage.src;
      img.onload = () => {
        const elem = document.createElement("canvas");
        elem.width = img.width;
        elem.height = img.height;
        const ctx = elem.getContext("2d");
        ctx.filter = this.filters.filter;

        ctx.drawImage(img, 0, 0, elem.width, elem.height);
        this.$emit("saved", { index: this.selected, src: elem.toDataURL() });
        this.close();
      };
    },
    close() {
      this.reset();
      this.$emit("close");
    }
  }
};
</script>
