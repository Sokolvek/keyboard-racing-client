<template>
        <div class="cat-container">
      <div class="cat">
        <div class="head"></div>
        <div :class="{'pressed' : leftPaw}" class="paw-left"></div>
        <div :class="{'pressed' : rightPaw}" class="paw-right"></div>
      </div>
    </div>
</template>

<style scoped>
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