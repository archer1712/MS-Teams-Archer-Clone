import React, { useContext, useState, useEffect } from 'react';
import { auth } from '../Firebase'

const AuthContext = React.createContext();
// const currentUser = React.createContext();

export function useAuth(){
    return useContext(AuthContext)
}

export default function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);


    function signup(email, password, name){
        return auth.createUserWithEmailAndPassword(email,password).catch(err => {console.log(err)})
    }

   function login(email, password,name) {
       return auth.signInWithEmailAndPassword(email, password).then(cred=>{
        //    console.log("hi3")
           return cred.user.updateProfile({
               displayName:name
           })
       }).catch(err=>console.log(err));      
              
    }
    
    function logout() {
    return auth.signOut()
    }
    
    function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
    }
    
    function updateEmail(email) {
    return currentUser.updateEmail(email)
    }
    function updateName(name){
        // console.log(currentUser);
        console.log("hi2");
    return currentUser.updateProfile({
        displayName:name
    });
    }
    
    function updatePassword(password) {
    return currentUser.updatePassword(password)
    }
    
    useEffect(() => {
       
    const unsubscribe=auth.onAuthStateChanged(user => {

        setCurrentUser(user)
        // console.log("idhar");
        setLoading(false)
    })
    return unsubscribe
    },[])
    
    const value = {
    currentUser,
    login,
    signup,
    logout,
    updateName,
    resetPassword,
    updateEmail,
    updatePassword
    }
    
    return (
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
    )
}

