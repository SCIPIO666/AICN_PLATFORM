import api from './axios'

export const login=(email,password)=>{
    api.post('auth/login',{email,password})
    .then(res=>res.data.data)
}

export const logout=()=>{
     api.post('auth/signout',{email,password})
    .then(res=>res.data)
}

export const signup=(userData)=>{
    api.post('auth/signup',userData)
    .then(res=>res.data.data) 
}

export const forgotPassword=(email)=>{
   api.post('forgot-password',{email})
    .then(res=>res.data)  
}

export const resetPassword=(token,newPassword,confirmPassword)=>{
    api.post('reset-password',{token,newPassword,confirmPassword})
    .then(res=>res.data) 
}

export const getMe=()=>{
   api.post('auth/me')
    .then(res=>res.data.data.user)  
}