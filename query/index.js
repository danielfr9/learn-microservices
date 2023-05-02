const express = require("express");
const axios = require("axios");
const cors = require("cors");

const PORT = process.env.PORT || 4002;

const app = express();
app.use(cors());
app.use(express.json());

const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }
  if (type === "CommentCreated") {
    const { id, content, status, postId } = data;

    const post = posts[postId];
    post.comments.push({
      id,
      content,
      status,
    });
  }

  if (type === "CommentUpdated") {
    const { postId, id, status, content } = data;

    const post = posts[postId];

    const comment = post.comments.find((comment) => comment.id === id);
    comment.status = status;
    comment.content = content;
  }
};

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.send({});
});

app.listen(PORT, async () => {
  console.log(`Listening in port ${PORT}`);

  const res = await axios.get("http://event-bus-srv:4005/events");

  for (const event of res.data) {
    console.log("Processing Event: ", event.type);
    handleEvent(event.type, event.data);
  }
});
