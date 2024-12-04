
<script setup>

import { IconSend2 } from '@tabler/icons-vue';


const props =defineProps({
  label:{
    type:String,
    default:""
  },
  disable:{
    type:Boolean,
    default:""
  },
  color:{
    type:String,
    
  },
  class:{
    type:String
  }
})

</script>

<template>
    <button :style={color:props.color} :class="class" :disabled="disable" :visible="true">{{ label }}
      <IconSend2/>
    </button>
</template>

<style scoped>

.button{
  padding: 10px 20px; 
  border: none; 
  border-radius: 5px; 
  background-color: #007bff; 
  font-size: 16px;
  font-weight: bold; 
  cursor: pointer; 
  transition: background-color 0.3s ease; 
}

.button:hover {
  background-color: #0056b3; 
}
.logout-btn{
  padding: 10px 20px;
  border: none; 
  border-radius: 5px; 
  background-color: #007bff; 
  font-size: 16px;
  font-weight: bold; 
  cursor: pointer; 
  transition: background-color 0.3s ease; 
}

</style>