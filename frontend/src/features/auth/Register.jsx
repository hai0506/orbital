import React from 'react'
import Form from '@/features/auth/Form'

const Register = () => {
  return (
    <Form route="/api/user/register/" method="register"/>
  )
}

export default Register