import React, { useEffect, useState } from 'react'
import { Description, Field, Fieldset, Input, Label, Button, Select, Textarea, Checkbox } from '@headlessui/react'
import api from '../api'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pfpPreview, setPfpPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const profileRes = await api.get('core/profile/');
        console.log(profileRes)
        setProfile(profileRes.data);
        setPfpPreview(profileRes.data.pfp);
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
      finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    // setLoading(true);
    e.preventDefault();
    console.log("Updating profile")

    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("description", profile.description);
      if (profile.pfp instanceof File) {
        formData.append("pfp", profile.pfp);
      }
        console.log("Sending info:", formData);
        const route = "core/profile/"; 
        const res = await api.patch(route, formData)
        navigate('/')
    } catch (error) {
        console.log(error)
        setErrors(error.response.data)
    } finally {
        setLoading(false)
    }
  }

  if (!profile) return <p>Loading...</p>;
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Fieldset>
          <Field>
            <Label>Name:</Label><br />
            <Input type="text" name="name" value={profile.name} onChange={e => setProfile({ ...profile, [e.target.name]: e.target.value })}/>
          </Field>
          
          <Field>
            <Label>Bio:</Label><br />
            <Textarea name="description" value={profile.description} onChange={e => setProfile({ ...profile, [e.target.name]: e.target.value })}/>
          </Field>

          <Field>
            <Label>Profile Picture:</Label><br />
            <Input type="file" name="pfp" accept="image/*"
              onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  setProfile({ ...profile, pfp: file });
                  setPfpPreview(URL.createObjectURL(file));
                }
              }}/>
            {pfpPreview && (
              <img src={pfpPreview} style={{ width: '150px', marginTop: '10px', borderRadius: '8px' }}/>
              )}
          </Field>
            
            <Button type="submit">
              Save
            </Button>
        </Fieldset>
      </form>
    </div>
  )
}
export default Profile