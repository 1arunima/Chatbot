<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  messages: {
    type: Object,
  },
  loguser: {
    type: Object,
  },
  isSelected: {
    type: Boolean,
  },
  index:{
    type:Number
  }
});

const emit = defineEmits(['updateStyle']);

function changeStyle() {
  emit('updateStyle', props.index); 
}
</script>

<template>
  <div
    :class="[
      'message',
      { sent: messages.from === loguser.id, received: messages.from !== loguser.id, selected: isSelected }
    ]"
    @click="changeStyle"
  >
    <p>{{ messages.message }}</p>
    <small>{{ messages.time }}</small>
  </div>
</template>

<style scoped>
.message {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  max-width: 70%;
  word-wrap: break-word;
}

.message.sent {
  background: #007bff;
  color: white;
  align-self: flex-end;
  margin-left: auto;
}

.message.received {
  background: #e4e6eb;
  color: black;
  align-self: flex-start;
}

.message.selected {
  border: 2px solid #007bff;
  background-color: #e6f7ff;
}
</style>
