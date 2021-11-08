<template>
  <div id="app">
    <input type="text" v-model="room">
    <button @click="handleClickJoinRoom">Join Room</button>
    <button @click="handleClickLeaveRoom">Leave Room</button>
  </div>
</template>

<script>
const { Manager } = require('socket.io-client')

const manager = new Manager(process.env.VUE_APP_SOCKET_URL, {
  reconnectionDelayMax: 10000,
  transports: ['websocket', 'polling']
})

const user = manager.socket('/user')

export default {
  name: 'App',

  data () {
    return {
      room: 'root-1'
    }
  },

  mounted () {
    user.on('test', console.log)
  },

  methods: {
    handleClickJoinRoom () {
      user.emit('join-room', { room: this.room })
    },

    handleClickLeaveRoom () {
      user.emit('leave-room', { room: this.room })
    }
  }
}
</script>
