import React from 'react'
import Form from '@/features/auth/Form'

const Login = () => {
  return (
    <Form route="/api/token/" method="login"/>
  )
}

export default Login