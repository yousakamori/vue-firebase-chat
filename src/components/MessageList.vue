<template>
  <v-flex class="my-3" xs12 sm10>
    <v-list three-line>
      <transition-group name="slide-fade">
        <template v-for="(message, index) in messages">
          <v-divider v-if="index != 0" :key="index"></v-divider>
          <v-list-tile :key="message.id" avatar>
            <v-list-tile-avatar>
              <img :src="message.user.icon" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-sub-title class="text--primary subheading">{{
                message.content
              }}</v-list-tile-sub-title>
              <v-list-tile-sub-title>{{
                fromNow(message.createdAt)
              }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action v-if="user && user.uid == message.uid">
              <v-btn icon ripple @click="removeMessage(message.id)">
                <v-icon color="amber lighten-1">delete</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </template>
      </transition-group>
    </v-list>
  </v-flex>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment-timezone";

export default {
  name: "MessageList",
  computed: {
    ...mapGetters(["messages", "user"])
  },
  methods: {
    removeMessage(id) {
      this.$store.dispatch("removeMessage", id);
    },
    fromNow(timestamp) {
      if (!timestamp) {
        return;
      }

      return moment(timestamp.toDate().toISOString()).fromNow();
    }
  }
};
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
