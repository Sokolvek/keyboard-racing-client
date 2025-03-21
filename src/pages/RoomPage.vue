<template>
  <div>
    <!-- <button @click="startGame">startGame</button> -->
    <div class="sentence" ref="sentence">
      <div v-for="(word, i) in sen.split(' ')" :key="i">
        <div :class="{ 'current-word': i == wordIndex }">{{ word }}</div>
      </div>
    </div>
    
    <input v-model="inputVal" @keydown="handleKey" type="text" />
    <p>Errors: {{ sentenceErrors }}</p>
    <ul v-if="room" class="player-list">
      <h2>Players list:</h2>
      <!-- <p>game status: {{ store.room.gameStarted }}</p> -->
      <li v-for="player in room.players" :key="player.id" class="player-item">
        <p v-if="player.name == store.name">Name: {{ player.name }} (you)</p>
        <p v-else>Name: {{ player.name }}</p>
        <p>Points: {{ player.gamePoints }}</p>
      </li>
    </ul>
    <!-- <Cat /> -->
  </div>
</template>

<script setup>
import Cat from "../components/Cat.vue";
import { onMounted, ref } from "vue";
import { Client } from "@stomp/stompjs";
import { useRouter, useRoute } from "vue-router";
import { useCounterStore } from "../stores/counter";

const store = useCounterStore();
const router = useRouter();
const route = useRoute();
const sen = ref("мама мыла раму");
const ws = import.meta.env.VITE_WS;
const roomId = route.params.id;
const inputVal = ref("");
const name = ref(""); 
const wordIndex = ref(0);
const sentenceErrors = ref(0);
const room = ref({ players: [] });
let notErrorKeys = new Set(["Alt", "Shift", "Control", "CapsLock", "Tab", "Backspace"]);
let roomConn
let letterIndex = 0;

function joinWs() {
  console.log(roomId, `${ws}/rooms/${roomId}`);
  roomConn = new WebSocket(`${ws}/rooms/${roomId}`)
  roomConn.onmessage = ((ev) => {
    console.log("got msg", JSON.parse(ev.data))
    room.value = JSON.parse(ev.data)
  })
  
  let req = {
    type:"get",
    body:{
      id:parseInt(roomId),
      players: []
    }
  }
  console.log(roomConn, req)
  setTimeout(() => {
    roomConn.send(JSON.stringify(req))
    console.log("sent", req, JSON.stringify(req))
  },300)
}

function findPlayer(players) {
  return players.findIndex((item) => item.name === store.name);
}

function startGame(){
  let req = {
    type:"update",
    body:{
      id: roomId,
      players: room.value.players,
    }
  }
  roomConn.send(req)
}

function handleKey(e){
    if(e.key == " " && inputVal.value == sen.value.split(" ")[wordIndex.value]){
      let plrId = findPlayer(room.value.players)
      console.log(plrId)
      room.value.players[plrId].gamePoints += 1
      console.log(plrId, room.value.players)
      wordIndex.value += 1
      let request = {
        type:"update",
        body:{
        id: parseInt(roomId),
        players: room.value.players
      }
      };
      letterIndex = 0
      console.log(request)
      // request.players[name.value].wordIndex += 1
      console.log(JSON.stringify(request))
      roomConn.send(JSON.stringify(request) );
      setTimeout(() => inputVal.value = "",0)
      inputVal.value = ""
      return
    }
  
    if(e.key == sen.value.split(" ")[wordIndex.value][letterIndex]){
      console.log("key matched")
      letterIndex++
    }else if(!notErrorKeys.has(e.key) && e.key != sen.value.split(" ")[wordIndex.value][letterIndex]){
      sentenceErrors.value += 1
    }
  }


onMounted(() => {
  joinWs()
});
</script>

<style>
.current-word {
  font-weight: bold;
  color: green;
}

.sentence {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.player-list{
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  gap: 10px;
}

.player-item{
  display: flex;
  flex-direction: column;
  background-color: rgb(19, 18, 18);
  width: 250px;
  padding: 5px;
  border-radius: 8px;
}

.player-item > p {
  margin: 0;
}
</style>
