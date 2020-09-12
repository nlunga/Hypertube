var socket = io();

var movie = document.getElementById('movieName');
var tvSeries = document.getElementById('tvSeriesName');
var comment = document.getElementById('comment');
var user = document.getElementById('userName');
var sendBtn = document.getElementById('sendBtn');

// var tvcomment = document.getElementById('tvcomment');
// var tvuser = document.getElementById('tvuserName');
// var tvsendBtn = document.getElementById('tvsendBtn');

socket.on('message', (data) => {
    anOutput(data);
    chatWindow.scrollTop = chatWindow.scrollHeight;
});


function anOutput(data) {
    output.innerHTML += `<p><strong>${data.user}</strong>: ${data.commentData}</p>`;
}

sendBtn.addEventListener('click', () => {
    if (movie.value !== undefined) {
        socket.emit('comment', {
            mediaData: movie.value,
            commentData: comment.value, //I might wanna add the use who is commenting
            user: user.value,
            commentType: "movie"
        });
    } else {
        socket.emit('comment', {
            mediaData: tv.value,
            commentData: comment.value, //I might wanna add the use who is commenting
            user: user.value,
            commentType: "tv"
        });
    }
    comment.value = ""; /// Might wanna comment out
    comment.focus(); /// Might wanna comment out
});