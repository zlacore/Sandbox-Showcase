import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { saveBuild } from '../api/buildApi';
// Code assisted by ChatGPT
export default function ImageUpload() {
  const currentUser = useUser()

  const [file, setFile] = useState(null);
  const [text, setText] = useState('')
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTextChange = (e) => {
    setText(e.target.text)
  }

  const handleUpload = async () => {
    if (!file) return alert('Please select a file first.');

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', text)

    try {

      const token = localStorage.getItem('id_token')

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      console.log(data)
      setImageUrl(data.url);
      saveBuild({
        user: currentUser.username,
        title: formData.title,
        url: data.imageUrl
      })

    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h3>Upload images here!</h3>
      <div id='upload-card'>

        <input type="file" accept="image/*" onChange={handleFileChange} />
        <span>
          <label>title</label> <input type="text" onChange={handleTextChange} />
        </span>
      </div>
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>
      {imageUrl && (
        <div>
          <p>Uploaded Image:</p>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '300px' }} />
        </div>
      )}
    </div>
  );
}
