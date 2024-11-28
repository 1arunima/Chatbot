import { createWebHistory , createRouter} from 'vue-router'
import LoginPage from '../components/LoginPage.vue'
import SignUpPage from '../components/SignUpPage.vue'

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

    }

]


const router = createRouter({
    history:createWebHistory(),
    routes
})

export default router