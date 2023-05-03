<script setup>
import { onMounted, reactive, ref } from "vue";
import PostCard from "./components/PostCard.vue";
import axios from "axios";

const postTitle = ref("");
const posts = ref({});

onMounted(async () => {
  const res = await axios.get("http://posts.com/posts");
  posts.value = res.data;
});

const handleSubmit = async () => {
  if (postTitle.value === "") return;
  const res = await axios.post("http://posts.com/posts/create", {
    title: postTitle.value,
  });
  posts.value[res.data.id] = { ...res.data, comments: [] };
  postTitle.value = "";
};
</script>

<template>
  <div class="flex flex-col grow p-4">
    <form
      @submit.prevent="handleSubmit"
      class="flex flex-col space-y-4 max-w-lg bg-slate-700 p-4 rounded-md"
    >
      <h2 class="text-white font-semibold">Create a post</h2>
      <input
        class="w-full rounded-md p-2 text-gray-700 outline-none focus:outline-none focus:ring-2 focus:ring-teal-400"
        placeholder="New Post Title"
        :value="postTitle"
        @input="postTitle = $event.currentTarget.value"
      />
      <button
        type="submit"
        class="bg-teal-600 ring-offset-slate-700 hover:bg-teal-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-4"
      >
        Create Post
      </button>
    </form>
    <div class="w-full mt-4 flex flex-col grow">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <PostCard
          :post="post"
          v-for="post in Object.values(posts)"
          :key="post.id"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
