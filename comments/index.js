const express = require("express");
const axios = require("axios");
const { randomBytes } = require("crypto");
const cors = require("cors");

const PORT = process.env.PORT || 4001;

const app = express();
app.use(cors());
app.use(express.json());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];
  comments.push({
    id: commentId,
    content,
    status: "pending",
  });

  commentsByPostId[req.params.id] = comments;

  try {
    await axios.post("http://localhost:4005/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        content,
        status: "pending",
        postId: req.params.id,
      },
    });
  } catch (error) {
    console.log(error.message);
  }

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { postId, id, status, content } = data;

    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;

    try {
      await axios.post("http://localhost:4005/events", {
        type: "CommentUpdated",
        data: {
          id,
          status,
          postId,
          content: content,
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  res.send({});
});

app.listen(PORT, () => {
  console.log(`Listening in port ${PORT}`);
});
