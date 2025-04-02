"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Page() {
  const [newPrompt, setNewPrompt] = useState<{ name: string; text: string }>({
    name: "",
    text: "",
  });

  const router = useRouter();
  const queryClient = useQueryClient(); // React Query cache

  // Use Mutation for creating a prompt
  const createPromptMutation = useMutation({
    mutationFn: async (newPrompt: { name: string; text: string }) => {
      const response = await fetch("/api/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPrompt),
      });

      if (!response.ok) {
        throw new Error("Failed to create prompt");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] }); // Refresh the prompt list
      setNewPrompt({ name: "", text: "" }); // Reset form
      router.push("/"); // Redirect to prompt list
    },
    onError: (error) => {
      console.error("Error submitting form:", error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPrompt((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createPromptMutation.mutate(newPrompt);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        name="name"
        placeholder="Prompt Name"
        value={newPrompt.name}
        onChange={handleChange}
        required
        className="p-2 border rounded-md"
      />
      <input
        type="text"
        name="text"
        placeholder="Prompt Text"
        value={newPrompt.text}
        onChange={handleChange}
        required
        className="p-2 border rounded-md"
      />
      <button
        className="bg-green-500 text-white p-4 rounded-md shadow-md hover:bg-green-600 transition"
        type="submit"
        disabled={createPromptMutation.isPending} // Disable button while submitting
      >
        {createPromptMutation.isPending ? "Adding..." : "Add Prompt"}
      </button>
    </form>
  );
}
