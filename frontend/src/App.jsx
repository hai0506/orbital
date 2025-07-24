import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateListing from "./pages/CreateListing";
import Offers from "./pages/Offers";
import Fundraisers from "./pages/Fundraisers";
import VendorFundraiser from "./pages/VendorFundraiser";
import OrgFundraiser from "./pages/OrgFundraiser";
import Chat from "./pages/Chat"
import Chats from "./pages/Chats"
import Profile from "./pages/Profile";
import Search from "./pages/Search";

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route 
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/create"
            element={
              <ProtectedRoute authRoles={["organization"]}>
                <CreateListing />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/offers"
            element={
              <ProtectedRoute>
                <Offers />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/fundraisers"
            element={
              <ProtectedRoute>
                <Fundraisers />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/vfundraiser/:id"
            element={
              <ProtectedRoute>
                <VendorFundraiser />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/ofundraiser/:id"
            element={
              <ProtectedRoute>
                <OrgFundraiser />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/chats"
            element={
              <ProtectedRoute>
                <Chats />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/search"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />}/>
          <Route path="/logout" element={<Logout />}/>
          <Route path="/register" element={<RegisterAndLogout />}/>
          <Route path="*" element={<NotFound />}/>                                  
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
