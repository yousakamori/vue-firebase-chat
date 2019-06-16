<template>
  <v-container v-if="isLoaded" fluid>
    <v-layout justify-center row wrap>
      <MessageInput />
      <MessageList />
    </v-layout>
  </v-container>
</template>

<script>
import MessageList from "@/components/MessageList.vue";
import MessageInput from "@/components/MessageInput.vue";
import { mapGetters } from "vuex";

export default {
  name: "Home",
  components: {
    MessageList,
    MessageInput
  },
  computed: {
    ...mapGetters(["isLoaded"])
  }
};
</script>
