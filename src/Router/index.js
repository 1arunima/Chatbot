import { createWebHistory , createRouter} from 'vue-router'
import LoginPage from '../components/LoginPage.vue'
import SignUpPage from '../components/SignUpPage.vue'
import DashBoard from '../components/DashBoard.vue'

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
        path :"/dashboard",
        name : "dashboard",
        component : DashBoard

    }

]


const router = createRouter({
    history:createWebHistory(),
    routes
})

export default router