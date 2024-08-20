import { createRouter, createWebHashHistory } from "vue-router";

import BrowseRooms from "./pages/BrowseRooms.vue"
import Main from "./pages/Main.vue"
import RoomPage from "./pages/RoomPage.vue"
import LogIn from "./pages/LogIn.vue"
const router = createRouter({
    history:createWebHashHistory(),
    routes:[
        {
          path:"/",
          component:Main
        },
        {
            path:"/rooms",
            component:BrowseRooms
        },
        {
            path:"/room/:id",
            component:RoomPage
        },
        {
            path:"/create-user",
            component:LogIn
        }
    ]
})

export default router