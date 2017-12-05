<template>
  <div class="form-group">
    <label v-if="label">
      {{label}}
    </label>
    <input class="form-control border-input" :value="value">
  </div>
</template>

<script>
  export default {
    inheritAttrs: false,
    props: {
      value: [String, Number],
      label: String
    }
  }

</script>
