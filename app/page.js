"use client";
import { api } from "/convex/_generated/api";
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
export default function Home() {
  const { user }=useUser();
  const createUser=useMutation(api.user.createUser);

  useEffect(()=>{
    user&&checkUser();
  },[user]);

  const checkUser=async()=>{
    const result=await createUser({
      email:user?.primaryEmailAddress?.emailAddress || "unknown",
      imageUrl:user?.imageUrl,
      userName:user?.fullName
    })
    console.log(result)
  }


  return (
    <div className='hover:bg-blue-100'>HomeScreen
      <Button className='hover:bg-red-100'>Hover</Button>
        <UserButton />

    </div>  
  )
}
