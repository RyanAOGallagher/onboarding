"use client";
import React from "react";
import Prompt from "./Prompt";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface PromptType {
  id: string;
  name: string;
  text: string;
  createdat: string;
  modifiedat: string;
}
const Page = () => {
  const queryClient = useQueryClient();

  // Fetch prompts
  const {
    data: prompts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["prompts"],
    queryFn: async () => {
      const response = await fetch("/api/", { method: "GET" });
      if (!response.ok) {
        throw new Error("Failed to fetch prompts");
      }
      const data = await response.json();
      return data.prompts;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/?id=${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, newText }: { id: string; newText: string }) => {
      const response = await fetch(`/api/?id=${id}`, {
        method: "PUT",
        body: JSON.stringify({ text: newText }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to update prompt");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;
  return (
    <div>
      {prompts?.map((prompt: PromptType) => (
        <Prompt
          key={prompt.id}
          id={prompt.id}
          promptName={prompt.name}
          promptText={prompt.text}
          createdat={prompt.createdat}
          modifiedat={prompt.modifiedat}
          onDelete={() => deleteMutation.mutate(prompt.id)}
          onUpdate={(newText: string) =>
            updateMutation.mutate({ id: prompt.id, newText })
          }
        />
      ))}
      <Link href="/prompt">
        <button className="bg-green-500 text-white p-4 rounded-md shadow-md mb-4">
          Add Prompt
        </button>
      </Link>
    </div>
  );
};

export default Page;
