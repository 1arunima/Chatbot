import { createWebHistory , createRouter} from 'vue-router'
import LoginPage from '../components/LoginPage.vue'
import SignUpPage from '../components/SignUpPage.vue'
import Chat from '../components/Chat.vue'

const routes =[
    {
        path :"/",
        name : "login",
        component : LoginPage,
        meta:{
            guestOnly:true
        }


    },
    {
        path :"/signup",
        name : "signup",
        component : SignUpPage,
        meta:{
            guestOnly:true
        }

    },
    {
        path :"/chat",
        name : "chat",
        component : Chat,
        meta:{
            requiresAuth:true
        }

    }

]


const router = createRouter({
    history:createWebHistory(),
    routes
})


router.beforeEach((to, from, next) => {
   
    const isAuthenticated = !!localStorage.getItem("loggedInUser"); 
    console.log( !!localStorage.getItem("loggedInUser"));

    if (to.meta.guestOnly && isAuthenticated) {
      next({ name: "chat" }); 
    } 
   
    else if (to.meta.requiresAuth && !isAuthenticated) {
      next({ name: "login" });
    } 
    
    else {
      next(); 
    }
  });
  

export default router


