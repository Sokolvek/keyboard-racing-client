<template>
  <div>
    <button @click="getRooms">Refresh</button>
    <ul class="room-list">
      <li v-for="room in rooms" :key="room.id" class="room-item">
        <h4>{{ room.name }}</h4>
        <p>{{ room.players.length }}/{{ room.maxPlayers }}</p>
        <button @click="joinRoom(room.id)">join room</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { Client } from "@stomp/stompjs";
import { useRouter } from "vue-router";
import { useCounterStore } from "../stores/counter";

const store = useCounterStore()
const router = useRouter()
const http = import.meta.env.VITE_HTTP;
const ws = import.meta.env.VITE_WS;
const rooms = ref({});
let roomsWS;
let roomConn

async function getRooms() {
  let resp = await fetch(`${http}/rooms`)
  let body = await resp.json()
  console.log("got rooms", body)
  rooms.value = body
}


function joinRoom(roomId) {
  const req = {
    roomId:roomId,
    player :{ 
      name: store.name,
    }
  };
  fetch(`${http}/rooms/join`, {
    method: "POST",
    body: JSON.stringify(req),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      router.push({path:`room/${roomId}`})
    });
}

onMounted(() => {
  getRooms()
});
</script>


<style scoped>

.room-list{ 
  margin: 0;
  padding: 0;
}

.room-item{
  margin-top: 20px;
}

.room-item > h4,p {
  margin: 0;
}
</style>