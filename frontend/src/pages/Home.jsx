import React from 'react'
import { Avatar, Button, Card } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import '../styles/form.css';

const Home = () => {
  const username = localStorage.getItem("username");
  const navigate = useNavigate()
  return (
    <div className='center-container'>
      <Card.Root width="320px">
        <Card.Body gap="2">
          <Avatar.Root size="lg" shape="rounded">
            <Avatar.Fallback name={username} />
          </Avatar.Root>
          <Card.Title mt="2">Hello, {username}!</Card.Title>
          <Card.Description>
            That's it for now. See you at the end of the month!
          </Card.Description>
        </Card.Body>
        <Card.Footer justifyContent="flex-end">
          <Button onClick={() => navigate("/logout")}>Log Out</Button>
        </Card.Footer>
      </Card.Root>
    </div>
  )
}

export default Home