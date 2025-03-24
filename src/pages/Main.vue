<template>
  <section>
    <div class="sec">
      <input type="text" v-model="roomName" placeholder="enter room name" />
      <button @click="createRoom">Create Room</button>
    </div>
    <p>or</p>
    <div class="lower-section">
      <div class="sec">
        <input type="text" v-model="roomCode" placeholder="enter room id" />
        <button @click="joinRoom">Join room</button>

      </div>
      <button @click="router.push('/rooms')">browse rooms</button>
    </div>
    <!-- {{ pressed }} -->

  </section>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import {useCounterStore} from "../stores/counter"

const store = useCounterStore()
const roomName = ref("");

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
  const room = {
    id: 0,
    name: roomName.value,
    players:[ {
      name: store.name
    }],
    owner: {name:store.name},
    maxPlayers: 2
}
  await fetch(`${http}/rooms`, {
    method: "POST",
    body: JSON.stringify(room),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      console.log("dlw;adl;wa;l",res)
      return res.json()
    })
    .then((data) => {
      store.room = data
      joinRoom(data.id)
    });
}

async function joinRoom(roomId) {
  const player = {
    roomId:roomId,
    player: {
      name: store.name,
    }
  };
  await fetch(`${http}/rooms/join`, {
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
      router.push({path:`room/${roomCode.value || roomId}`})
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

.lower-section{
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sec{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.sec > input {
  height: 13px;

}
</style>