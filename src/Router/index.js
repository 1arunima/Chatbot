import { createWebHistory , createRouter} from 'vue-router'
import LoginPage from '../components/LoginPage.vue'
import SignUpPage from '../components/SignUpPage.vue'
import Chat from '../components/Chat.vue'

const routes =[
    {
        path :"/",
        name : "login",
        component : LoginPage

    },
    {
        path :"/signup",
        name : "signup",
        component : SignUpPage

    },
    {
        path :"/chat",
        name : "chat",
        component : Chat

    }

]


const router = createRouter({
    history:createWebHistory(),
    routes
})

export default router