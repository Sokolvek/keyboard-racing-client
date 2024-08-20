<template>
  <section>
    <input type="text" v-model="name" placeholder="enter your name" />
    <button @click="createRoom">Create Room</button>
    <p>or</p>
    <input type="text" v-model="roomCode" placeholder="enter room id" />
    <button @click="joinRoom">Join room</button>
    <button @click="router.push('/rooms')">browse rooms</button>
    {{ pressed }}

  </section>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import {useCounterStore} from "../stores/counter"

const store = useCounterStore()
const name = ref("");

const leftKeyboard = new Set(['q', 'w', 'e', 'r', 't', 'a', 's', 'd', 'f', 'g', 'z', 'x', 'c', 'v', 'b'])
const rightKeyboard = new Set(['y', 'u', 'i', 'o', 'p', 'h', 'j', 'k', 'l', 'n', 'm'])
let leftPaw = ref(false)
let rightPaw = ref(false)
const http = import.meta.env.VITE_HTTP;
const ws = import.meta.env.VITE_WS;
const router = useRouter();
const roomCode = ref(0)
const pressed = ref(new Set())

async function createRoom() {
  store.name = name.value
  const player = {
    id: 0,
    name: name.value,
    wordIndex: 0,
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
      store.room = data
      router.push({ path: `room/${data.id}`, params:{test:"huesos"} });
    });
}

function joinRoom() {
  store.name = name.value
  const player = {
    name: name.value,
    wordIndex: 0,
    id: 0,
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
      store.room = data
      // room.value = data;
      // roomId = data.id;
      // joinWs();
      router.push({path:`room/${roomCode.value}`})
    });
}
document.addEventListener('keydown', (event) => {
  if (event.repeat) return;
  // console.log(event.key)
  if(leftKeyboard.has(event.key)){
    console.log("ye")
    leftPaw.value = true
  }
  if(rightKeyboard.has(event.key)){
    rightPaw.value = true
  }
  pressed.value.add(event.key)
})

document.addEventListener('keyup', (event) => {
  if(leftKeyboard.has(event.key)){
    leftPaw.value = false
    console.log("end")
  }
  if(rightKeyboard.has(event.key)){
    rightPaw.value = false
  }
  pressed.value.delete(event.key)
})


</script>
<style scoped>

section{
  overflow-x: hidden;
}

.hello{
  color: green;
}

.cat div{
  position: absolute;
  width: 100%;
  height: 100%;
}

.head{
  background-image: url("../assets/imgs/cat.png");
}

.paw-left{
  background-image: url("../assets/imgs/paw-left.png");
  /* background-position-x: -800px; */
}

.paw-right{
  background-image: url("../assets/imgs/paw-right.png");

}

.pressed{
  background-position-x: -800px;
}


.cat-container{
  position: absolute;
  /* top: 50%; */
  right: 0%;
  bottom: 0;
  /* transform: translate(-50%,-50%); */
  width: 800px;
  height: 450px;
}
</style>