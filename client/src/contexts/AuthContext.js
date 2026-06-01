import React,{createContext,useContext,useReducer,useEffect} from 'react'
import {login as loginApi,signup as signupApi,logout as logoutApi,getMe}from '../api/auth'

const AuthContext=createContext()