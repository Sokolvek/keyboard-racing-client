<template>
  <router-view></router-view>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { Client } from "@stomp/stompjs";
import {useRouter} from "vue-router"

const router = useRouter()
const sen = ref("мама мыла раму");
const http = import.meta.env.VITE_HTTP;
const ws = import.meta.env.VITE_WS;
const inputVal = ref("");
const name = ref("");
const wordIndex = ref(0);
const roomCode = ref("");
let notErrorKeys = new Set(["Alt", "Shift", "Control", "CapsLock", "Tab", "Backspace"])
let letterIndex = 0

let roomId;
let roomSocket;
const sentenceErrors = ref(0);
const room = ref({ players: [] });
let id = 0;
let player = {
  id: id,
  name: name.value,
  wordIndex: wordIndex.value,
};

async function createRoom() {
  const player = {
    id: id,
    name: name.value,
    wordIndex: wordIndex.value,
  };
  console.log(JSON.stringify(player));
  await fetch(`${http}/room-create`, {
    method: "POST",
    body: JSON.stringify(player),
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((res) => res.json())
  .then((data) => {
    roomId = data.id;
    room.value = data;
    console.log(data);
    joinWs();
  });
  id += 1;
}

function joinWs() {
  console.log(roomId);
    roomSocket = new Client({
    brokerURL: `${ws}/rooms`,
    onConnect: () => {
      console.log(`Subscribed to /topic/rooms/${roomId}`);
      roomSocket.subscribe(`/topic/rooms/${roomId}`, (message) => {
        console.log(`Received message: ${message.body}`);
        room.value = JSON.parse(message.body);
      });
      // Optional initial message
      // client.publish({
      //   destination: `/app/rooms/${roomId}`,
      //   body: JSON.stringify({}),
      // });
      console.log("WebSocket connection established");
    },
    onStompError: (frame) => {
      console.error(`Broker reported error: ${frame.headers["message"]}`);
      console.error(`Additional details: ${frame.body}`);
    },
  });
  roomSocket.activate();
}

function joinRoom() {
  const player = {
    name: name.value,
    wordIndex: wordIndex.value,
    id: id,
  };
  fetch(`${http}/join-room/${roomCode.value}`, {
    method: "POST",
    body: JSON.stringify(player),
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    room.value = data;
    roomId = data.id;
    // joinWs();
  });
  id += 1;
}

function findPlayer(players){
  let res
  players.forEach((item,i) => {
    if(item.name === name.value){
      res = i
    }
  })
  return res
}

function handleKey(e){
  if(e.key == " " && inputVal.value == sen.value.split(" ")[wordIndex.value]){
    let plrId = findPlayer(room.value.players)
    room.value.players[plrId].wordIndex += 1
    console.log(plrId, room.value.players)
    wordIndex.value += 1
    let request = {
      id: roomId,
      players: room.value.players
    };
    letterIndex = 0
    console.log(request)
    // request.players[name.value].wordIndex += 1
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
  if(!localStorage.getItem("login")){
    router.push("/create-user")
  }
})

</script>

<style>
.current-word {
  font-weight: bold;
  color: green;
}
</style>
