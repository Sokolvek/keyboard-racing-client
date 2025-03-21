<template>
  <section class="section">
    <h2>Enter your name</h2>
    <input type="text" v-model="name"><br>
    <button @click="createUser">Confirm</button>
  </section>
</template>

<script setup>
import {ref} from "vue"
import { useCounterStore } from "../stores/counter";
import { useRouter } from "vue-router";

const http = import.meta.env.VITE_HTTP;
const router = useRouter()
const store = useCounterStore()
const name = ref("")

async function createUser(){
  await fetch(`${http}/players`,{
    method:"POST",
    body:JSON.stringify({name:name.value}),
    headers:{
      "content-type":"application/json",
    }
  })
  .then((res) => {
    if(res.status != 201) return
      store.name = name.value
      router.push("/")
      localStorage.setItem("login", "true")
  })
}
</script>

<style scoped>

.section > h2 {
  margin: 0;
}

.section{
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>