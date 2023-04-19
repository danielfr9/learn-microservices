const express = require("express");
const axios = require("axios");

const PORT = process.env.PORT || 4003;

const app = express();
app.use(express.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "approved";

    try {
      await axios.post("http://localhost:4005/events", {
        type: "CommentModerated",
        data: {
          id: data.id,
          postId: data.postId,
          status,
          content: data.content,
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
