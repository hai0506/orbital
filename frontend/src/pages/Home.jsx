import React from 'react'
import { Avatar, Button, Card } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import '../styles/form.css';
import Layout from '../components/Layout';

const Home = () => {
  const username = localStorage.getItem("username");
  const navigate = useNavigate()
  return (
    <>
      <Layout method="Listings" />
    </>
  )
}

export default Home