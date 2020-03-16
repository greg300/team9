// Backend Code goes here

socket = io.connect('http://localhost:3000');

socket.on('connected', () => {
  console.log('Socket Connected')
});
socket.on('disconnect', () => {
  console.log('Socket Disconnected')
});

socket.on('data', data => {
  document.body.setAttribute('style', `background-color: hsl(${255 * data}, 100%, 50%)`);
  console.log(data);
})
