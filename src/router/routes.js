import Lists from "../pages/Lists";
import Play from "../pages/Play";
import Home from "../pages/Home";
import Ranking from "../pages/Home/Ranking";
import Recommend from "../pages/Home/Recommend";
import Searchs from "../pages/Home/Searchs";
import Login from "../pages/Login";


const routes = [
    {
        path:'/login',
        component:Login
    },
    {
        path:'/lists',
        auth:true,
        component:Lists,
    },
    {
        path:'/play',
        auth:true,
        component:Play
    },
    {
        path:'/',
        component:Home,
        auth:true,
        children:[
            {
                path:'/home/recommend',
                component:Recommend
            },
            {
                path:'/home/ranking',
                component:Ranking
            },
            {
                path:'/home/searchs',
                component:Searchs
            },
            {
                from:'/',
                to:'/home/recommend'
            }
        ]
    },
    {
        from:'/',
        to:'/'
    }
]
export default routes