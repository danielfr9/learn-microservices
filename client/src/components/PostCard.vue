<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
const props = defineProps({
  post: {
    id: String,
    title: String,
    comments: {
      type: Array,
    },
  },
});

const newComment = ref("");
const allComments = ref(props.post.comments);

const handleSubmit = async () => {
  if (newComment.value === "") return;
  const res = await axios.post(
    `http://localhost:4001/posts/${props.post.id}/comments`,
    {
      content: newComment.value,
    }
  );
  allComments.value.push(res.data.at(-1));
  newComment.value = "";
};
</script>

<template>
  <div class="bg-gray-700 text-white rounded-lg p-4 flex flex-col">
    <span class="text-lg font-semibold">{{ post.title }}</span>
    <small>{{ allComments.length }} Comments</small>
    <ul class="list-inside list-disc mt-3 grow">
      <template v-for="comment in allComments" :key="comment.id">
        <li class="italic" v-if="comment.status === 'rejected'">
          {{ "Comment Rejected" }}
        </li>
        <li v-else-if="comment.status === 'approved'">
          {{ comment.content }}
        </li>
        <li v-else>Comment pending moderation</li>
      </template>
    </ul>
    <form @submit.prevent="handleSubmit" class="flex w-full mt-4">
      <input
        class="text-gray-600 text-sm w-full rounded-s-md p-2 px-2"
        placeholder="Write comment"
        :value="newComment"
        @input="newComment = $event.currentTarget.value"
      />
      <button class="bg-cyan-600 hover:bg-cyan-4700 rounded-e-md px-3">
        O
      </button>
    </form>
  </div>
</template>

<style lang="scss" scoped></style>
