import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Chat from './Chat';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

const socket = io('http://localhost:5000');

function App() {
  // const [isConnected, setIsConnected] = useState(socket.connected);
  // const [roomInfo, setRoomInfo] = useState({ room: null, user: null });
  // function onConnect() {
  //   setIsConnected(true);
  // }

  // function onDisconnect() {
  //   setIsConnected(false);
  // }

  // useEffect(() => {
  //   socket.on('connect', onConnect);
  //   socket.on('disconnect', onDisconnect);


  //   return () => {
  //     socket.off('connect', onConnect);
  //     socket.off('disconnect', onDisconnect);
  //   };
  // }, []);
  // console.log(supabse);
  // const handleJoinRoom = (e) => {
  //   e.preventDefault();
  //   setRoomInfo({ room: e.target.room.value, user: e.target.user.value });
  //   socket.emit("join_room", e.target.room.value);

  // };
  // useEffect(() => {
  //   supabse.auth.getUser().then((value) => {
  //     console.log(value);
  //   });
  // }, []);
  return (
    <div className='max-w-7xl mx-auto '>
      <Toaster visibleToasts={1} position='top-center' richColors />
      <Navbar />
      <Outlet />

      {/* {isConnected ? 'connected' : "disconnected"}

      <h1>Join Room</h1>
      {roomInfo.room ?
        <Chat socket={socket} roomInfo={roomInfo} /> :
        <form onSubmit={handleJoinRoom}>
          <input type="text" required name="room" placeholder='room id' id="" />
          <input type="text" required name="user" placeholder='username' id="" />
          <button type="submit">join</button>
        </form>} */}

    </div>
  );
}

export default App;
