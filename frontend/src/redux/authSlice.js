import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'auth',
    initialState:{
        user: null,
        isUserLoaded: false
    },
    reducers:{
        setUser: (state,action)=>{
            state.user = action.payload;
            window.localStorage.setItem('user',JSON.stringify(action.payload))
            state.isUserLoaded = true;
        },
        removeUser: (state)=>{
            state.user = null;
            window.localStorage.removeItem('user')
            state.isUserLoaded = true;
        },
        // setUserFromLocalStorage: state=>{
        //     const userData = window.localStorage.getItem('user')
        //     console.log(userData);
            
        //     if(userData){
        //         state.user = JSON.parse(userData);
        //     }else{
        //         state.user=null
        //     } 
        //      state.isUserLoaded = true; 
        // }
    }
}); 

export const {setUser, removeUser, setUserFromLocalStorage } = authSlice.actions

export default authSlice.reducer;